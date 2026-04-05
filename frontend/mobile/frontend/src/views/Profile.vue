<template>
  <div class="profile-container">
    <!-- 用户信息卡片 -->
    <div class="user-card">
      <div class="avatar-container">
        <van-image
          round
          width="80"
          height="80"
          :src="userAvatar"
          fit="cover"
        />
        <div class="avatar-edit" @click="showAvatarActionSheet = true">
          <van-icon name="photograph" size="20" />
        </div>
      </div>
      <div class="user-name">{{ user.name || '未设置姓名' }}</div>
      <div class="user-info">{{ user.email }}</div>
    </div>
    
    <!-- 基本信息 -->
    <van-cell-group inset title="基本信息">
      <van-cell title="工号" :value="user.employeeId" />
      <van-cell title="姓名" :value="user.name || '未设置'" is-link @click="showNamePopup = true" />
      <van-cell title="手机号码" :value="formatPhone(user.phone) || '未设置'" is-link @click="showPhonePopup = true" />
      <van-cell title="邮箱" :value="user.email" />
      <van-cell title="身份证号" :value="formatIdCard(user.idCard)" />
      <van-cell title="部门" :value="user.department" />
      <van-cell title="职位" :value="user.position" />
      <van-cell title="角色" :value="formatRole(user.role)" />
      <van-cell title="入职日期" :value="formatDate(user.hireDate)" />
    </van-cell-group>
    
    <!-- 人脸信息 -->
    <van-cell-group inset title="人脸信息">
      <van-cell center>
        <template #title>
          <div style="min-height: 100px; display: flex; align-items: center;">
            <van-image
              width="80"
              height="80"
              :src="user.faceInfo?.faceImageUrl"
              fit="cover"
              style="margin-right: 16px;"
            />
            <div class="face-info">
              <div>注册时间：{{ formatDateTime(user.faceInfo?.registeredAt) }}</div>
              <div>更新时间：{{ formatDateTime(user.faceInfo?.lastUpdatedAt) }}</div>
              <div>置信度：{{ user.faceInfo?.confidenceScore ? `${(user.faceInfo.confidenceScore * 100).toFixed(1)}%` : '未知' }}</div>
              <div class="face-status">
                <van-tag type="success" v-if="user.faceInfo?.status === 'VERIFIED'">已验证</van-tag>
                <van-tag type="warning" v-else>未验证</van-tag>
              </div>
            </div>
          </div>
        </template>
        <template #right-icon>
          <van-button type="primary" size="small" @click="updateFaceInfo">更新人脸</van-button>
        </template>
      </van-cell>
    </van-cell-group>
    
    <!-- 个人详细信息 -->
    <van-cell-group inset title="个人详细信息">
      <van-cell title="性别" :value="user.personalInfo?.gender" />
      <van-cell title="出生日期" :value="formatDate(user.personalInfo?.birthDate)" />
      <van-cell title="血型" :value="user.personalInfo?.bloodType" />
      <van-cell title="婚姻状况" :value="user.personalInfo?.maritalStatus" />
      <van-cell title="学历" :value="user.personalInfo?.education" />
      <van-cell title="专业" :value="user.personalInfo?.major" />
      <van-cell title="毕业院校" :value="user.personalInfo?.graduatedFrom" />
      <van-cell title="毕业年份" :value="user.personalInfo?.graduationYear" />
      <van-cell title="地址" :value="user.personalInfo?.address" is-link @click="showAddressPopup = true" />
    </van-cell-group>
    
    <!-- 紧急联系人 -->
    <van-cell-group inset title="紧急联系人">
      <van-cell title="姓名" :value="user.personalInfo?.emergency?.contactName" />
      <van-cell title="电话" :value="formatPhone(user.personalInfo?.emergency?.contactPhone)" />
      <van-cell title="关系" :value="user.personalInfo?.emergency?.relationship" />
    </van-cell-group>
    
    <!-- 证书信息 -->
    <van-cell-group inset title="证书信息">
      <template v-for="cert in user.certifications" :key="cert.number">
        <van-cell :title="cert.name" is-link @click="showCertDetail(cert)">
          <template #label>
            <div class="cert-info">
              <van-tag type="primary" size="medium">{{ cert.level }}</van-tag>
              <van-tag type="success" size="medium" v-if="cert.score">得分：{{ cert.score }}</van-tag>
            </div>
          </template>
          <template #value>
            <div style="font-size: 12px;">
              <div>证书编号：{{ cert.number }}</div>
              <div>发证机构：{{ cert.issuingAuthority }}</div>
              <div>发证日期：{{ formatDate(cert.issueDate) }}</div>
              <div>有效期至：{{ formatDate(cert.expiryDate) }}</div>
            </div>
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    
    <!-- 账户安全 -->
    <van-cell-group inset title="账户安全">
      <van-cell title="修改密码" is-link @click="showPasswordPopup = true" />
    </van-cell-group>
    
    <!-- 应用设置 -->
    <van-cell-group inset title="应用设置">
      <van-cell title="通知设置" is-link @click="showNotificationPopup = true">
        <template #right-icon>
          <van-switch v-model="notificationsEnabled" size="24" @click.stop />
        </template>
      </van-cell>
      <van-cell title="深色模式" @click="toggleDarkMode">
        <template #right-icon>
          <van-switch v-model="darkMode" size="24" @click.stop />
        </template>
      </van-cell>
      <van-cell title="语言设置" :value="language" is-link @click="showLanguagePopup = true" />
      <van-cell title="清除缓存" is-link @click="clearCache" />
      <van-cell title="关于我们" is-link @click="showAboutPopup = true" />
    </van-cell-group>
    
    <!-- 退出登录按钮 -->
    <div class="logout-button">
      <van-button type="danger" block @click="showLogoutConfirm = true">退出登录</van-button>
    </div>
    
    <!-- 修改姓名弹窗 -->
    <van-popup
      v-model:show="showNamePopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">修改姓名</div>
      <van-form @submit="updateName">
        <van-cell-group inset>
          <van-field
            v-model="nameForm.name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 修改手机号弹窗 -->
    <van-popup
      v-model:show="showPhonePopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">修改手机号</div>
      <van-form @submit="updatePhone">
        <van-cell-group inset>
          <van-field
            v-model="phoneForm.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            type="tel"
            :rules="[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 修改地址弹窗 -->
    <van-popup
      v-model:show="showAddressPopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">修改地址</div>
      <van-form @submit="updateAddress">
        <van-cell-group inset>
          <van-field
            v-model="addressForm.address"
            name="address"
            label="地址"
            placeholder="请输入地址"
            type="textarea"
            rows="3"
            autosize
            :rules="[{ required: true, message: '请输入地址' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 修改密码弹窗 -->
    <van-popup
      v-model:show="showPasswordPopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">修改密码</div>
      <van-form @submit="updatePassword">
        <van-cell-group inset>
          <van-field
            v-model="passwordForm.oldPassword"
            name="oldPassword"
            label="当前密码"
            placeholder="请输入当前密码"
            type="password"
            :rules="[{ required: true, message: '请输入当前密码' }]"
          />
          <van-field
            v-model="passwordForm.newPassword"
            name="newPassword"
            label="新密码"
            placeholder="请输入新密码"
            type="password"
            :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度不能少于6位' }]"
          />
          <van-field
            v-model="passwordForm.confirmPassword"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入新密码"
            type="password"
            :rules="[{ required: true, message: '请再次输入新密码' }, { validator: validateConfirmPassword, message: '两次输入的密码不一致' }]"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 通知设置弹窗 -->
    <van-popup
      v-model:show="showNotificationPopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">通知设置</div>
      <van-cell-group inset>
        <van-cell title="推送通知">
          <template #right-icon>
            <van-switch v-model="notificationsEnabled" size="24" @click.stop />
          </template>
        </van-cell>
        <van-cell title="预约提醒">
          <template #right-icon>
            <van-switch v-model="notificationSettings.appointment" size="24" @click.stop />
          </template>
        </van-cell>
        <van-cell title="维护提醒">
          <template #right-icon>
            <van-switch v-model="notificationSettings.maintenance" size="24" @click.stop />
          </template>
        </van-cell>
        <van-cell title="促销信息">
          <template #right-icon>
            <van-switch v-model="notificationSettings.promotion" size="24" @click.stop />
          </template>
        </van-cell>
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" @click="saveNotificationSettings">
          保存
        </van-button>
      </div>
    </van-popup>
    
    <!-- 语言选择弹窗 -->
    <van-popup
      v-model:show="showLanguagePopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择语言"
        :columns="languageOptions"
        @confirm="onLanguageConfirm"
        @cancel="showLanguagePopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 关于我们弹窗 -->
    <van-popup
      v-model:show="showAboutPopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">关于我们</div>
      <div class="about-content">
        <div class="app-logo">
          <van-image
            width="80"
            height="80"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png"
            fit="contain"
          />
        </div>
        <div class="app-name">车辆管理系统</div>
        <div class="app-version">版本 1.0.0</div>
        <div class="app-description">
          车辆管理系统是一款专为车主设计的应用，提供车辆信息管理、预约服务、维护记录等功能，让您的用车体验更加便捷。
        </div>
        <div class="app-copyright">
          © 2023 车辆管理系统 版权所有
        </div>
      </div>
    </van-popup>
    
    <!-- 头像选择动作面板 -->
    <van-action-sheet
      v-model:show="showAvatarActionSheet"
      title="更换头像"
      cancel-text="取消"
      close-on-click-action
    >
      <div class="avatar-actions">
        <van-cell title="拍照" icon="photograph" @click="takePhoto" />
        <van-cell title="从相册选择" icon="photo-o" @click="chooseFromAlbum" />
      </div>
    </van-action-sheet>
    
    <!-- 退出登录确认弹窗 -->
    <van-dialog
      v-model:show="showLogoutConfirm"
      title="退出登录"
      show-cancel-button
      @confirm="logout"
    >
      <div class="logout-confirm-content">
        确定要退出登录吗？
      </div>
    </van-dialog>

    <!-- 证书详情弹窗 -->
    <van-popup
      v-model:show="showCertDetailPopup"
      round
      position="bottom"
      closeable
    >
      <div class="popup-title">证书详情</div>
      <div class="cert-detail" v-if="selectedCert">
        <van-cell-group inset>
          <van-cell title="证书名称" :value="selectedCert.name" />
          <van-cell title="证书编号" :value="selectedCert.number" />
          <van-cell title="发证机构" :value="selectedCert.issuingAuthority" />
          <van-cell title="发证日期" :value="formatDate(selectedCert.issueDate)" />
          <van-cell title="有效期至" :value="formatDate(selectedCert.expiryDate)" />
          <van-cell title="认证等级" :value="selectedCert.level" />
          <van-cell title="认证分数" :value="selectedCert.score ? `${selectedCert.score}分` : '暂无'" />
        </van-cell-group>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useAuthStore } from '../stores/auth';
