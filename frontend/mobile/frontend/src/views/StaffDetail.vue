<template>
  <div class="staff-detail-container">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="isEditing ? '编辑人员' : '人员详情'"
      left-arrow
      @click-left="goBack"
      :right-text="isEditing ? '保存' : '编辑'"
      @click-right="onRightClick"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" size="24px">加载中...</van-loading>
    </div>

    <!-- 详情内容 -->
    <template v-else-if="!isEditing && staff">
      <van-cell-group inset class="info-group">
        <van-cell title="工号" :value="staff.employeeId" />
        <van-cell title="姓名" :value="staff.name" />
        <van-cell title="人员类型" :value="getStaffTypeText(staff.type)" />
        <van-cell title="联系方式" :value="staff.phone" />
        <van-cell title="性别" :value="staff.genderText" />
        <van-cell title="部门" :value="staff.department" />
        <van-cell title="职位" :value="staff.position" />
        <van-cell title="授权开始日期" :value="staff.authStartDate" />
        <van-cell title="授权结束日期" :value="staff.authEndDate" />
        <van-cell title="备注" :value="staff.remarks" label-align="top" />
      </van-cell-group>

      <!-- 证件材料 -->
      <van-cell-group inset class="info-group" v-if="staff.type === 'DRIVER'">
        <div class="upload-title">证件材料</div>
        <van-grid :column-num="3" :gutter="10">
          <van-grid-item>
            <van-uploader
              v-model="driverLicenseFiles"
              :max-count="1"
              :before-read="beforeRead"
              :after-read="(file) => handleUpload(file, 'driverLicense')"
              @delete="(file) => handleDelete('driverLicense')"
            >
              <div class="upload-item">
                <template v-if="staff.driverLicenseUrl">
                  <van-image 
                    :src="staff.driverLicenseUrl" 
                    fit="cover"
                    @click="(e) => previewImage(e, staff.driverLicenseUrl)"  
                  />
                  <div class="upload-label">驾驶证(已上传)</div>
                </template>
                <template v-else>
                  <van-icon name="photograph" size="24" />
                  <div class="upload-label">上传驾驶证</div>
                </template>
              </div>
            </van-uploader>
          </van-grid-item>
          <van-grid-item>
            <van-uploader
              v-model="idCardFiles"
              :max-count="1"
              :before-read="beforeRead"
              :after-read="(file) => handleUpload(file, 'idCard')"
              @delete="(file) => handleDelete('idCard')"
            >
              <div class="upload-item">
                <template v-if="staff.idCardUrl">
                  <van-image 
                    :src="staff.idCardUrl" 
                    fit="cover"
                    @click="(e) => previewImage(e, staff.idCardUrl)" 
                  />
                  <div class="upload-label">身份证(已上传)</div>
                </template>
                <template v-else>
                  <van-icon name="photograph" size="24" />
                  <div class="upload-label">上传身份证</div>
                </template>
              </div>
            </van-uploader>
          </van-grid-item>
          <van-grid-item>
            <van-uploader
              v-model="insuranceFiles"
              :max-count="1"
              :before-read="beforeRead"
              :after-read="(file) => handleUpload(file, 'insurance')"
              @delete="(file) => handleDelete('insurance')"
            >
              <div class="upload-item">
                <template v-if="staff.insuranceUrl">
                  <van-image 
                    :src="staff.insuranceUrl" 
                    fit="cover" 
                    @click="(e) => previewImage(e, staff.insuranceUrl)"
                  />
                  <div class="upload-label">保险单(已上传)</div>
                </template>
                <template v-else>
                  <van-icon name="photograph" size="24" />
                  <div class="upload-label">上传保险单</div>
                </template>
              </div>
            </van-uploader>
          </van-grid-item>
        </van-grid>
        
        <!-- 图片预览 -->
        <van-image-preview
          v-model:show="showImagePreview"
          :images="[previewUrl]"
          :closeable="true"
        />
      </van-cell-group>

      <!-- 底部操作按钮 -->
      <div class="bottom-buttons">
        <van-button type="danger" block @click="showDeleteConfirm">删除人员</van-button>
      </div>
    </template>

    <!-- 编辑表单 -->
    <template v-else>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="editForm.name"
            name="name"
            label="姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="editForm.type"
            name="type"
            label="人员类型"
            readonly
            is-link
            @click="showStaffTypePopup = true"
            :rules="[{ required: true, message: '请选择人员类型' }]"
          />
          <van-field
            v-model="editForm.phone"
            name="phone"
            label="联系方式"
            :rules="[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]"
          />
          <van-field
            v-model="editForm.gender"
            name="gender"
            label="性别"
            readonly
            is-link
            @click="showGenderPopup = true"
            :rules="[{ required: true, message: '请选择性别' }]"
          />
          <van-field
            v-model="editForm.department"
            name="department"
            label="部门"
            :rules="[{ required: true, message: '请输入部门' }]"
          />
          <van-field
            v-model="editForm.position"
            name="position"
            label="职位"
            :rules="[{ required: true, message: '请输入职位' }]"
          />
          <van-field
            v-model="editForm.authStartDate"
            name="authStartDate"
            label="授权开始日期"
            readonly
            is-link
            @click="showStartDatePicker = true"
            :rules="[{ required: true, message: '请选择授权开始日期' }]"
          />
          <van-field
            v-model="editForm.authEndDate"
            name="authEndDate"
            label="授权结束日期"
            readonly
            is-link
            @click="showEndDatePicker = true"
            :rules="[{ required: true, message: '请选择授权结束日期' }]"
          />
          <van-field
            v-model="editForm.remarks"
            name="remarks"
            label="备注"
            type="textarea"
            rows="3"
          />
        </van-cell-group>
      </van-form>
    </template>

    <!-- 人员类型选择弹窗 -->
    <van-popup v-model:show="showStaffTypePopup" position="bottom">
      <van-picker
        :columns="staffTypeOptions"
        @confirm="onStaffTypeConfirm"
        @cancel="showStaffTypePopup = false"
        show-toolbar
      />
    </van-popup>

    <!-- 性别选择弹窗 -->
    <van-popup v-model:show="showGenderPopup" position="bottom">
      <van-picker
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPopup = false"
        show-toolbar
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-calendar
      v-model:show="showStartDatePicker"
      @confirm="onStartDateConfirm"
      :min-date="minDate"
      :max-date="maxDate"
    />
    <van-calendar
      v-model:show="showEndDatePicker"
      @confirm="onEndDateConfirm"
      :min-date="editForm.authStartDate ? new Date(editForm.authStartDate) : minDate"
      :max-date="maxDate"
    />

    <!-- 删除确认对话框 -->
    <van-dialog
      v-model:show="showDeleteDialog"
      title="删除确认"
      show-cancel-button
      @confirm="onConfirmDelete"
    >
      <p class="dialog-content">确定要删除该人员吗？此操作不可恢复。</p>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStaffStore } from '@/stores/staff';
