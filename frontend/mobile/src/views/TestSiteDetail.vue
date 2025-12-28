<template>
  <div class="test-site-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="测试场详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-container" vertical>
      加载中...
    </van-loading>

    <!-- 测试场详情内容 -->
    <div v-else-if="testSite" class="detail-content">
      <!-- 测试场基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="测试场名称" :value="testSite.name" />
        <van-cell title="地址" :value="testSite.address" />
        <van-cell title="联系电话" :value="testSite.phone" />
        <van-cell title="营业时间" :value="testSite.businessHours" />
        <van-cell title="状态">
          <template #value>
            <van-tag :type="getStatusType(testSite.status)">
              {{ getStatusText(testSite.status) }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 测试场设施 -->
      <van-cell-group inset title="测试设施" v-if="testSite.facilities">
        <van-cell
          v-for="facility in testSite.facilities"
          :key="facility.id"
          :title="facility.name"
          :label="facility.description"
        >
          <template #right-icon>
            <van-tag v-if="facility.available" type="success">可用</van-tag>
            <van-tag v-else type="danger">不可用</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 测试项目 -->
      <van-cell-group inset title="可测试项目" v-if="testSite.testItems">
        <van-cell
          v-for="item in testSite.testItems"
          :key="item.id"
          :title="item.name"
          :label="item.description"
          :value="`¥${item.price}`"
        />
      </van-cell-group>

      <!-- 场地图片展示 -->
      <van-cell-group inset title="场地环境" v-if="testSite.images && testSite.images.length > 0">
        <van-swipe :autoplay="3000" class="site-images">
          <van-swipe-item v-for="(image, index) in testSite.images" :key="index">
            <van-image
              width="100%"
              height="200"
              fit="cover"
              :src="image.url"
              :alt="image.description"
            />
          </van-swipe-item>
        </van-swipe>
      </van-cell-group>

      <!-- 排期日历 -->
      <van-cell-group inset title="排期日历">
        <div class="calendar-section">
          <van-calendar
            v-model:show="showCalendar"
            :default-date="selectedDate"
            :min-date="minDate"
            :max-date="maxDate"
            :formatter="calendarFormatter"
            @confirm="onDateSelect"
            @select="onDateSelect"
            type="single"
            :show-confirm="false"
          />
          
          <!-- 日期选择器触发按钮 -->
          <van-cell 
            title="选择预约日期" 
            :value="formatSelectedDate(selectedDate)"
            is-link 
            @click="showCalendar = true"
          />
          
          <!-- 当天时间段 -->
          <div v-if="selectedDate && timeSlots.length > 0" class="time-slots">
            <div class="time-slots-title">可预约时间段</div>
            <div class="time-slots-grid">
              <div
                v-for="slot in timeSlots"
                :key="slot.id"
                :class="['time-slot', { 
                  'available': slot.available, 
                  'booked': !slot.available,
                  'selected': selectedTimeSlot?.id === slot.id 
                }]"
                @click="selectTimeSlot(slot)"
              >
                <div class="time-text">{{ slot.startTime }} - {{ slot.endTime }}</div>
                <div class="status-text">
                  {{ slot.available ? `剩余${slot.remainingSlots}个位置` : '已满' }}
                </div>
              </div>
            </div>
          </div>
          
          <!-- 暂无可预约时间段 -->
          <van-empty 
            v-else-if="selectedDate && timeSlots.length === 0" 
            description="当天暂无可预约时间段" 
            image="search"
          />
        </div>
      </van-cell-group>

      <!-- 评价信息 -->
      <van-cell-group inset title="用户评价" v-if="testSite.reviews && testSite.reviews.length > 0">
        <div class="reviews-summary">
          <div class="rating-overview">
            <div class="rating-score">{{ testSite.averageRating || 0 }}</div>
            <div class="rating-stars">
              <van-rate :value="testSite.averageRating" readonly size="16" />
            </div>
            <div class="rating-count">基于{{ testSite.reviewCount || 0 }}条评价</div>
          </div>
        </div>
        
        <div class="reviews-list">
          <div 
            v-for="review in testSite.reviews.slice(0, 3)" 
            :key="review.id"
            class="review-item"
          >
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">{{ review.userName }}</span>
                <van-rate :value="review.rating" readonly size="12" />
              </div>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>
            <div class="review-content">{{ review.content }}</div>
          </div>
        </div>
        
        <van-cell 
          v-if="testSite.reviews.length > 3"
          title="查看更多评价" 
          is-link 
          @click="viewAllReviews"
        />
      </van-cell-group>

      <!-- 预约按钮 -->
      <div class="action-buttons">
        <van-button
          type="primary"
          size="large"
          block
          @click="makeAppointment"
          :disabled="!canMakeAppointment"
        >
          {{ getAppointmentButtonText() }}
        </van-button>
      </div>
    </div>

    <!-- 错误状态 -->
    <van-empty v-else description="测试场信息不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestSiteStore } from '../stores/testSite';
