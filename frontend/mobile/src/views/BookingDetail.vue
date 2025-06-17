<template>
  <div class="booking-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="预约详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-container" vertical>
      加载中...
    </van-loading>

    <!-- 预约详情内容 -->
    <div v-else-if="booking" class="detail-content">
      <!-- 预约状态 -->
      <van-cell-group inset title="预约状态">
        <van-cell title="当前状态">
          <template #value>
            <van-tag :type="getStatusType(booking.status)" size="large">
              {{ getStatusText(booking.status) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="预约编号" :value="booking.bookingNumber" />
        <van-cell title="创建时间" :value="formatDateTime(booking.createdTime)" />
      </van-cell-group>

      <!-- 服务信息 -->
      <van-cell-group inset title="服务信息">
        <van-cell title="服务类型" :value="booking.serviceName" />
        <van-cell title="服务描述" :value="booking.description" />
        <van-cell title="预约时间" :value="formatDateTime(booking.appointmentTime)" />
        <van-cell title="服务地点" :value="booking.location" />
        <van-cell title="预计费用" :value="`¥${booking.estimatedCost || 0}`" />
      </van-cell-group>

      <!-- 车辆信息 -->
      <van-cell-group inset title="车辆信息" v-if="booking.vehicleInfo">
        <van-cell title="车牌号码" :value="booking.vehicleInfo.licensePlate" />
        <van-cell title="车辆品牌" :value="booking.vehicleInfo.brand" />
        <van-cell title="车辆型号" :value="booking.vehicleInfo.model" />
        <van-cell title="车辆颜色" :value="booking.vehicleInfo.color" />
      </van-cell-group>

      <!-- 联系信息 -->
      <van-cell-group inset title="联系信息">
        <van-cell title="联系人" :value="booking.contactName" />
        <van-cell title="联系电话" :value="booking.contactPhone" />
        <van-cell title="备注信息" :value="booking.remarks || '无'" />
      </van-cell-group>

      <!-- 服务进度 -->
      <van-cell-group inset title="服务进度" v-if="booking.progress">
        <van-steps direction="vertical" :active="booking.progress.currentStep">
          <van-step v-for="(step, index) in booking.progress.steps" :key="index">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
            <p v-if="step.completedTime" class="step-time">
              完成时间: {{ formatDateTime(step.completedTime) }}
            </p>
          </van-step>
        </van-steps>
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
          v-if="booking.status === 'PENDING'"
          type="danger"
          size="large"
          @click="cancelBooking"
          style="margin-bottom: 12px;"
          block
        >
          取消预约
        </van-button>
        <van-button
          v-if="booking.status === 'CONFIRMED'"
          type="warning"
          size="large"
          @click="rescheduleBooking"
          style="margin-bottom: 12px;"
          block
        >
          改期预约
        </van-button>
        <van-button
          v-if="booking.status === 'COMPLETED'"
          type="primary"
          size="large"
          @click="rateService"
          block
        >
          评价服务
        </van-button>
      </div>
    </div>

    <!-- 错误状态 -->
    <van-empty v-else description="预约信息不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showConfirmDialog, showSuccessToast } from 'vant';

const route = useRoute();
const router = useRouter();

// 响应式数据
const loading = ref(true);
const booking = ref(null);

// 模拟预约详情数据
const mockBookingDetail = {
  id: 1,
  bookingNumber: 'BK202401150001',
  serviceName: '车辆年检预约',
  description: '2024年度车辆年检服务',
  status: 'CONFIRMED',
  appointmentTime: '2024-01-15 09:00:00',
  createdTime: '2024-01-10 14:30:00',
  location: '北京市朝阳区检测站',
  estimatedCost: 200,
  contactName: '张三',
  contactPhone: '13800138000',
  remarks: '请提前准备相关证件',
  vehicleInfo: {
    licensePlate: '京A12345',
    brand: '奥迪',
    model: 'A4L',
    color: '白色'
  },
  progress: {
    currentStep: 1,
    steps: [
      {
        title: '预约提交',
        description: '预约申请已提交',
        completedTime: '2024-01-10 14:30:00'
      },
      {
        title: '预约确认',
        description: '预约已确认，请按时到达',
        completedTime: '2024-01-11 10:00:00'
      },
      {
        title: '服务进行中',
        description: '正在进行年检服务'
      },
      {
        title: '服务完成',
        description: '年检服务已完成'
      }
    ]
  }
};

// 获取预约详情
const fetchBookingDetail = async () => {
  try {
    loading.value = true;
    const bookingId = route.params.id;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    booking.value = mockBookingDetail;
  } catch (error) {
    console.error('获取预约详情失败:', error);
    showToast('获取预约详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'PENDING': 'warning',
    'CONFIRMED': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return statusMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || '未知';
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 取消预约
const cancelBooking = async () => {
  try {
    await showConfirmDialog({
      title: '确认取消',
      message: '确定要取消这个预约吗？取消后无法恢复。',
    });

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    booking.value.status = 'CANCELLED';
    showSuccessToast('预约已取消');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('取消预约失败:', error);
      showToast('取消预约失败，请稍后重试');
    }
  }
};

// 改期预约
const rescheduleBooking = () => {
  showToast('改期功能开发中');
};

// 评价服务
const rateService = () => {
  showToast('评价功能开发中');
};

// 组件挂载时获取数据
onMounted(() => {
  fetchBookingDetail();
});
</script>

<style lang="less" scoped>
.booking-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.detail-content {
  padding-bottom: 80px;
}

.step-time {
  font-size: 12px;
  color: #969799;
  margin-top: 4px;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}
</style>
