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
      <WeatherDetail 
        :weatherInfo="weatherInfo" 
        @detail-show="onWeatherDetailShow"
        @detail-hide="onWeatherDetailHide"
      />
    </div>

    <!-- 天气详情弹窗 -->
    <!-- 天气组件已包含弹窗功能 -->

    <!-- 快捷功能区 -->
    <van-grid :column-num="4" :border="false" class="quick-actions">
      <van-grid-item icon="logistics" text="我的车辆" to="/vehicles" />
      <van-grid-item icon="setting-o" text="维修保养" to="/maintenance" />
      <van-grid-item icon="desktop-o" text="设备领用" to="/equipment/applications" />
      <van-grid-item icon="records" text="设备台账" to="/equipment/ledger" />
      <van-grid-item icon="location-o" text="测试场预约" to="/test-sites" />
      <van-grid-item icon="medal-o" text="测试任务" to="/test-tasks" />
      <van-grid-item icon="phone-o" text="测试咨询" to="/appointments" />
      <van-grid-item icon="description" text="合同管理" to="/contracts" />
    </van-grid>

    <!-- 统计信息卡片 -->
    <div class="stats-cards">
      <van-skeleton :row="2" :loading="loading" v-if="loading">
        <template #template>
          <div class="custom-skeleton">
            <van-skeleton title :row="2" />
          </div>
        </template>
      </van-skeleton>
      
      <template v-else-if="dashboardStats">
        <van-row gutter="12">
          <van-col span="12">
            <div class="stat-card">
              <div class="stat-number">{{ dashboardStats?.totalBookings || 0 }}</div>
              <div class="stat-label">总预约数</div>
            </div>
          </van-col>
          <van-col span="12">
            <div class="stat-card">
              <div class="stat-number">{{ dashboardStats?.completedTests || 0 }}</div>
              <div class="stat-label">已完成测试</div>
            </div>
          </van-col>
        </van-row>

        <van-row gutter="12" style="margin-top: 12px;">
          <van-col span="12">
            <div class="stat-card">
              <div class="stat-number">{{ dashboardStats?.pendingBookings || 0 }}</div>
              <div class="stat-label">待确认预约</div>
            </div>
          </van-col>
          <van-col span="12">
            <div class="stat-card">
              <div class="stat-number">{{ dashboardStats?.testScore || 0 }}</div>
              <div class="stat-label">平均测试分数</div>
            </div>
          </van-col>
        </van-row>
      </template>
      <template v-else>
        <van-empty description="暂无数据" />
      </template>
    </div>

    <!-- 车辆状态卡片 -->
    <div class="section-title">我的车辆</div>
    <div class="vehicle-status" v-if="userVehicles.length > 0">
      <van-card
        :title="(userVehicles[0].brand || '品牌未知') + ' ' + (userVehicles[0].model || '类型未知')"
        :desc="'车牌: ' + (userVehicles[0].licensePlate || '未知')"
        class="vehicle-card"
        @click="goToVehicleDetail(userVehicles[0].vehicleId)"
      >
        <template #thumb>
          <van-image
            width="100%"
            height="80"
            fit="cover"
            :src="getVehicleImage(userVehicles[0])"
          />
        </template>
        <template #tags>
          <van-tag plain type="primary" v-if="userVehicles[0].status === 1">正常</van-tag>
          <van-tag plain type="warning" v-else-if="userVehicles[0].status === 2">测试中</van-tag>
          <van-tag plain type="danger" v-else-if="userVehicles[0].status === 3">报废</van-tag>
        </template>
        <template #footer>
          <div class="vehicle-info">
            <div class="info-item">
              <van-icon name="underway-o" />
              <span>{{ userVehicles[0].mileage || 0 }}km</span>
            </div>
            <div class="info-item">
              <van-icon name="clock-o" />
              <span>{{ formatDate(userVehicles[0].updatedTime) }}</span>
            </div>
          </div>
        </template>
      </van-card>
    </div>
    <van-empty v-else description="暂无车辆信息" />

    <!-- 最近预约 -->
    <div class="section-title">最近测试场预约</div>
    <div class="recent-bookings" v-if="recentBookings.length > 0">
      <van-cell-group inset>
        <van-cell
          v-for="booking in recentBookings"
          :key="booking.bookingId"
          class="booking-cell"
          :to="`/bookings/${booking.bookingId}`"
          is-link
        >
          <template #title>
            <div class="booking-title">
              <van-icon name="location-o" class="cell-icon" />
              <span class="location-name">{{ booking.testSiteName }}</span>
            </div>
          </template>
          <template #label>
            <div class="booking-info">
              <div class="booking-time">{{ formatDateTime(booking.startDateTime || booking.bookingDate) }}</div>
              <div class="booking-details" v-if="booking.testContent || booking.driverName">
                <span v-if="booking.testContent" class="test-content">{{ booking.testContent }}</span>
                <span v-if="booking.driverName" class="driver-name">驾驶员: {{ booking.driverName }}</span>
              </div>
            </div>
          </template>
          <template #value>
            <div class="booking-status">
              <van-tag
                :type="getBookingStatusType(booking.status)"
                size="small"
                class="status-tag"
              >
                {{ getBookingStatusText(booking.status) }}
              </van-tag>
              <van-tag
                type="primary"
                size="small"
                plain
                class="service-tag"
              >
                {{ booking.serviceType }}
              </van-tag>
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无测试场预约" />

    <!-- 测试任务进度 -->
    <div class="section-title">我的测试任务</div>
    <div class="test-registrations" v-if="userTestRegistrations.length > 0">
      <van-swipe :loop="false" :width="320" :show-indicators="false">
        <van-swipe-item v-for="registration in userTestRegistrations" :key="registration.registrationId">
          <van-card
            :title="registration.taskName"
            :desc="`测试地点: ${registration.testLocation || '待安排'}`"
            class="task-card"
            @click="goToTestTaskDetail(registration.registrationId)"
          >
            <template #thumb>
              <div class="task-status-icon">
                <van-icon :name="getTaskStatusIcon(registration.status)" size="32" />
              </div>
            </template>
            <template #tags>
              <van-tag :type="getTestRegistrationStatusType(registration.status)" size="small">
                {{ getTestRegistrationStatusText(registration.status) }}
              </van-tag>
              <van-tag 
                :type="getDifficultyType(registration.difficulty)" 
                size="small"
                style="margin-left: 4px;"
              >
                {{ getDifficultyText(registration.difficulty) }}
              </van-tag>
            </template>
            <template #footer>
              <div class="task-footer">
                <div class="task-time" v-if="registration.testDate">
                  <van-icon name="clock-o" />
                  <span>{{ formatDate(registration.testDate) }}</span>
                </div>
                <div class="task-score" v-if="registration.score">
                  <van-icon name="medal-o" />
                  <span>{{ registration.score }}分</span>
                </div>
                <div class="task-duration">
                  <van-icon name="underway-o" />
                  <span>{{ registration.estimatedDuration }}小时</span>
                </div>
              </div>
            </template>
          </van-card>
        </van-swipe-item>
      </van-swipe>
      
      <!-- 查看更多任务 -->
      <van-cell 
        title="查看所有测试任务" 
        is-link 
        @click="goToMyTestRegistrations"
        style="margin-top: 12px;"
      />
    </div>
    <van-empty v-else description="暂无测试任务" @click="goToTestTasks">
      <template #description>
        <span>暂无测试任务，</span>
        <span class="empty-link" @click="goToTestTasks">去报名测试 →</span>
      </template>
    </van-empty>

    <!-- 场地排期日历 -->
    <div class="section-title">场地排期日历</div>
    <div class="calendar-section">
      <van-cell-group inset>
        <!-- 日期选择 -->
        <van-cell 
          title="查看日期" 
          :value="formatSelectedDate(selectedCalendarDate)"
          is-link 
          @click="showCalendar = true"
        />
        
        <!-- 选中日期的场地安排 -->
        <div v-if="selectedCalendarDate && dailySchedule.length > 0" class="daily-schedule">
          <div class="schedule-header">
            <span>{{ formatSelectedDate(selectedCalendarDate) }} 场地安排</span>
          </div>
          <div class="schedule-list">
            <div 
              v-for="schedule in dailySchedule" 
              :key="schedule.id"
              class="schedule-item"
              @click="goToTestSiteDetail(schedule.testSiteId)"
            >
              <div class="schedule-time">{{ schedule.timeSlot }}</div>
              <div class="schedule-info">
                <div class="site-name">{{ schedule.testSiteName }}</div>
                <div class="task-name">{{ schedule.taskName }}</div>
                <van-tag :type="getScheduleStatusType(schedule.status)" size="small">
                  {{ getScheduleStatusText(schedule.status) }}
                </van-tag>
              </div>
              <div class="schedule-action">
                <van-icon name="arrow" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 暂无安排 -->
        <van-empty 
          v-else-if="selectedCalendarDate && dailySchedule.length === 0" 
          description="当天暂无场地安排" 
          image="search"
        />
      </van-cell-group>
    </div>

    <!-- 推荐场地 -->
    <div class="section-title">推荐场地</div>
    <div class="recommended-sites" v-if="recommendedSites.length > 0">
      <van-swipe :loop="false" :width="300" :show-indicators="false">
        <van-swipe-item v-for="site in recommendedSites" :key="site.siteId">
          <van-card
            :title="site.siteName || site.name"
            :desc="site.address"
            class="site-card"
            @click="goToTestSiteDetail(site.siteId)"
          >
            <template #thumb>
              <van-image
                width="100"
                height="80"
                fit="cover"
                :src="getTestSiteImage(site)"
              />
            </template>
            <template #tags>
              <van-tag 
                v-for="testType in (site.testTypes || getTestCapabilityNames(site))?.slice(0, 2)" 
                :key="testType"
                plain 
                type="primary" 
                size="small"
                style="margin-right: 4px;"
              >
                {{ testType }}
              </van-tag>
              <van-tag 
                :type="getSiteStatusType(site.status)" 
                size="small"
              >
                {{ getSiteStatusText(site.status) }}
              </van-tag>
            </template>
            <template #footer>
              <div class="site-footer">
                <div class="site-rating">
                  <van-rate :value="site.rating || 4.5" readonly size="12" />
                  <span class="rating-text">{{ site.rating || 4.5 }}</span>
                </div>
                <div class="site-capacity">
                  <van-icon name="location-o" />
                  <span>{{ site.capacity?.maxVehicles || 20 }}位</span>
                </div>
                <van-button size="small" type="primary" @click.stop="bookTestSite(site)">
                  预约
                </van-button>
              </div>
            </template>
          </van-card>
        </van-swipe-item>
      </van-swipe>
      
      <!-- 查看更多场地 -->
      <van-cell 
        title="查看所有场地" 
        is-link 
        @click="goToTestSites"
        style="margin-top: 12px;"
      />
    </div>
    <van-empty v-else description="暂无推荐场地" @click="goToTestSites">
      <template #description>
        <span>暂无推荐场地，</span>
        <span class="empty-link" @click="goToTestSites">查看所有场地 →</span>
      </template>
    </van-empty>

    <!-- 通知公告 -->
    <div class="section-title">
      通知公告
      <van-badge :content="unreadNotificationCount" v-if="unreadNotificationCount > 0" />
    </div>
    <div class="announcements" v-if="announcements.length > 0">
      <!-- 紧急通知优先显示 -->
      <div v-if="urgentNotifications.length > 0" class="urgent-notifications">
        <van-notice-bar
          v-for="urgent in urgentNotifications.slice(0, 1)"
          :key="urgent.id"
          :text="urgent.title"
          color="#ee0a24"
          background="#fef0f0"
          left-icon="warning-o"
          @click="viewAnnouncement(urgent)"
          style="margin-bottom: 8px;"
        />
      </div>

      <van-cell-group inset>
        <!-- 通知分类显示 -->
        <van-cell
          v-for="announcement in displayAnnouncements"
          :key="announcement.id"
          :title="announcement.title"
          :label="getAnnouncementMeta(announcement)"
          is-link
          @click="viewAnnouncement(announcement)"
          :class="{ 'unread-notification': !announcement.read }"
        >
          <template #icon>
            <van-icon 
              :name="getNotificationIcon(announcement.type)" 
              :color="getNotificationColor(announcement.priority)"
              class="cell-icon" 
            />
          </template>
          <template #right-icon>
            <div class="announcement-status">
              <van-tag 
                v-if="announcement.priority === 'urgent' || announcement.priority === 'high'"
                :type="getPriorityType(announcement.priority)" 
                size="small"
              >
                {{ getPriorityText(announcement.priority) }}
              </van-tag>
              <van-tag 
                :type="getCategoryType(announcement.category)" 
                size="small" 
                plain
                style="margin-left: 4px;"
              >
                {{ getCategoryText(announcement.category) }}
              </van-tag>
              <div v-if="!announcement.read" class="unread-indicator"></div>
            </div>
          </template>
        </van-cell>
        
        <!-- 分类统计显示 -->
        <van-cell 
          title="查看全部通知" 
          :value="getNotificationSummary()"
          is-link 
          @click="goToNotifications"
          class="view-all-cell"
        />
      </van-cell-group>

      <!-- 快捷操作提醒 -->
      <div v-if="actionRequiredNotifications.length > 0" class="action-required-section">
        <div class="section-subtitle">
          <van-icon name="warning-o" color="#ff976a" />
          <span>需要处理 ({{ actionRequiredNotifications.length }})</span>
        </div>
        <van-cell-group inset>
          <van-cell
            v-for="actionNotification in actionRequiredNotifications.slice(0, 2)"
            :key="actionNotification.id"
            :title="actionNotification.title"
            :label="formatRelativeTime(actionNotification.createdAt)"
            is-link
            @click="viewAnnouncement(actionNotification)"
          >
            <template #icon>
              <van-icon name="todo-list-o" color="#ff976a" />
            </template>
            <template #right-icon>
              <van-tag type="warning" size="small">待处理</van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
    <van-empty v-else description="暂无公告" />

    <!-- 日历弹窗 -->
    <van-calendar
      v-model:show="showCalendar"
      :default-date="selectedCalendarDate"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="calendarFormatter"
      @confirm="onCalendarDateSelect"
      type="single"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMobileVehicleStore } from '../stores/vehicle';
