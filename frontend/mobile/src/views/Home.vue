<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="user-info">
      <van-image
        round
        width="50"
        height="50"
        :src="userAvatar"
        class="avatar"
      />
      <div class="welcome">
        <p class="greeting">您好，{{ userName }}</p>
        <p class="date">{{ currentDate }}</p>
      </div>
      <!-- 天气信息 -->
      <div class="weather-info" v-if="weatherInfo">
        <van-icon name="sun-o" />
        <span>{{ weatherInfo.temperature }}°C</span>
      </div>
    </div>

    <!-- 快捷功能区 -->
    <van-grid :column-num="4" :border="false" class="quick-actions">
      <van-grid-item icon="logistics" text="我的车辆" to="/vehicles" />
      <van-grid-item icon="location-o" text="测试场预约" to="/test-sites" />
      <van-grid-item icon="medal-o" text="测试任务" to="/test-tasks" />
      <van-grid-item icon="phone-o" text="测试咨询" to="/appointments" />
    </van-grid>

    <!-- 统计信息卡片 -->
    <div class="stats-cards" v-if="dashboardStats">
      <van-row gutter="12">
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-number">{{ dashboardStats.totalBookings || 0 }}</div>
            <div class="stat-label">总预约数</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-number">{{ dashboardStats.completedTests || 0 }}</div>
            <div class="stat-label">已完成测试</div>
          </div>
        </van-col>
      </van-row>
      <van-row gutter="12" style="margin-top: 12px;">
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-number">{{ dashboardStats.pendingBookings || 0 }}</div>
            <div class="stat-label">待确认预约</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="stat-card">
            <div class="stat-number">{{ dashboardStats.testScore || 0 }}</div>
            <div class="stat-label">平均测试分数</div>
          </div>
        </van-col>
      </van-row>
    </div>

    <!-- 车辆状态卡片 -->
    <div class="section-title">我的车辆</div>
    <div class="vehicle-status" v-if="userVehicles.length > 0">
      <van-swipe :loop="false" :width="300" :show-indicators="false">
        <van-swipe-item v-for="vehicle in userVehicles" :key="vehicle.vehicleId">
          <van-card
            :title="vehicle.brand + ' ' + vehicle.model"
            :desc="'车牌: ' + vehicle.licensePlate"
            class="vehicle-card"
            @click="goToVehicleDetail(vehicle.vehicleId)"
          >
            <template #thumb>
              <van-image
                width="100%"
                height="80"
                fit="cover"
                :src="getVehicleImage(vehicle)"
              />
            </template>
            <template #tags>
              <van-tag plain type="primary" v-if="vehicle.status === 1">正常</van-tag>
              <van-tag plain type="warning" v-else-if="vehicle.status === 2">测试中</van-tag>
              <van-tag plain type="danger" v-else-if="vehicle.status === 3">报废</van-tag>
            </template>
            <template #footer>
              <div class="vehicle-info">
                <div class="info-item">
                  <van-icon name="underway-o" />
                  <span>{{ vehicle.mileage }}km</span>
                </div>
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ formatDate(vehicle.updatedTime) }}</span>
                </div>
              </div>
            </template>
          </van-card>
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-empty v-else description="暂无车辆信息" />

    <!-- 最近预约 -->
    <div class="section-title">最近测试场预约</div>
    <div class="recent-bookings" v-if="recentBookings.length > 0">
      <van-cell-group inset>
        <van-cell
          v-for="booking in recentBookings"
          :key="booking.bookingId"
          :title="booking.testSiteName"
          :label="formatDateTime(booking.bookingDate)"
          :value="getBookingStatusText(booking.status)"
          :to="`/bookings/${booking.bookingId}`"
          is-link
        >
          <template #icon>
            <van-icon name="location-o" class="cell-icon" />
          </template>
          <template #right-icon>
            <van-tag
              :type="getBookingStatusType(booking.status)"
              size="small"
            >
              {{ booking.serviceType }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无测试场预约" />

    <!-- 测试任务进度 -->
    <div class="section-title">我的测试任务</div>
    <div class="test-registrations" v-if="userTestRegistrations.length > 0">
      <van-cell-group inset>
        <van-cell
          v-for="registration in userTestRegistrations"
          :key="registration.registrationId"
          :title="registration.taskName"
          :label="`难度: ${getDifficultyText(registration.difficulty)} | 分数: ${registration.score || '未评分'}`"
          :value="getTestStatusText(registration.status)"
          :to="`/test-registrations/${registration.registrationId}`"
          is-link
        >
          <template #icon>
            <van-icon name="medal-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无测试任务" />

    <!-- 通知公告 -->
    <div class="section-title">
      通知公告
      <van-badge :content="unreadNotificationCount" v-if="unreadNotificationCount > 0" />
    </div>
    <div class="announcements" v-if="announcements.length > 0">
      <van-cell-group inset>
        <van-cell
          v-for="announcement in announcements"
          :key="announcement.id"
          :title="announcement.title"
          :label="formatDate(announcement.publishDate)"
          is-link
          @click="viewAnnouncement(announcement)"
        >
          <template #icon>
            <van-icon name="volume-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无公告" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMobileVehicleStore } from '../stores/vehicle';
