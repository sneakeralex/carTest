<template>
  <div class="staff-management-container">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="人员管理" 
      left-arrow 
      @click-left="$router.back()"
    >
      <template #right>
        <van-icon name="plus" @click="showAddStaffPopup = true" style="font-size: 20px;" />
      </template>
    </van-nav-bar>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索人员姓名或工号"
        @search="onSearch"
      />
    </div>

    <!-- 人员类型筛选 -->
    <van-tabs v-model:active="activeTab" sticky @change="onTabChange">
      <van-tab name="ALL" title="全部" />
      <van-tab name="AUTHORIZER" title="授权人" />
      <van-tab name="MANAGER" title="负责人" />
      <van-tab name="DRIVER" title="驾驶员" />
    </van-tabs>

    <!-- 人员列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <template v-if="loading">
          <div class="loading-placeholder">
            <van-loading type="spinner" />
          </div>
        </template>
        <div v-else class="staff-list">
          <van-swipe-cell
            v-for="staff in filteredStaffList"
            :key="staff.userId"
          >
            <van-cell
              :title="staff.name"
              :label="staff.position + ' | ' + staff.department"
              is-link
              @click="goToDetail(staff)"
            >
              <template #value>
                <van-tag :type="getStaffTypeTagType(staff.type)">
                  {{ getStaffTypeText(staff.type) }}
                </van-tag>
              </template>
            </van-cell>
            <template #right>
              <van-button 
                type="primary" 
                square 
                text="编辑" 
                @click="editStaff(staff)"
              />
              <van-button 
                type="danger" 
                square 
                text="删除" 
                @click="deleteStaff(staff)"
              />
            </template>
          </van-swipe-cell>
        </div>
      </van-list>
    </van-pull-refresh>

    <!-- 添加/编辑人员弹窗 -->
    <van-popup
      v-model:show="showAddStaffPopup"
      position="bottom"
      round
      closeable
    >
      <div class="popup-title">{{ isEditing ? '编辑人员' : '添加人员' }}</div>
      <van-form @submit="onSubmitStaff">
        <van-cell-group inset>
          <van-field
            v-model="staffForm.name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请输入姓名' }]"
          />
          <van-field
            v-model="staffForm.type"
            name="type"
            label="人员类型"
            placeholder="请选择人员类型"
            readonly
            is-link
            @click="showStaffTypePopup = true"
            :rules="[{ required: true, message: '请选择人员类型' }]"
          />
          <van-field
            v-model="staffForm.phone"
            name="phone"
            label="联系方式"
            placeholder="请输入手机号"
            :rules="[{ required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]"
          />
          <van-field
            v-model="staffForm.gender"
            name="gender"
            label="性别"
            readonly
            is-link
            @click="showGenderPopup = true"
            :rules="[{ required: true, message: '请选择性别' }]"
          />
          <van-field
            v-model="staffForm.authStartDate"
            name="authStartDate"
            label="授权开始日期"
            readonly
            is-link
            @click="showStartDatePicker = true"
            :rules="[{ required: true, message: '请选择授权开始日期' }]"
          />
          <van-field
            v-model="staffForm.authEndDate"
            name="authEndDate"
            label="授权结束日期"
            readonly
            is-link
            @click="showEndDatePicker = true"
            :rules="[{ required: true, message: '请选择授权结束日期' }]"
          />
          <van-field
            v-model="staffForm.remarks"
            name="remarks"
            label="备注"
            type="textarea"
            rows="2"
            autosize
            placeholder="请输入备注信息"
          />
        </van-cell-group>
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            {{ isEditing ? '保存' : '添加' }}
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 人员类型选择弹窗 -->
    <van-popup
      v-model:show="showStaffTypePopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择人员类型"
        :columns="staffTypeColumns"
        @confirm="onStaffTypeConfirm"
        @cancel="showStaffTypePopup = false"
        show-toolbar
      />
    </van-popup>

    <!-- 性别选择弹窗 -->
    <van-popup
      v-model:show="showGenderPopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择性别"
        :columns="genderColumns"
        @confirm="onGenderConfirm"
        @cancel="showGenderPopup = false"
        show-toolbar
      />
    </van-popup>

    <!-- 日期选择弹窗 -->
    <van-calendar
      v-model:show="showStartDatePicker"
      @confirm="onStartDateConfirm"
      :min-date="minDate"
      :max-date="maxDate"
      title="选择授权开始日期"
    />
    <van-calendar
      v-model:show="showEndDatePicker"
      @confirm="onEndDateConfirm"
      :min-date="startDate"
      :max-date="maxDate"
      title="选择授权结束日期"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStaffStore } from '@/stores/staff';
import { showToast, showDialog } from 'vant';

const router = useRouter();
const staffStore = useStaffStore();

// 状态变量
const searchKeyword = ref('');
const activeTab = ref('ALL');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const staffList = ref([]);    // 初始化数据
const initializeData = async () => {
  try {
    loading.value = true;
    const data = await staffStore.fetchStaffList();
    console.log('Fetched staff list:', data);
    staffList.value = data || [];
    if (!data || data.length === 0) {
      showToast({
        type: 'fail',
        message: '暂无人员数据'
      });
    }
  } catch (error) {
    console.error('Error fetching staff list:', error);
    showToast({
      type: 'fail',
      message: error.message || '加载失败'
    });
  } finally {
    loading.value = false;
    finished.value = true;
  }
};