import { useTestSiteStore } from '../stores/testSite';
import { useTestTaskStore } from '../stores/testTask';
import { useMobileDashboardStore } from '../stores/dashboard';
import { scheduleApi } from '@/api/schedule';
import { showToast } from 'vant';
import dayjs from 'dayjs';
import WeatherDetail from '../components/WeatherDetail.vue';
import { getRecentBookings } from '@/api/dashboard';

const router = useRouter();
const vehicleStore = useMobileVehicleStore();
const testSiteStore = useTestSiteStore();
const testTaskStore = useTestTaskStore();
const dashboardStore = useMobileDashboardStore();

// 用户信息
const userInfo = ref(null);
const userName = computed(() => userInfo.value?.name || '用户');
const userAvatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'); // 默认头像

// 安全地解析用户信息
const initUserInfo = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      userInfo.value = JSON.parse(userStr);
    } else {
      userInfo.value = {};
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
    userInfo.value = {};
  }
};

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});

// 日历相关状态
const showCalendar = ref(false);
const selectedCalendarDate = ref(new Date());
const dailySchedule = ref([]);
const minDate = new Date();
const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天后

// 天气详情弹窗状态
const showWeatherDetail = ref(false);

// 推荐场地
const recommendedSites = ref([]);

// 响应式数据
const loading = ref(true);
const error = ref(null);
const userVehicles = ref([]);
const recentBookings = ref([]);
const userTestRegistrations = ref([]);