import { getItem, setItem } from '../utils/storage.js';

const router = useRouter();
const authStore = useAuthStore();

// 用户信息
const user = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: ''
});

// 表单数据
const nameForm = ref({ name: '' });
const phoneForm = ref({ phone: '' });
const addressForm = ref({ address: '' });
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 状态变量
const submitting = ref(false);
const darkMode = ref(false);
const notificationsEnabled = ref(true);
const language = ref('简体中文');
const notificationSettings = ref({
  appointment: true,
  maintenance: true,
  promotion: false
});

// 弹窗控制
const showNamePopup = ref(false);
const showPhonePopup = ref(false);
const showAddressPopup = ref(false);
const showPasswordPopup = ref(false);
const showNotificationPopup = ref(false);
const showLanguagePopup = ref(false);
const showAboutPopup = ref(false);
const showAvatarActionSheet = ref(false);
const showLogoutConfirm = ref(false);
const showCertDetailPopup = ref(false);

// 选中的证书
const selectedCert = ref(null);

// 语言选项
const languageOptions = [
  '简体中文',
  'English',
  '日本語',
  '한국어'
];

// 计算属性
const userAvatar = computed(() => {
  return user.value.avatar || 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';
});

// 初始化数据
onMounted(async () => {
  await fetchUserInfo();
  
  // 初始化表单数据
  nameForm.value.name = user.value.name || '';
  phoneForm.value.phone = user.value.phone || '';
  addressForm.value.address = user.value.address || '';
  
  // 从本地存储加载设置
  loadSettings();
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userInfo = await authStore.getUserInfo();
    if (userInfo) {
      user.value = userInfo;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    if (error === '未登录') {
      // 已经在 store 中处理了未登录的跳转
      return;
    }
    showNotify({
      type: 'danger',
      message: error || '获取用户信息失败',
      duration: 2000
    });
  }
};

// 加载设置
const loadSettings = () => {
  // 从本地存储加载设置
  const savedDarkMode = getItem('darkMode');
  if (savedDarkMode !== null) {
    darkMode.value = savedDarkMode === 'true';
    applyDarkMode(darkMode.value);
  }
  
  const savedNotifications = getItem('notificationsEnabled');
  if (savedNotifications !== null) {
    notificationsEnabled.value = savedNotifications === 'true';
  }
  
  const savedLanguage = getItem('language');
  if (savedLanguage) {
    language.value = savedLanguage;
  }
  
  const savedNotificationSettings = getItem('notificationSettings');
  if (savedNotificationSettings) {
    try {
      notificationSettings.value = JSON.parse(savedNotificationSettings);
    } catch (e) {
      console.error('解析通知设置失败:', e);
    }
  }
};

// 格式化手机号
const formatPhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1 $2 $3');
};

