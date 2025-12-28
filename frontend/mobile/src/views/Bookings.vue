<template>
  <div class="bookings-container">
    <!-- 导航栏 -->
    <van-nav-bar 
      title="我的预约" 
      fixed
      :right-text="null"
    >
      <template #right>
        <van-icon name="plus" @click="createNewBooking" style="font-size: 20px;" />
      </template>
    </van-nav-bar>

    <!-- 状态筛选 -->
    <van-tabs v-model:active="activeStatus" @change="onStatusChange" sticky offset-top="46px">
      <van-tab title="全部" name="ALL" />
      <van-tab title="待确认" name="PENDING" />
      <van-tab title="已确认" name="CONFIRMED" />
      <van-tab title="已完成" name="COMPLETED" />
      <van-tab title="已改期" name="RESCHEDULED" />
      <van-tab title="已取消" name="CANCELLED" />
    </van-tabs>

    <!-- 预约列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <!-- 加载状态 -->
      <van-loading v-if="bookingStore.loading" type="spinner" color="#1989fa" vertical>
        加载中...
      </van-loading>
      
      <div v-if="bookings.length > 0" class="list-header">
        <van-notice-bar 
          left-icon="info-o" 
          background="#ecf9ff"
          color="#1989fa"
        >
          预约记录
        </van-notice-bar> 
      </div>
      
      <div class="booking-list" v-if="bookings.length > 0">
        <van-cell
          v-for="booking in bookings"
          :key="booking.id || booking.bookingNo"
          :title="booking.bookingNo != null ? booking.bookingNo : getBookingTitle(booking)"
          :label="booking.remark || booking.notes"
          is-link
          @click="goToBookingDetail(booking.id || booking.bookingNo)"
        >
          <template #icon>
            <van-icon name="calendar-o" class="booking-icon" />
          </template>
          <template #label>
            <div class="booking-details">
              <div class="booking-time">
                <van-icon name="clock-o" /> {{ booking.bookingDate || formatDateTime(booking.startTime) }} {{ booking.startTime || '' }}-{{ booking.endTime || '' }}
              </div>
              <div class="booking-remark" v-if="booking.remark || booking.notes">
                <van-icon name="comment-o" /> {{ booking.remark || booking.notes }}
              </div>
            </div>
          </template>
          <template #right-icon>
            <van-tag :type="getStatusType(booking.status)" size="medium">
              {{ getStatusText(booking.status) }}
            </van-tag>
          </template>
        </van-cell>
      </div>
      <van-empty v-else description="暂无预约记录" />
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useBookingStore } from '../stores/booking';
import dayjs from 'dayjs';

const router = useRouter();
const bookingStore = useBookingStore();

// 响应式数据
const activeStatus = ref('ALL');
const refreshing = ref(false);
const bookings = computed(() => bookingStore.bookings);

// 状态管理
const statusMap = {
  'PENDING': { text: '待确认', type: 'warning' },
  'CONFIRMED': { text: '已确认', type: 'success' },
  'COMPLETED': { text: '已完成', type: 'primary' },
  'RESCHEDULED': { text: '已改期', type: 'warning' },
  'CANCELLED': { text: '已取消', type: 'default' },
  // 支持数字状态值
  0: { text: '待确认', type: 'warning' },    // PENDING
  1: { text: '已确认', type: 'success' },    // CONFIRMED  
  2: { text: '已完成', type: 'primary' },    // COMPLETED
  3: { text: '已改期', type: 'warning' },    // RESCHEDULED
  4: { text: '已取消', type: 'default' }     // CANCELLED
};



// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  return dayjs(dateTime).format('MM-DD');
};

// 获取预约标题
const getBookingTitle = (booking) => {
  if (booking.vehicle) {
    return `${booking.vehicle.licensePlate} 预约`;
  }
  return '预约详情';
};

// 获取状态文本
const getStatusText = (status) => {
  // 处理数字状态值
  const statusStr = status !== undefined && status !== null ? status.toString() : status;
  return statusMap[statusStr]?.text || statusMap[status]?.text || statusStr || status;
};

// 获取状态类型
const getStatusType = (status) => {
  // 处理数字状态值
  const statusStr = status !== undefined && status !== null ? status.toString() : status;
  return statusMap[statusStr]?.type || statusMap[status]?.type || 'default';
};

// 跳转到预约详情
const goToBookingDetail = (id) => {
  router.push(`/bookings/${id}`);
};

// 创建新预约
const createNewBooking = () => {
  router.push('/bookings/new');
};

// 刷新数据
const onRefresh = async () => {
  try {
    console.log('开始刷新预约数据，状态:', activeStatus.value);
    await bookingStore.fetchBookings({
      status: activeStatus.value === 'ALL' ? undefined : activeStatus.value,
      pageNum: 1,
      pageSize: 20 
    });
    console.log('刷新预约数据成功');
  } catch (error) {
    console.error('刷新预约数据失败:', error);
    console.error('错误详情:', {
      message: error.message,
      response: error.response,
      data: error.response?.data
    });
    showToast({ type: 'fail', message: `刷新失败: ${error.message}` });
  } finally {
    refreshing.value = false;
  }
};

// 切换状态
const onStatusChange = () => {
  onRefresh();
};

// 初始化
onMounted(() => {
  onRefresh();
});
</script>

<style lang="less" scoped>
.bookings-container {
  padding-top: 46px;
  padding-bottom: 80px;
  
  .list-header {
    margin-bottom: 8px;
  }

  .booking-list {
    margin-top: 0;
  }

  .booking-icon {
    margin-right: 8px;
    color: #1989fa;
  }

  .booking-details {
    font-size: 13px;
    color: #666;
    margin-top: 6px;
    line-height: 1.4;
    
    .booking-time, .booking-remark {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 2px;
      
      .van-icon {
        font-size: 12px;
        flex-shrink: 0;
      }
    }
    
    .booking-time {
      font-weight: 500;
      color: #323233;
    }
    
    .booking-remark {
      color: #969799;
      
      // 限制备注显示长度
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.van-cell {
  align-items: flex-start;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