import { showToast, showDialog } from 'vant';

const route = useRoute();
const router = useRouter();
const staffStore = useStaffStore();

// 状态变量
const loading = ref(true);
const isEditing = ref(false);
const staff = ref(null);
const showStaffTypePopup = ref(false);
const showGenderPopup = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const showDeleteDialog = ref(false);
const showImagePreview = ref(false);
const previewUrl = ref('');

// 表单数据
const editForm = ref({
  name: '',
  type: '',
  phone: '',
  gender: '',
  department: '',
  position: '',
  authStartDate: '',
  authEndDate: '',
  remarks: ''
});

// 选项数据
const staffTypeOptions = [
  { text: '授权人', value: 'AUTHORIZER' },
  { text: '负责人', value: 'MANAGER' },
  { text: '驾驶员', value: 'DRIVER' }
];

const genderOptions = [
  { text: '男', value: 'MALE' },
  { text: '女', value: 'FEMALE' }
];

const minDate = new Date(2000, 0, 1);
const maxDate = new Date(2099, 11, 31);

// 上传文件状态
const driverLicenseFiles = ref([]);
const idCardFiles = ref([]);
const insuranceFiles = ref([]);

// 加载人员详情数据
const loadStaffDetail = async () => {
  try {
    loading.value = true;
    const userId = route.params.id;
    console.log('StaffDetail - Route params:', route.params);
    console.log('StaffDetail - Loading staff detail for ID:', userId);
    
    if (!userId) {
      throw new Error('无效的人员ID');
    }

    // 首先尝试从store的currentStaff获取数据
    let data = staffStore.currentStaff;
    console.log('StaffDetail - Current staff in store:', data);

    // 如果store中没有数据，则从API获取
    if (!data || data.userId.toString() !== userId.toString()) {
      console.log('StaffDetail - Fetching from API...');
      data = await staffStore.getStaffDetail(userId);
    }

    console.log('StaffDetail - Final staff data:', data);
    if (!data) {
      throw new Error('未找到人员信息');
    }

    // 更新本地数据
    staff.value = {...data};
    
    // 初始化编辑表单数据
    editForm.value = {
      userId: data.userId,
      employeeId: data.employeeId,
      name: data.name || '',
      type: data.type || '',
      phone: data.phone || '',
      gender: data.gender || '',
      genderText: data.genderText || '',
      department: data.department || '',
      position: data.position || '',
      authStartDate: data.authStartDate || '',
      authEndDate: data.authEndDate || '',
      remarks: data.remarks || ''
    };
    
    console.log('StaffDetail - Form data initialized:', editForm.value);
  } catch (error) {
    console.error('StaffDetail - Error:', error);
    showToast({
      type: 'fail',
      message: error.message || '加载失败'
    });
    router.back();
  } finally {
    loading.value = false;
  }
};