// 格式化角色
const formatRole = (role) => {
  const roleMap = {
    'USER': '普通用户',
    'SENIOR_ENGINEER': '高级工程师',
    'ADMIN': '系统管理员'
  };
  return roleMap[role] || role;
};

// 格式化身份证号
const formatIdCard = (idCard) => {
  if (!idCard) return '';
  return idCard.replace(/^(\d{6})(\d{8})(\d{4})$/, '$1********$3');
};

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 验证确认密码
const validateConfirmPassword = (val) => {
  return val === passwordForm.value.newPassword;
};

// 更新姓名
const updateName = async () => {
  try {
    submitting.value = true;
    await authStore.updateUserInfo({ name: nameForm.value.name });
    user.value.name = nameForm.value.name;
    showToast('姓名更新成功');
    showNamePopup.value = false;
  } catch (error) {
    console.error('更新姓名失败:', error);
    showNotify({ type: 'danger', message: '更新姓名失败' });
  } finally {
    submitting.value = false;
  }
};

// 更新手机号
const updatePhone = async () => {
  try {
    submitting.value = true;
    await authStore.updateUserInfo({ phone: phoneForm.value.phone });
    user.value.phone = phoneForm.value.phone;
    showToast('手机号更新成功');
    showPhonePopup.value = false;
  } catch (error) {
    console.error('更新手机号失败:', error);
    showNotify({ type: 'danger', message: '更新手机号失败' });
  } finally {
    submitting.value = false;
  }
};