// 计算属性：根据搜索和筛选条件过滤的人员列表
const filteredStaffList = computed(() => {
  return staffList.value.filter(staff => {
    const matchesSearch = !searchKeyword.value || 
      staff.name.includes(searchKeyword.value) || 
      staff.employeeId.includes(searchKeyword.value);
    const matchesType = activeTab.value === 'ALL' || staff.type === activeTab.value;
    return matchesSearch && matchesType;
  });
});

// 事件处理函数
const onSearch = () => {
  // 搜索逻辑已经通过计算属性实现
};

const onTabChange = () => {
  // Tab切换逻辑已经通过计算属性实现
};

const onRefresh = async () => {
  refreshing.value = true;
  try {
    await initializeData();
  } finally {
    refreshing.value = false;
  }
};

const onLoad = () => {
  // 由于是本地数据，直接将finished设为true
  finished.value = true;
};

// 工具函数
const getStaffTypeTagType = (type) => {
  const typeMap = {
    'AUTHORIZER': 'primary',
    'MANAGER': 'success',
    'DRIVER': 'warning'
  };
  return typeMap[type] || 'default';
};

const getStaffTypeText = (type) => {
  const typeMap = {
    'AUTHORIZER': '授权人',
    'MANAGER': '负责人',
    'DRIVER': '驾驶员'
  };
  return typeMap[type] || type;
};

// 表单相关状态
const showAddStaffPopup = ref(false);
const showStaffTypePopup = ref(false);
const showGenderPopup = ref(false);
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const isEditing = ref(false);
const submitting = ref(false);
const startDate = ref(new Date());
const minDate = new Date(2000, 0, 1);
const maxDate = new Date(2099, 11, 31);

// 表单数据
const staffForm = ref({
  name: '',
  type: '',
  phone: '',
  gender: '',
  genderText: '',
  department: '',
  position: '',
  authStartDate: '',
  authEndDate: '',
  remarks: ''
});

// 选项数据
const staffTypeColumns = [
  { text: '授权人', value: 'AUTHORIZER' },
  { text: '负责人', value: 'MANAGER' },
  { text: '驾驶员', value: 'DRIVER' }
];

const genderColumns = [
  { text: '男', value: 'MALE' },
  { text: '女', value: 'FEMALE' }
];

// 编辑人员
const editStaff = (staff) => {
  isEditing.value = true;
  Object.assign(staffForm.value, staff);
  showAddStaffPopup.value = true;
};

// 删除人员
const deleteStaff = async (staff) => {
  try {
    await showDialog({
      title: '删除确认',
      message: '确定要删除该人员吗？',
      showCancelButton: true
    });
    
    await staffStore.deleteStaff(staff.userId);
    showToast({
      type: 'success',
      message: '删除成功'
    });
    await initializeData();
  } catch (error) {
    if (error.message !== 'cancel') {
      showToast({
        type: 'fail',
        message: error.message || '删除失败'
      });
    }
  }
};

// 提交表单
const onSubmitStaff = async (values) => {
  try {
    submitting.value = true;
    if (isEditing.value) {
      await staffStore.updateStaff({
        userId: staffForm.value.userId,
        ...values
      });
      showToast({
        type: 'success',
        message: '更新成功'
      });
    } else {
      await staffStore.addStaff(values);
      showToast({
        type: 'success',
        message: '添加成功'
      });
    }
    showAddStaffPopup.value = false;
    await initializeData();
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || (isEditing.value ? '更新失败' : '添加失败')
    });
  } finally {
    submitting.value = false;
  }
};

// 选择器确认事件
const onStaffTypeConfirm = ({ selectedOptions }) => {
  staffForm.value.type = selectedOptions[0].value;
  showStaffTypePopup.value = false;
};

const onGenderConfirm = ({ selectedOptions }) => {
  staffForm.value.gender = selectedOptions[0].value;
  staffForm.value.genderText = selectedOptions[0].text;
  showGenderPopup.value = false;
};

const onStartDateConfirm = (date) => {
  staffForm.value.authStartDate = formatDate(date);
  startDate.value = date;
  showStartDatePicker.value = false;
};

const onEndDateConfirm = (date) => {
  staffForm.value.authEndDate = formatDate(date);
  showEndDatePicker.value = false;
};

// 格式化日期
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 导航到人员详情
const goToDetail = (staff) => {
  console.log('Current staff:', staff);
  try {
    const id = staff.userId.toString();
    // 保存当前人员数据到store
    staffStore.$patch((state) => {
      state.currentStaff = staff;
    });
    // 使用相对路径导航
    router.push(`staff/${id}`);
  } catch (error) {
    console.error('Navigation error:', error);
    showToast({
      type: 'fail',
      message: '页面跳转失败'
    });
  }
};

// 初始化
onMounted(initializeData);
</script>

<style lang="less" scoped>
.staff-management-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.search-bar {
  padding: 8px;
  background-color: #fff;
}

.staff-list {
  padding: 8px 16px;
  
  .van-swipe-cell {
    margin-bottom: 8px;
    
    .van-button {
      height: 100%;
      
      &--primary {
        background-color: #1989fa;
      }
      
      &--danger {
        background-color: #ee0a24;
      }
    }
  }
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.van-floating-bubble {
  background-color: #1989fa;
  color: #fff;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.async-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  color: #969799;
  font-size: 14px;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
}

.van-swipe-cell {
  margin-bottom: 8px;
}

.van-button--square {
  height: 100%;
}
</style>