// 保存编辑
const onSubmit = async () => {
  try {
    const userId = route.params.id;
    await staffStore.updateStaff({
      userId,
      ...editForm.value
    });
    showToast({
      type: 'success',
      message: '保存成功'
    });
    isEditing.value = false;
    await loadStaffDetail();
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '保存失败'
    });
  }
};

// 删除确认
const showDeleteConfirm = () => {
  showDeleteDialog.value = true;
};

// 执行删除
const onConfirmDelete = async () => {
  try {
    const userId = route.params.id;
    await staffStore.deleteStaff(userId);
    showToast({
      type: 'success',
      message: '删除成功'
    });
    router.back();
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '删除失败'
    });
  }
};

// 工具函数：获取人员类型文本
const getStaffTypeText = (type) => {
  const option = staffTypeOptions.find(opt => opt.value === type);
  return option ? option.text : type;
};

// 上传文件处理
const handleUpload = async (file, type) => {
  try {
    console.log('Uploading file:', file, 'type:', type);
    loading.value = true;
    
    // 检查文件大小（限制为5MB）
    if (file.file.size > 5 * 1024 * 1024) {
      throw new Error('文件大小不能超过5MB');
    }

    // 检查文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.file.type)) {
      throw new Error('只支持JPG、PNG和PDF格式文件');
    }

    // 上传文件
    const formData = new FormData();
    formData.append('file', file.file);
    formData.append('type', type);
    formData.append('staffId', staff.value.userId);

    const result = await staffStore.uploadStaffDocument(formData);
    
    // 更新本地数据
    if (result) {
      const urlKey = `${type}Url`;
      staff.value[urlKey] = result.url;
      
      // 显示成功消息
      showToast({
        type: 'success',
        message: '上传成功'
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    showToast({
      type: 'fail',
      message: error.message || '上传失败'
    });
    
    // 清除对应的文件
    switch (type) {
      case 'driverLicense':
        driverLicenseFiles.value = [];
        break;
      case 'idCard':
        idCardFiles.value = [];
        break;
      case 'insurance':
        insuranceFiles.value = [];
        break;
    }
  } finally {
    loading.value = false;
  }
};

// 删除文件处理
const handleDelete = async (type) => {
  try {
    await showDialog({
      title: '确认删除',
      message: '确定要删除此文件吗？',
      showCancelButton: true,
    });

    // 清除本地文件显示
    const urlKey = `${type}Url`;
    staff.value[urlKey] = '';
    
    // 清除对应的文件列表
    switch (type) {
      case 'driverLicense':
        driverLicenseFiles.value = [];
        break;
      case 'idCard':
        idCardFiles.value = [];
        break;
      case 'insurance':
        insuranceFiles.value = [];
        break;
    }

    showToast('文件已删除');
  } catch (error) {
    // 用户取消删除
    console.log('删除已取消');
  }
};

// 图片预览
const previewImage = (e, url) => {
  e.stopPropagation();
  previewUrl.value = url;
  showImagePreview.value = true;
};

// 文件读取前处理
const beforeRead = (file) => {
  // 检查文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    showToast({
      type: 'fail',
      message: '文件大小不能超过5MB'
    });
    return false;
  }

  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    showToast({
      type: 'fail',
      message: '只支持JPG、PNG和PDF格式文件'
    });
    return false;
  }

  return true;
};

