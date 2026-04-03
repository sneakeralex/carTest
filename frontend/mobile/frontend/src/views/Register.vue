<template>
  <div class="register-container">
    <h2>注册新账号</h2>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <!-- 姓名改为必填字段，映射到 staffName -->
        <van-field v-model="form.staffName" name="staffName" label="姓名" placeholder="请输入姓名" :rules="[{ required: true, message: '请输入姓名' }]" />
        <van-field v-model="form.password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[{ required: true, validator: validatePassword, message: '密码不符合安全要求' }]" />
        <p class="password-hint">密码必须至少8位，包含大写字母、小写字母、数字和特殊字符。</p>
        <van-field v-model="form.confirmPassword" type="password" name="confirmPassword" label="确认密码" placeholder="请再次输入密码" :rules="[{ required: true, validator: validateConfirmPassword, message: '两次输入的密码不一致' }]" />
        <!-- 新增手机号为必填 -->
        <van-field v-model="form.phone" name="phone" label="手机号" placeholder="请输入手机号" :rules="[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]" />
        <!-- 新增性别字段（默认 男 = '0'） - 使用更紧凑的样式 -->
        <div class="gender-field">
          <!-- reuse Vant field label class so visual style matches other fields -->
          <div class="gender-label van-field__label">性别</div>
          <van-radio-group v-model="form.gender" class="gender-radio-group">
            <van-radio name="0">男</van-radio>
            <van-radio name="1">女</van-radio>
          </van-radio-group>
        </div>
        <!-- 可选地址字段 -->
        <van-field v-model="form.address" name="address" label="地址" placeholder="请选择或填写地址（可选）" />
        <!-- 保留邮箱但设为可选 -->
        <van-field v-model="form.email" name="email" label="邮箱（可选）" placeholder="请输入邮箱（可选）" :rules="[{ validator: validateEmail, message: '请输入有效的邮箱地址' }]" />
      </van-cell-group>
      <van-button block type="primary" native-type="submit" :loading="loading">注册</van-button>
      <van-button block plain type="default" class="back-login-button" @click="goLogin">返回登录</van-button>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();
const loading = ref(false);

const form = ref({
  staffName: '', // 用户姓名
  password: '',
  confirmPassword: '',
  phone: '',     // 必填手机号
  gender: '0',   // 性别：'0' 男, '1' 女（默认男）
  address: '',   // 可选地址
  email: ''      // 可选邮箱
});

const validatePassword = (value) => {
  if (!value) return false;
  
  // 密码长度至少8位
  if (value.length < 8) {
    return false;
  }
  
  // 必须包含至少一个大写字母
  if (!/[A-Z]/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个小写字母
  if (!/[a-z]/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个数字
  if (!/\d/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return false;
  }
  
  return true;
};

const validateConfirmPassword = (value) => {
  return value === form.value.password;
};

// 邮箱为可选；若不填则通过校验，若填写则校验格式
const validateEmail = (value) => {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

const onSubmit = async () => {
  loading.value = true;
  try {
    const userData = { ...form.value };
    delete userData.confirmPassword; // 移除确认密码字段
    // Map frontend field names to backend expected fields if needed
    // auth.register expects staffName, phone, address, password
    console.log('注册提交：', userData);
    await authStore.register(userData);
    showNotify({ type: 'success', message: '注册成功' });
    router.push('/login');
  } catch (error) {
    // Normalize error to a string message for VanNotify (expects Number | String)
    let msg = '注册失败';
    try {
      if (!error) {
        msg = '注册失败';
      } else if (typeof error === 'string') {
        msg = error;
      } else if (error.message) {
        msg = error.message;
      } else if (error.response && error.response.data) {
        // axios style
        msg = error.response.data.msg || error.response.data.message || JSON.stringify(error.response.data);
      } else if (error.data) {
        msg = error.data.msg || error.data.message || JSON.stringify(error.data);
      }
    } catch (e) {
      msg = '注册失败';
    }
    console.error('注册错误：', error);
    showNotify({ type: 'danger', message: msg });
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  padding: 32px;
}

.password-hint {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.password-hint {
  margin: 8px 16px;
  color: #969799;
  font-size: 12px;
  line-height: 1.4;
}

/* Compact gender radio styles */
.gender-field {
  display: flex;
  align-items: center;
  gap: 12px;
  /* match spacing of other van-field items inside van-cell-group */
  margin: 8px 16px 0 16px;
}
.gender-field .gender-label {
  margin: 0;
  /* let Vant's .van-field__label control color/font; keep width for alignment */
  min-width: 44px; /* reserve space for label to align radios */
}
.gender-radio-group {
  display: flex;
  gap: 12px;
  align-items: center;
}
/* Reduce radio icon size and label font */
.gender-radio-group .van-radio__icon {
  width: 16px !important;
  height: 16px !important;
}
.gender-radio-group .van-radio__label {
  font-size: 14px !important;
  line-height: 1;
}

/* Make all van field labels consistent in this component */
.van-field__label {
  font-size: 14px !important;
  line-height: 1.2 !important;
}

/* small spacing for back button */
.back-login-button { margin-top: 12px; }

</style>