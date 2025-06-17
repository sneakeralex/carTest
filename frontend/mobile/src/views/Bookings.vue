<template>
  <div class="bookings-container">
    <!-- 导航栏 -->
    <van-nav-bar title="我的预约" fixed>
      <template #right>
        <van-icon name="plus" @click="createNewBooking" />
      </template>
    </van-nav-bar>

    <!-- 状态筛选 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange" sticky>
      <van-tab title="全部" name="ALL" />
      <van-tab title="待确认" name="PENDING" />
      <van-tab title="已确认" name="CONFIRMED" />
      <van-tab title="已完成" name="COMPLETED" />
      <van-tab title="已取消" name="CANCELLED" />
    </van-tabs>

    <!-- 预约列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="booking-list">
          <van-card
            v-for="booking in filteredBookings"
            :key="booking.id"
            :title="booking.serviceName"
            :desc="booking.description"
            class="booking-card"
            @click="goToBookingDetail(booking.id)"
          >
            <template #thumb>
              <div class="booking-icon">
                <van-icon :name="getBookingIcon(booking.serviceType)" size="40" />
              </div>
            </template>
            <template #tags>
              <van-tag :type="getStatusType(booking.status)" size="small">
                {{ getStatusText(booking.status) }}
              </van-tag>
            </template>
            <template #footer>
              <div class="booking-info">
                <div class="booking-time">
                  <van-icon name="clock-o" />
                  <span>{{ formatDateTime(booking.appointmentTime) }}</span>
                </div>
                <div class="booking-location">
                  <van-icon name="location-o" />
                  <span>{{ booking.location }}</span>
                </div>
              </div>
            </template>
          </van-card>
        </div>
        <van-empty v-if="filteredBookings.length === 0" description="暂无预约记录" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();

// 响应式数据
const activeTab = ref('ALL');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const bookings = ref([]);

// 模拟数据
const mockBookings = [
  {
    id: 1,
    serviceName: '车辆年检预约',
    description: '2024年度车辆年检服务',
    serviceType: 'INSPECTION',
    status: 'CONFIRMED',
    appointmentTime: '2024-01-15 09:00:00',
    location: '北京市朝阳区检测站',
    vehicleInfo: '京A12345 - 奥迪A4L'
  },
  {
    id: 2,
    serviceName: '维修保养预约',
    description: '定期保养及小修服务',
    serviceType: 'MAINTENANCE',
    status: 'PENDING',
    appointmentTime: '2024-01-20 14:00:00',
    location: '4S店维修中心',
    vehicleInfo: '京B67890 - 宝马X3'
  },
  {
    id: 3,
    serviceName: '测试场预约',
    description: '性能测试预约服务',
    serviceType: 'TEST',
    status: 'COMPLETED',
    appointmentTime: '2024-01-10 10:00:00',
    location: '专业测试场地',
    vehicleInfo: '京C11111 - 奔驰C200'
  }
];

// 计算属性
const filteredBookings = computed(() => {
  if (activeTab.value === 'ALL') {
    return bookings.value;
  }
  return bookings.value.filter(booking => booking.status === activeTab.value);
});

// 获取预约列表
const fetchBookings = async () => {
  try {
    loading.value = true;
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    bookings.value = mockBookings;
    finished.value = true;
  } catch (error) {
    console.error('获取预约列表失败:', error);
    showToast('获取预约列表失败');
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await fetchBookings();
  refreshing.value = false;
};

// 加载更多
const onLoad = async () => {
  if (!finished.value) {
    await fetchBookings();
  }
};

// 切换标签
const onTabChange = () => {
  // 可以在这里添加切换标签时的逻辑
};

// 创建新预约
const createNewBooking = () => {
  router.push({ name: 'NewBooking' });
};

// 跳转到预约详情
const goToBookingDetail = (bookingId) => {
  router.push({ name: 'BookingDetail', params: { id: bookingId } });
};

// 获取预约图标
const getBookingIcon = (serviceType) => {
  const iconMap = {
    'INSPECTION': 'certificate',
    'MAINTENANCE': 'setting-o',
    'TEST': 'medal-o'
  };
  return iconMap[serviceType] || 'calendar-o';
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
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchBookings();
});
</script>

<style lang="less" scoped>
.bookings-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-top: 46px; // 导航栏高度
}

.booking-list {
  padding: 16px;
}

.booking-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.booking-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.booking-info {
  margin-top: 8px;
}

.booking-time,
.booking-location {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 12px;
  color: #969799;

  .van-icon {
    margin-right: 4px;
  }
}
</style>