// 事件处理函数
const goBack = () => {
  if (isEditing.value) {
    showDialog({
      title: '确认返回',
      message: '未保存的修改将会丢失，确定要返回吗？',
      showCancelButton: true
    }).then((action) => {
      if (action === 'confirm') {
        isEditing.value = false;
        Object.assign(editForm.value, staff.value);
      }
    });
  } else {
    router.back();
  }
};

const onRightClick = () => {
  if (isEditing.value) {
    // 触发表单提交
    document.querySelector('form').dispatchEvent(new Event('submit'));
  } else {
    isEditing.value = true;
  }
};

const onStaffTypeConfirm = ({ selectedOptions }) => {
  editForm.value.type = selectedOptions[0].value;
  showStaffTypePopup.value = false;
};

const onGenderConfirm = ({ selectedOptions }) => {
  editForm.value.gender = selectedOptions[0].value;
  showGenderPopup.value = false;
};

const onStartDateConfirm = (date) => {
  editForm.value.authStartDate = date.toISOString().split('T')[0];
  showStartDatePicker.value = false;
};

const onEndDateConfirm = (date) => {
  editForm.value.authEndDate = date.toISOString().split('T')[0];
  showEndDatePicker.value = false;
};

// 生命周期钩子
onMounted(() => {
  loadStaffDetail();
});
</script>

<style scoped>
.staff-detail-container {
  padding-bottom: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.info-group {
  margin-top: 12px;
}

.bottom-buttons {
  margin: 20px 16px;
}

.dialog-content {
  padding: 20px 16px;
  text-align: center;
  color: #666;
}

.upload-title {
  font-size: 16px;
  font-weight: 500;
  padding: 12px 16px;
  border-bottom: 1px solid #ebedf0;
}

.upload-item {
  width: 100%;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f7f8fa;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.upload-label {
  margin-top: 8px;
  font-size: 12px;
  color: #969799;
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px 0;
}

:deep(.van-uploader__wrapper) {
  width: 100%;
}

:deep(.van-uploader__input-wrapper) {
  width: 100%;
}

:deep(.van-uploader__preview-image) {
  width: 100% !important;
  height: 120px !important;
  object-fit: cover;
}

:deep(.van-uploader__preview) {
  margin: 0;
  width: 100%;
}

:deep(.van-uploader__preview-delete) {
  right: 0;
  top: 0;
  padding: 8px;
  background-color: rgba(0, 0, 0, 0.7);
}

:deep(.van-uploader__preview-delete-icon) {
  transform: scale(1.2);
}

:deep(.van-image-preview__close-icon) {
  color: #fff;
}
</style>