// 更新地址
const updateAddress = async () => {
  try {
    submitting.value = true;
    await authStore.updateUserInfo({ address: addressForm.value.address });
    user.value.address = addressForm.value.address;
    showToast('地址更新成功');
    showAddressPopup.value = false;
  } catch (error) {
    console.error('更新地址失败:', error);
    showNotify({ type: 'danger', message: '更新地址失败' });
  } finally {
    submitting.value = false;
  }
};

// 更新密码
const updatePassword = async () => {
  try {
    submitting.value = true;
    await authStore.changePassword({
      oldPassword: passwordForm.value.oldPassword,
      newPassword: passwordForm.value.newPassword
    });
    showToast('密码更新成功');
    showPasswordPopup.value = false;
    
    // 清空密码表单
    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  } catch (error) {
    console.error('更新密码失败:', error);
    showNotify({ type: 'danger', message: '更新密码失败' });
  } finally {
    submitting.value = false;
  }
};

// 切换深色模式
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  applyDarkMode(darkMode.value);
  setItem('darkMode', darkMode.value.toString());
};

// 应用深色模式
const applyDarkMode = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// 语言确认
const onLanguageConfirm = (value) => {
  language.value = value;
  setItem('language', value);
  showLanguagePopup.value = false;
  showToast('语言设置已更新');
};