import { useTestSiteStore } from '../stores/testSite';
import { useTestTaskStore } from '../stores/testTask';
import { useMobileDashboardStore } from '../stores/dashboard';
import { showToast } from 'vant';

const router = useRouter();
const vehicleStore = useMobileVehicleStore();
const testSiteStore = useTestSiteStore();
const testTaskStore = useTestTaskStore();
const dashboardStore = useMobileDashboardStore();

// 用户信息
// const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
const userStr = localStorage.getItem('user');
const userInfo = userStr != 'undefined' ? JSON.parse(userStr) : {};

const userName = computed(() => userInfo.name || '用户');
const userAvatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'); // 默认头像

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});

// 响应式数据
const dashboardStats = ref(null);
const userVehicles = ref([]);
const recentBookings = ref([]);
const userTestRegistrations = ref([]);
const announcements = ref([]);
const weatherInfo = ref(null);
const unreadNotificationCount = ref(0);

// 获取数据
onMounted(async () => {
  try {
    // 初始化仪表板数据
    await dashboardStore.initializeDashboard();

    // 获取仪表板数据
    dashboardStats.value = dashboardStore.dashboardStats;
    recentBookings.value = dashboardStore.recentBookings;
    announcements.value = dashboardStore.announcements;
    weatherInfo.value = dashboardStore.weatherInfo;
    unreadNotificationCount.value = dashboardStore.unreadNotificationCount;

    // 获取用户车辆列表
    if (userInfo.userId) {
      const vehicleData = await vehicleStore.fetchUserVehicles(userInfo.userId);
      userVehicles.value = vehicleData || [];

      // 获取用户测试报名列表
      const registrationData = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
      // 只显示最近的3个测试任务
      userTestRegistrations.value = (registrationData || [])
        .filter(item => item.status !== 'COMPLETED' && item.status !== 'CANCELLED')
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
        .slice(0, 3);
    }
  } catch (error) {
    console.error('获取数据失败:', error);
    showToast('获取数据失败，请稍后重试');
  }
});

// 获取车辆图片
const getVehicleImage = (vehicle) => {
  // 这里可以根据车型返回不同的图片
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg';
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无记录';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${formatDate(dateTimeString)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取预约状态文本
const getBookingStatusText = (status) => {
  const statusMap = {
    'PENDING': '待确认',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

// 获取预约状态类型
const getBookingStatusType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'CONFIRMED': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取测试状态文本
const getTestStatusText = (status) => {
  const statusMap = {
    'REGISTERED': '已报名',
    'SCHEDULED': '已安排',
    'IN_PROGRESS': '测试中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    'EASY': '简单',
    'MEDIUM': '中等',
    'HARD': '困难'
  };
  return difficultyMap[difficulty] || difficulty;
};

// 跳转到车辆详情
const goToVehicleDetail = (vehicleId) => {
  router.push(`/vehicles/${vehicleId}`);
};

// 查看公告详情
const viewAnnouncement = (announcement) => {
  // 这里可以打开公告详情页面或弹窗
  showToast(announcement.title);
};
</script>

<style lang="less" scoped>
.home-container {
  padding: 16px;
  padding-bottom: 60px;
  background-color: #f7f8fa;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;

  .avatar {
    margin-right: 12px;
  }

  .welcome {
    flex: 1;

    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .date {
      font-size: 14px;
      color: #969799;
    }
  }

  .weather-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #1989fa;

    .van-icon {
      margin-right: 4px;
    }
  }
}

.quick-actions {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 12px;
}

.stats-cards {
  margin-bottom: 20px;

  .stat-card {
    background-color: #fff;
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    .stat-number {
      font-size: 24px;
      font-weight: 600;
      color: #1989fa;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #969799;
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  padding-left: 4px;
  display: flex;
  align-items: center;

  .van-badge {
    margin-left: 8px;
  }
}

.vehicle-status {
  margin-bottom: 16px;

  .vehicle-card {
    width: 300px;
    background-color: #fff;
    border-radius: 12px;
    margin-right: 12px;

    .vehicle-info {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;

      .info-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #969799;

        .van-icon {
          margin-right: 4px;
        }
      }
    }
  }
}

.recent-bookings,
.test-registrations,
.announcements {
  margin-bottom: 16px;

  .van-cell-group {
    border-radius: 12px;
  }
}

.cell-icon {
  margin-right: 8px;
  font-size: 18px;
  color: #1989fa;

  &.warning {
    color: #ff976a;
  }
}
</style>