// 直接从 store 获取响应式数据
const dashboardStats = computed(() => dashboardStore.dashboardStats);
const announcements = computed(() => dashboardStore.announcements);
const weatherInfo = computed(() => dashboardStore.weatherInfo);
const unreadNotificationCount = computed(() => dashboardStore.unreadNotificationCount);

// 通知分类计算属性
const urgentNotifications = computed(() => {
  return announcements.value.filter(n => n.priority === 'urgent' && !n.read);
});

const actionRequiredNotifications = computed(() => {
  return announcements.value.filter(n => n.actionRequired && !n.read);
});

const displayAnnouncements = computed(() => {
  // 显示最新的5条通知，排除已在紧急通知中显示的
  const urgentIds = urgentNotifications.value.map(n => n.id);
  return announcements.value
    .filter(n => !urgentIds.includes(n.id))
    .slice(0, 5);
});

// 获取数据
onMounted(async () => {
  loading.value = true;

  try {
    // 初始化用户信息
    initUserInfo();
    
    if (!userInfo.value?.userId) {
      throw new Error('用户信息无效');
    }

    // 初始化仪表板数据（天气、公告、统计）
    await dashboardStore.initializeDashboard();

    // 使用模块 API 获取最近预约（避免代理路径问题）
    await fetchRecentBookingsViaApi();

    try {
      // 获取用户车辆列表
      const vehicleData = await vehicleStore.fetchVehicles();
      userVehicles.value = vehicleData?.content || [];
    } catch (err) {
      console.error('获取车辆列表失败:', err);
      userVehicles.value = [];
    }

    try {
      // 获取用户测试报名列表
      const registrationData = await testTaskStore.fetchUserTestRegistrations(userInfo.value.userId);
      console.log('获取到的报名数据:', registrationData);
      
      // 确保 registrationData 是数组，并进行安全处理
      const safeRegistrationData = Array.isArray(registrationData) ? registrationData : [];
      
      // 只显示最近的3个测试任务
      userTestRegistrations.value = safeRegistrationData
        .filter(item => item.status !== 'COMPLETED' && item.status !== 'CANCELLED')
        .sort((a, b) => new Date(b.registrationTime || b.createdTime) - new Date(a.registrationTime || a.createdTime))
        .slice(0, 3);
    } catch (err) {
      console.error('获取测试报名列表失败:', err);
      userTestRegistrations.value = [];
    }

    try {
      // 获取推荐场地
      const sitesData = await testSiteStore.fetchTestSites({ page: 0, size: 5 });
      recommendedSites.value = sitesData?.content?.slice(0, 3) || [];
    } catch (error) {
      console.error('获取推荐场地失败:', error);
      recommendedSites.value = [];
    }

    try {
      // 获取今日场地安排
      await fetchDailySchedule(selectedCalendarDate.value);
    } catch (error) {
      console.error('获取场地安排失败:', error);
    }
  } catch (err) {
    console.error('获取数据失败:', err);
    showToast({
      message: err.message || '获取数据失败，请稍后重试',
      type: 'fail',
      duration: 2000
    });
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

// 通过 dashboard API 获取最近预约
async function fetchRecentBookingsViaApi() {
  try {
    const res = await getRecentBookings(5);
    const list = res?.data || [];
    // 统一字段命名到 Home.vue 的展示结构
    recentBookings.value = list.map(b => ({
      bookingId: b.bookingId || b.id,
      testSiteName: b.testSiteName || b.groundName || b.siteName || b.provingGroundName || b.vehicleName || '测试场',
      bookingDate: b.bookingDate || b.startTime || b.createTime,
      status: b.status || b.bookingStatus || 'PENDING',
      serviceType: b.serviceType || b.billingTypeName || '预约',
      // 保留原始数据用于调试
      ...b
    }));
  } catch (err) {
    console.error('获取最近预约失败(dashboard API):', err);
    recentBookings.value = [];
  }
}

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
    'CANCELLED': '已取消',
    // 数字状态码映射
    '0': '待确认',
    '1': '已确认',
    '2': '已完成', 
    '3': '已取消'
  };
  return statusMap[status] || status;
};

// 获取预约状态类型
const getBookingStatusType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'CONFIRMED': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
    // 数字状态码映射
    '0': 'warning',
    '1': 'primary',
    '2': 'success',
    '3': 'danger'
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

// 获取测试报名状态文本
const getTestRegistrationStatusText = (status) => {
  const statusMap = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'SCHEDULED': '已安排',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REJECTED': '已拒绝'
  };
  return statusMap[status] || status;
};