// 保存通知设置
const saveNotificationSettings = () => {
  setItem('notificationsEnabled', notificationsEnabled.value.toString());
  setItem('notificationSettings', JSON.stringify(notificationSettings.value));
  showNotificationPopup.value = false;
  showToast('通知设置已保存');
};

// 清除缓存
const clearCache = () => {
  // 模拟清除缓存
  setTimeout(() => {
    showToast('缓存已清除');
  }, 1000);
};

// 拍照
const takePhoto = () => {
  // 模拟拍照功能
  showToast('拍照功能暂未实现');
};

// 从相册选择
const chooseFromAlbum = () => {
  // 模拟从相册选择功能
  showToast('相册选择功能暂未实现');
};

// 显示证书详情
const showCertDetail = (cert) => {
  selectedCert.value = cert;
  showCertDetailPopup.value = true;
};

// 更新人脸信息
const updateFaceInfo = () => {
  // 模拟更新人脸信息
  showToast('更新人脸信息功能暂未实现');
};

// 退出登录
const logout = async () => {
  try {
    await authStore.logout();
    router.push('/login');
  } catch (error) {
    console.error('退出登录失败:', error);
    showNotify({ type: 'danger', message: '退出登录失败' });
  }
};
</script>

<style lang="less" scoped>
.profile-container {
  padding: 16px;
  padding-bottom: 32px;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  margin-bottom: 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(100, 101, 102, 0.08);
}

.avatar-container {
  position: relative;
  margin-bottom: 16px;
}

.avatar-edit {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 24px;
  height: 24px;
  background-color: #1989fa;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  cursor: pointer;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-info {
  font-size: 14px;
  color: #969799;
}

.logout-button {
  margin-top: 24px;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.about-content {
  padding: 24px 16px;
  text-align: center;
}

.app-logo {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.app-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
}

.app-version {
  font-size: 14px;
  color: #969799;
  margin-bottom: 16px;
}

.app-description {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  text-align: left;
}

.app-copyright {
  font-size: 12px;
  color: #969799;
}

.avatar-actions {
  padding: 8px 0;
}

.logout-confirm-content {
  padding: 20px 16px;
  text-align: center;
}

.cert-info {
  margin: 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .van-tag {
    border-radius: 4px;
    
    &--primary {
      background-color: #1989fa;
    }
    
    &--success {
      background-color: #07c160;
    }
  }
}

.cert-detail {
  padding: 16px;
}

.face-info {
  font-size: 14px;
  line-height: 1.6;
  
  .face-status {
    margin-top: 4px;
  }
  
  .van-tag {
    border-radius: 4px;
    padding: 0 8px;
    
    &--success {
      background-color: #07c160;
    }
    
    &--warning {
      background-color: #ff976a;
    }
  }
}

// 深色模式样式
:global(.dark) {
  .user-card {
    background-color: #1c1c1e;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  }
  
  .user-name {
    color: #fff;
  }
  
  .user-info {
    color: #a2a2a2;
  }
}
</style>