import { showToast } from 'vant';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const testSiteStore = useTestSiteStore();

// 响应式数据
const loading = ref(true);
const testSite = ref(null);
const showCalendar = ref(false);
const selectedDate = ref(new Date());
const selectedTimeSlot = ref(null);
const timeSlots = ref([]);

// 日期范围
const minDate = new Date();
const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30天后

// 计算属性
const canMakeAppointment = computed(() => {
  return testSite.value?.status === 'ACTIVE' && selectedDate.value && selectedTimeSlot.value;
});

// 获取测试场详情
const fetchTestSiteDetail = async () => {
  try {
    loading.value = true;
    const siteId = route.params.id;
    const data = await testSiteStore.fetchTestSiteDetail(siteId);
    
    // 增强数据 - 添加图片和评价信息
    const enhancedData = {
      ...data,
      images: [
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg', description: '测试场外观' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg', description: '测试设备' },
        { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg', description: '控制中心' }
      ],
      averageRating: 4.5,
      reviewCount: 128,
      reviews: [
        {
          id: 1,
          userName: '张先生',
          rating: 5,
          content: '设备先进，服务专业，测试结果准确可靠。',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          userName: '李女士',
          rating: 4,
          content: '场地环境不错，工作人员态度很好，就是预约有点难。',
          createdAt: '2024-01-10T14:20:00Z'
        },
        {
          id: 3,
          userName: '王工程师',
          rating: 5,
          content: '专业的测试中心，数据权威，值得信赖。',
          createdAt: '2024-01-08T09:15:00Z'
        }
      ]
    };
    
    testSite.value = enhancedData;
    
    // 获取今天的时间段
    await fetchTimeSlots(selectedDate.value);
  } catch (error) {
    console.error('获取测试场详情失败:', error);
    showToast('获取测试场详情失败');
  } finally {
    loading.value = false;
  }
};

// 获取指定日期的时间段
const fetchTimeSlots = async (date) => {
  if (!testSite.value) return;
  
  try {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    
    // 模拟时间段数据 - 基于选择的日期生成不同的可用性
    const isToday = dayjs(date).isSame(dayjs(), 'day');
    const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;
    
    if (isWeekend) {
      // 周末营业时间较短
      timeSlots.value = [
        {
          id: 'weekend_1',
          startTime: '10:00',
          endTime: '12:00',
          available: true,
          remainingSlots: 2,
          maxSlots: 3
        },
        {
          id: 'weekend_2',
          startTime: '14:00',
          endTime: '16:00',
          available: false,
          remainingSlots: 0,
          maxSlots: 3
        }
      ];
    } else if (isToday) {
      // 今天的时间段（部分已被占用）
      timeSlots.value = [
        {
          id: 'today_1',
          startTime: '09:00',
          endTime: '11:00',
          available: false,
          remainingSlots: 0,
          maxSlots: 5
        },
        {
          id: 'today_2',
          startTime: '11:00',
          endTime: '13:00',
          available: true,
          remainingSlots: 2,
          maxSlots: 5
        },
        {
          id: 'today_3',
          startTime: '14:00',
          endTime: '16:00',
          available: true,
          remainingSlots: 4,
          maxSlots: 5
        },
        {
          id: 'today_4',
          startTime: '16:00',
          endTime: '18:00',
          available: true,
          remainingSlots: 1,
          maxSlots: 5
        }
      ];
    } else {
      // 未来日期的时间段（大部分可用）
      timeSlots.value = [
        {
          id: 'future_1',
          startTime: '09:00',
          endTime: '11:00',
          available: true,
          remainingSlots: 5,
          maxSlots: 5
        },
        {
          id: 'future_2',
          startTime: '11:00',
          endTime: '13:00',
          available: true,
          remainingSlots: 4,
          maxSlots: 5
        },
        {
          id: 'future_3',
          startTime: '14:00',
          endTime: '16:00',
          available: true,
          remainingSlots: 3,
          maxSlots: 5
        },
        {
          id: 'future_4',
          startTime: '16:00',
          endTime: '18:00',
          available: true,
          remainingSlots: 5,
          maxSlots: 5
        }
      ];
    }
    
    // 重置选中的时间段
    selectedTimeSlot.value = null;
  } catch (error) {
    console.error('获取时间段失败:', error);
    timeSlots.value = [];
  }
};