// 获取测试报名状态类型
const getTestRegistrationStatusType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'APPROVED': 'primary',
    'SCHEDULED': 'success',
    'IN_PROGRESS': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
    'REJECTED': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取任务状态图标
const getTaskStatusIcon = (status) => {
  const iconMap = {
    'PENDING': 'clock-o',
    'APPROVED': 'passed',
    'SCHEDULED': 'calendar-o',
    'IN_PROGRESS': 'play-circle-o',
    'COMPLETED': 'checked',
    'CANCELLED': 'close',
    'REJECTED': 'clear'
  };
  return iconMap[status] || 'records';
};

// 获取场地状态文本
const getSiteStatusText = (status) => {
  const statusMap = {
    'AVAILABLE': '可用',
    'BUSY': '使用中',
    'MAINTENANCE': '维护中',
    'CLOSED': '关闭'
  };
  return statusMap[status] || '可用';
};

// 获取场地状态类型
const getSiteStatusType = (status) => {
  const typeMap = {
    'AVAILABLE': 'success',
    'BUSY': 'warning',
    'MAINTENANCE': 'default',
    'CLOSED': 'danger'
  };
  return typeMap[status] || 'success';
};

// 获取测试能力名称
const getTestCapabilityNames = (site) => {
  if (site.testCapabilities?.types) {
    return site.testCapabilities.types.map(type => type.name);
  }
  return ['性能测试', '安全测试'];
};

