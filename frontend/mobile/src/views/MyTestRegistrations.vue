<template>
  <div class="my-registrations-container">
    <!-- 导航栏 -->
    <van-nav-bar title="我的测试报名" />

    <!-- 状态筛选 -->
    <van-tabs v-model:active="activeTab" @change="onTabChange" sticky>
      <van-tab title="全部" name="ALL" />
      <van-tab title="待审核" name="PENDING" />
      <van-tab title="已通过" name="APPROVED" />
      <van-tab title="进行中" name="IN_PROGRESS" />
      <van-tab title="已完成" name="COMPLETED" />
      <van-tab title="已取消" name="CANCELLED" />
    </van-tabs>

    <!-- 报名列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="registration-list">
          <van-card
            v-for="registration in filteredRegistrations"
            :key="registration.id"
            :title="registration.taskName"
            :desc="registration.description"
            class="registration-card"
            @click="goToRegistrationDetail(registration.id)"
          >
            <template #thumb>
              <div class="task-icon">
                <van-icon :name="getTaskIcon(registration.taskType)" size="40" />
              </div>
            </template>
            <template #tags>
              <van-tag :type="getStatusType(registration.status)" size="small">
                {{ getStatusText(registration.status) }}
              </van-tag>
              <van-tag 
                :type="getDifficultyType(registration.difficulty)" 
                size="small"
                style="margin-left: 8px;"
              >
                {{ getDifficultyText(registration.difficulty) }}
              </van-tag>
            </template>
            <template #footer>
              <div class="registration-info">
                <div class="registration-time">
                  <van-icon name="clock-o" />
                  <span>报名时间: {{ formatDateTime(registration.registrationTime) }}</span>
                </div>
                <div class="test-time" v-if="registration.scheduledTime">
                  <van-icon name="calendar-o" />
                  <span>测试时间: {{ formatDateTime(registration.scheduledTime) }}</span>
                </div>
                <div class="test-location" v-if="registration.testLocation">
                  <van-icon name="location-o" />
                  <span>测试地点: {{ registration.testLocation }}</span>
                </div>
              </div>
            </template>
          </van-card>
        </div>
        <van-empty v-if="filteredRegistrations.length === 0" description="暂无测试报名记录" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestTaskStore } from '../stores/testTask';
import { showToast } from 'vant';

const router = useRouter();
const testTaskStore = useTestTaskStore();

// 响应式数据
const activeTab = ref('ALL');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const registrations = ref([]);

// 模拟数据
const mockRegistrations = [
  {
    id: 1,
    taskId: 'T001',
    taskName: '车辆性能测试',
    description: '全面的车辆性能评估测试',
    taskType: 'PERFORMANCE',
    difficulty: 'MEDIUM',
    status: 'APPROVED',
    registrationTime: '2024-01-10 14:30:00',
    scheduledTime: '2024-01-20 09:00:00',
    testLocation: '专业测试场地A区',
    estimatedDuration: 4,
    fee: 500
  },
  {
    id: 2,
    taskId: 'T002',
    taskName: '安全性能测试',
    description: '车辆安全系统全面检测',
    taskType: 'SAFETY',
    difficulty: 'HARD',
    status: 'IN_PROGRESS',
    registrationTime: '2024-01-08 10:15:00',
    scheduledTime: '2024-01-18 14:00:00',
    testLocation: '专业测试场地B区',
    estimatedDuration: 6,
    fee: 800
  },
  {
    id: 3,
    taskId: 'T003',
    taskName: '排放测试',
    description: '车辆尾气排放标准检测',
    taskType: 'EMISSION',
    difficulty: 'EASY',
    status: 'COMPLETED',
    registrationTime: '2024-01-05 16:20:00',
    scheduledTime: '2024-01-15 11:00:00',
    testLocation: '环保测试中心',
    estimatedDuration: 2,
    fee: 200,
    completedTime: '2024-01-15 13:00:00',
    testResult: 'PASSED'
  }
];

// 计算属性
const filteredRegistrations = computed(() => {
  if (activeTab.value === 'ALL') {
    return registrations.value;
  }
  return registrations.value.filter(registration => registration.status === activeTab.value);
});

// 获取我的测试报名列表
const fetchMyRegistrations = async () => {
  try {
    loading.value = true;
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (userInfo.userId) {
      // 使用store方法获取数据
      const data = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
      registrations.value = data || mockRegistrations; // 如果API没有数据，使用模拟数据
    } else {
      registrations.value = mockRegistrations;
    }
    
    finished.value = true;
  } catch (error) {
    console.error('获取测试报名列表失败:', error);
    // 如果API失败，使用模拟数据
    registrations.value = mockRegistrations;
    finished.value = true;
  } finally {
    loading.value = false;
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await fetchMyRegistrations();
  refreshing.value = false;
};

// 加载更多
const onLoad = async () => {
  if (!finished.value) {
    await fetchMyRegistrations();
  }
};

// 切换标签
const onTabChange = () => {
  // 可以在这里添加切换标签时的逻辑
};

// 跳转到报名详情
const goToRegistrationDetail = (registrationId) => {
  // 这里可以跳转到测试任务详情页面
  const registration = registrations.value.find(r => r.id === registrationId);
  if (registration) {
    router.push({ name: 'TestTaskDetail', params: { id: registration.taskId } });
  }
};

// 获取任务图标
const getTaskIcon = (taskType) => {
  const iconMap = {
    'PERFORMANCE': 'medal-o',
    'SAFETY': 'shield-o',
    'EMISSION': 'fire-o',
    'COMPREHENSIVE': 'certificate'
  };
  return iconMap[taskType] || 'medal-o';
};

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'PENDING': 'warning',
    'APPROVED': 'primary',
    'IN_PROGRESS': 'success',
    'COMPLETED': 'success',
    'CANCELLED': 'danger',
    'REJECTED': 'danger'
  };
  return statusMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待审核',
    'APPROVED': '已通过',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REJECTED': '已拒绝'
  };
  return statusMap[status] || '未知';
};

// 获取难度类型
const getDifficultyType = (difficulty) => {
  const difficultyMap = {
    'EASY': 'success',
    'MEDIUM': 'warning',
    'HARD': 'danger'
  };
  return difficultyMap[difficulty] || 'default';
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

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  const date = new Date(dateTimeStr);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 组件挂载时获取数据
onMounted(() => {
  fetchMyRegistrations();
});
</script>

<style lang="less" scoped>
.my-registrations-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.registration-list {
  padding: 16px;
}

.registration-card {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

.task-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: #f7f8fa;
  border-radius: 8px;
}

.registration-info {
  margin-top: 8px;
}

.registration-time,
.test-time,
.test-location {
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