// 日历格式化器
const calendarFormatter = (day) => {
  const today = dayjs();
  const currentDay = dayjs(day.date);
  
  if (currentDay.isSame(today, 'day')) {
    day.bottomInfo = '今天';
  } else if (currentDay.isSame(today.add(1, 'day'), 'day')) {
    day.bottomInfo = '明天';
  }
  
  // 周末标记
  if (currentDay.day() === 0 || currentDay.day() === 6) {
    day.className = 'weekend';
  }
  
  return day;
};

// 日期选择
const onDateSelect = async (date) => {
  selectedDate.value = date;
  showCalendar.value = false;
  await fetchTimeSlots(date);
};

// 时间段选择
const selectTimeSlot = (slot) => {
  if (slot.available) {
    selectedTimeSlot.value = slot;
  } else {
    showToast('该时间段已满');
  }
};

// 格式化选中日期
const formatSelectedDate = (date) => {
  if (!date) return '请选择日期';
  return dayjs(date).format('YYYY年MM月DD日');
};

// 格式化日期
const formatDate = (dateStr) => {
  return dayjs(dateStr).format('YYYY-MM-DD');
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'ACTIVE': 'success',
    'INACTIVE': 'warning',
    'MAINTENANCE': 'danger'
  };
  return statusMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'ACTIVE': '正常营业',
    'INACTIVE': '暂停营业',
    'MAINTENANCE': '维护中'
  };
  return statusMap[status] || '未知';
};

// 获取预约按钮文本
const getAppointmentButtonText = () => {
  if (testSite.value?.status !== 'ACTIVE') {
    return '暂不可预约';
  }
  if (!selectedDate.value) {
    return '请选择日期';
  }
  if (!selectedTimeSlot.value) {
    return '请选择时间段';
  }
  return '立即预约';
};

// 预约测试场
const makeAppointment = () => {
  if (!canMakeAppointment.value) {
    if (testSite.value?.status !== 'ACTIVE') {
      showToast('该测试场暂不可预约');
    } else if (!selectedDate.value) {
      showToast('请先选择预约日期');
    } else if (!selectedTimeSlot.value) {
      showToast('请先选择时间段');
    }
    return;
  }
  
  router.push({
    name: 'NewTestConsultationAppointment',
    query: { 
      testSiteId: testSite.value.id,
      date: dayjs(selectedDate.value).format('YYYY-MM-DD'),
      timeSlotId: selectedTimeSlot.value.id,
      startTime: selectedTimeSlot.value.startTime,
      endTime: selectedTimeSlot.value.endTime
    }
  });
};

// 查看所有评价
const viewAllReviews = () => {
  // 这里可以跳转到评价列表页面
  showToast('查看所有评价功能开发中');
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTestSiteDetail();
});
</script>

<style lang="less" scoped>
.test-site-detail {
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

.site-images {
  .van-swipe-item {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.calendar-section {
  .time-slots {
    padding: 16px;
    
    .time-slots-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #323233;
    }
    
    .time-slots-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .time-slot {
      padding: 12px;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      
      &.available {
        background-color: #f0f9ff;
        border: 1px solid #1989fa;
        color: #1989fa;
        
        &:hover, &.selected {
          background-color: #1989fa;
          color: #fff;
        }
      }
      
      &.booked {
        background-color: #f5f5f5;
        border: 1px solid #ddd;
        color: #999;
        cursor: not-allowed;
      }
      
      .time-text {
        font-weight: 600;
        margin-bottom: 4px;
      }
      
      .status-text {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }
}

.reviews-summary {
  padding: 16px;
  
  .rating-overview {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .rating-score {
      font-size: 32px;
      font-weight: bold;
      color: #1989fa;
    }
    
    .rating-stars {
      flex: 1;
    }
    
    .rating-count {
      font-size: 12px;
      color: #999;
    }
  }
}

.reviews-list {
  .review-item {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
    
    .review-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .reviewer-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .reviewer-name {
          font-weight: 600;
          font-size: 14px;
        }
      }
      
      .review-date {
        font-size: 12px;
        color: #999;
      }
    }
    
    .review-content {
      font-size: 14px;
      line-height: 1.5;
      color: #333;
    }
  }
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
  z-index: 100;
}

// 日历样式
:deep(.van-calendar) {
  .weekend {
    color: #ee0a24;
  }
}
</style>