// 获取难度类型
const getDifficultyType = (difficulty) => {
  const typeMap = {
    'EASY': 'success',
    'MEDIUM': 'warning',
    'HIGH': 'danger',
    'HARD': 'danger'
  };
  return typeMap[difficulty] || 'default';
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

// 跳转到测试任务详情
const goToTestTaskDetail = (registrationId) => {
  router.push(`/test-registrations/${registrationId}`);
};

// 跳转到我的测试报名
const goToMyTestRegistrations = () => {
  router.push('/my-test-registrations');
};

// 跳转到测试任务列表
const goToTestTasks = () => {
  router.push('/test-tasks');
};

// 查看公告详情
const viewAnnouncement = (announcement) => {
  // 跳转到通知详情页面
  router.push(`/notifications/${announcement.id}`);
};

// 跳转到通知列表
const goToNotifications = () => {
  router.push('/notifications');
};

// 获取通知图标
const getNotificationIcon = (type) => {
  const iconMap = {
    'APPROVAL': 'passed', // 审批
    'SITE_NOTIFICATION': 'location-o', // 场地
    'EQUIPMENT_REMINDER': 'setting-o', // 设备提醒
    'APPOINTMENT': 'calendar-o', // 预约
    'TEST': 'medal-o' // 测试
  };
  return iconMap[type] || 'volume-o';
};

// 获取通知颜色
const getNotificationColor = (priority) => {
  const colorMap = {
    'urgent': '#ee0a24',
    'high': '#ff976a',
    'medium': '#1989fa',
    'low': '#969799'
  };
  return colorMap[priority] || '#1989fa';
};

// 获取优先级类型
const getPriorityType = (priority) => {
  const typeMap = {
    'urgent': 'danger',
    'high': 'warning',
    'medium': 'primary',
    'low': 'default'
  };
  return typeMap[priority] || 'default';
};

// 获取优先级文本
const getPriorityText = (priority) => {
  const textMap = {
    'urgent': '紧急',
    'high': '重要',
    'medium': '普通',
    'low': '一般'
  };
  return textMap[priority] || priority;
};

// 获取分类类型
const getCategoryType = (category) => {
  const typeMap = {
    'approval': 'warning',
    'site': 'primary',
    'equipment': 'success',
    'system': 'default',
    'financial': 'danger',
    'training': 'primary'
  };
  return typeMap[category] || 'default';
};

// 获取分类文本
const getCategoryText = (category) => {
  const textMap = {
    'approval': '审批',
    'site': '场地',
    'equipment': '设备',
    'system': '系统',
    'financial': '财务',
    'training': '培训'
  };
  return textMap[category] || category;
};

// 获取通知元信息
const getAnnouncementMeta = (announcement) => {
  const timeText = formatRelativeTime(announcement.createdAt);
  if (announcement.actionRequired) {
    return `${timeText} • 需要处理`;
  }
  return timeText;
};

// 格式化相对时间
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}天前`;
  } else if (hours > 0) {
    return `${hours}小时前`;
  } else {
    return '刚刚';
  }
};

// 获取通知摘要
const getNotificationSummary = () => {
  const total = announcements.value.length;
  const unread = announcements.value.filter(n => !n.read).length;
  const urgent = announcements.value.filter(n => n.priority === 'urgent').length;
  
  if (urgent > 0) {
    return `共${total}条，${urgent}条紧急`;
  }
  return `共${total}条，${unread}条未读`;
};

// 日历相关函数
const formatSelectedDate = (date) => {
  if (!date) return '请选择日期';
  const d = new Date(date);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

const calendarFormatter = (day) => {
  const today = new Date();
  const currentDay = new Date(day.date);
  
  if (currentDay.toDateString() === today.toDateString()) {
    day.bottomInfo = '今天';
  } else if (currentDay.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString()) {
    day.bottomInfo = '明天';
  }
  
  // 周末标记
  if (currentDay.getDay() === 0 || currentDay.getDay() === 6) {
    day.className = 'weekend';
  }
  
  return day;
};

const onCalendarDateSelect = async (date) => {
  selectedCalendarDate.value = date;
  showCalendar.value = false;
  await fetchDailySchedule(date);
};

// 获取指定日期的场地安排
const fetchDailySchedule = async (date) => {
  try {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    // 使用新的 schedule API 获取指定日期的场地安排
    const scheduleData = await scheduleApi.getDailySchedule(formattedDate);
    dailySchedule.value = scheduleData || [];
  } catch (error) {
    console.error('获取日程安排失败:', error);
    // 如果API失败，使用空数组作为fallback
    dailySchedule.value = [];
    showToast('获取日程安排失败');
  }
};

// 获取排期状态类型
const getScheduleStatusType = (status) => {
  const typeMap = {
    'AVAILABLE': 'success',
    'SCHEDULED': 'warning',
    'OCCUPIED': 'danger',
    'MAINTENANCE': 'default'
  };
  return typeMap[status] || 'default';
};

// 获取排期状态文本
const getScheduleStatusText = (status) => {
  const statusMap = {
    'AVAILABLE': '可预约',
    'SCHEDULED': '已安排',
    'OCCUPIED': '占用中',
    'MAINTENANCE': '维护中'
  };
  return statusMap[status] || status;
};

// 场地相关函数
const getTestSiteImage = (site) => {
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg';
};

const goToTestSiteDetail = (siteId) => {
  router.push(`/test-sites/${siteId}`);
};

const goToTestSites = () => {
  router.push('/test-sites');
};

const bookTestSite = (site) => {
  router.push({
    path: '/bookings/new',
    query: { testSiteId: site.siteId }
  });
};

// 天气详情事件处理
const onWeatherDetailShow = () => {
  // 天气详情弹窗显示时的处理
};

const onWeatherDetailHide = () => {
  // 天气详情弹窗隐藏时的处理
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

// 预约卡片样式优化
.booking-cell {
  .booking-title {
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 15px;
    color: #323233;
    line-height: 20px;
    
    .cell-icon {
      margin-right: 8px;
      font-size: 16px;
      color: #1989fa;
      flex-shrink: 0;
    }
    
    .location-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  
  .booking-info {
    margin-top: 6px;
    
    .booking-time {
      font-size: 13px;
      color: #969799;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        display: inline-block;
        width: 3px;
        height: 3px;
        background: #c8c9cc;
        border-radius: 50%;
        margin-right: 6px;
        flex-shrink: 0;
      }
    }
    
    .booking-details {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      align-items: center;
      
      .test-content {
        font-size: 12px;
        color: #1989fa;
        background: #e8f4ff;
        padding: 3px 8px;
        border-radius: 4px;
        border: 1px solid #b3d8ff;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .driver-name {
        font-size: 12px;
        color: #646566;
        background: #f7f8fa;
        padding: 3px 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        
        &::before {
          content: '👤';
          margin-right: 4px;
          font-size: 10px;
        }
      }
    }
  }
  
  .booking-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    min-width: 60px;
    
    .status-tag {
      font-weight: 500;
      border-radius: 6px;
      padding: 2px 8px;
    }
    
    .service-tag {
      font-size: 11px;
      border-radius: 6px;
      padding: 2px 6px;
      opacity: 0.8;
    }
  }
  
  // 响应式调整
  @media (max-width: 375px) {
    .booking-title {
      font-size: 14px;
      
      .location-name {
        max-width: 200px;
      }
    }
    
    .booking-info .booking-details {
      .test-content {
        max-width: 100px;
        font-size: 11px;
      }
      
      .driver-name {
        font-size: 11px;
      }
    }
    
    .booking-status {
      min-width: 50px;
      gap: 6px;
      
      .service-tag {
        font-size: 10px;
      }
    }
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

// 新增样式 - 日历相关
.calendar-section {
  margin-bottom: 16px;
  
  .daily-schedule {
    .schedule-header {
      padding: 12px 16px;
      background-color: #f7f8fa;
      font-size: 14px;
      font-weight: 600;
      color: #323233;
    }
    
    .schedule-list {
      .schedule-item {
        display: flex;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #f0f0f0;
        cursor: pointer;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: #f7f8fa;
        }
        
        &:last-child {
          border-bottom: none;
        }
        
        .schedule-time {
          width: 80px;
          font-size: 12px;
          color: #1989fa;
          font-weight: 600;
        }
        
        .schedule-info {
          flex: 1;
          margin-left: 12px;
          
          .site-name {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .task-name {
            font-size: 12px;
            color: #969799;
            margin-bottom: 6px;
          }
        }
        
        .schedule-action {
          color: #c8c9cc;
        }
      }
    }
  }
}

// 推荐场地样式
.recommended-sites {
  margin-bottom: 16px;
  
  .site-card {
    width: 300px;
    background-color: #fff;
    border-radius: 12px;
    margin-right: 12px;
    
    .site-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      
      .site-rating {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .rating-text {
          font-size: 12px;
          color: #969799;
        }
      }
      
      .site-capacity {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        color: #969799;
      }
    }
  }
}

// 测试任务样式
.test-registrations {
  margin-bottom: 16px;
  
  .task-card {
    width: 320px;
    background-color: #fff;
    border-radius: 12px;
    margin-right: 12px;
    
    .task-status-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      background-color: #f7f8fa;
      border-radius: 12px;
      
      .van-icon {
        color: #1989fa;
      }
    }
    
    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      
      .task-time,
      .task-score,
      .task-duration {
        display: flex;
        align-items: center;
        gap: 2px;
        font-size: 12px;
        color: #969799;
        
        .van-icon {
          font-size: 12px;
        }
      }
      
      .task-score {
        color: #ff976a;
      }
    }
  }
}

// 空状态链接样式
.empty-link {
  color: #1989fa;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

// 日历组件样式
:deep(.van-calendar) {
  .weekend {
    color: #ee0a24;
  }
  
  .van-calendar__day--disabled {
    color: #c8c9cc;
  }
}

// 通知公告样式
.announcements {
  .urgent-notifications {
    margin-bottom: 12px;
    
    :deep(.van-notice-bar) {
      cursor: pointer;
      border-radius: 8px;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
  
  .announcement-status {
    display: flex;
    align-items: center;
    gap: 4px;
    
    .unread-indicator {
      width: 8px;
      height: 8px;
      background-color: #ee0a24;
      border-radius: 50%;
      margin-left: 4px;
    }
  }
  
  .unread-notification {
    :deep(.van-cell__title) {
      font-weight: 600;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #1989fa;
      border-radius: 0 3px 3px 0;
    }
  }
  
  .view-all-cell {
    :deep(.van-cell) {
      color: #1989fa;
      font-weight: 500;
      
      .van-cell__title {
        color: #1989fa;
      }
    }
  }
  
  .action-required-section {
    margin-top: 16px;
    
    .section-subtitle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 600;
      color: #ff976a;
      margin-bottom: 8px;
      padding-left: 4px;
    }
  }
}
</style>