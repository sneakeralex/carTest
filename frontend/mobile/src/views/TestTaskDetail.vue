<template>
  <div class="test-task-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="测试任务详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-container" vertical>
      加载中...
    </van-loading>

    <!-- 测试任务详情内容 -->
    <div v-else-if="testTask" class="detail-content">
      <!-- 任务基本信息 -->
      <van-cell-group inset title="任务信息">
        <van-cell title="任务名称" :value="testTask.taskName" />
        <van-cell title="任务描述" :value="testTask.description" />
        <van-cell title="任务类型" :value="getTaskTypeText(testTask.taskType)" />
        <van-cell title="难度等级">
          <template #value>
            <van-tag :type="getDifficultyType(testTask.difficulty)">
              {{ getDifficultyText(testTask.difficulty) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="预计时长" :value="testTask.estimatedDuration + '小时'" />
        <van-cell title="费用" :value="`¥${testTask.fee || 0}`" />
      </van-cell-group>

      <!-- 任务要求 -->
      <van-cell-group inset title="任务要求" v-if="testTask.requirements">
        <van-cell
          v-for="(requirement, index) in testTask.requirements"
          :key="index"
          :title="`要求${index + 1}`"
          :value="requirement"
        />
      </van-cell-group>

      <!-- 测试步骤 -->
      <van-cell-group inset title="测试步骤" v-if="testTask.testSteps">
        <van-steps direction="vertical" :active="testTask.testSteps.length">
          <van-step v-for="(step, index) in testTask.testSteps" :key="index">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
          </van-step>
        </van-steps>
      </van-cell-group>

      <!-- 注意事项 -->
      <van-cell-group inset title="注意事项" v-if="testTask.notes">
        <van-cell
          v-for="(note, index) in testTask.notes"
          :key="index"
          :title="`注意事项${index + 1}`"
          :value="note"
        />
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button
          v-if="!isRegistered"
          type="primary"
          size="large"
          block
          @click="registerTask"
          :disabled="testTask.status !== 'ACTIVE'"
        >
          报名参加
        </van-button>
        <van-button
          v-else
          type="success"
          size="large"
          block
          disabled
        >
          已报名
        </van-button>
      </div>
    </div>

    <!-- 错误状态 -->
    <van-empty v-else description="测试任务不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestTaskStore } from '../stores/testTask';
import { showToast, showConfirmDialog } from 'vant';

const route = useRoute();
const router = useRouter();
const testTaskStore = useTestTaskStore();

// 响应式数据
const loading = ref(true);
const testTask = ref(null);
const userRegistrations = ref([]);

// 计算属性
const isRegistered = computed(() => {
  return userRegistrations.value.some(reg => reg.taskId === testTask.value?.taskId);
});

// 获取测试任务详情
const fetchTestTaskDetail = async () => {
  try {
    loading.value = true;
    const taskId = route.params.id;
    const data = await testTaskStore.fetchTestTaskDetail(taskId);
    testTask.value = data;
    
    // 获取用户报名信息
    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    if (userInfo.userId) {
      const registrations = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
      userRegistrations.value = registrations || [];
    }
  } catch (error) {
    console.error('获取测试任务详情失败:', error);
    showToast('获取测试任务详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 获取任务类型文本
const getTaskTypeText = (type) => {
  const typeMap = {
    'PERFORMANCE': '性能测试',
    'SAFETY': '安全测试',
    'EMISSION': '排放测试',
    'COMPREHENSIVE': '综合测试'
  };
  return typeMap[type] || type;
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

// 报名测试任务
const registerTask = async () => {
  try {
    await showConfirmDialog({
      title: '确认报名',
      message: `确定要报名参加"${testTask.value.taskName}"测试任务吗？`,
    });

    const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
    await testTaskStore.registerTestTask({
      taskId: testTask.value.taskId,
      userId: userInfo.userId
    });

    showToast('报名成功');
    // 重新获取报名信息
    const registrations = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
    userRegistrations.value = registrations || [];
  } catch (error) {
    if (error !== 'cancel') {
      console.error('报名失败:', error);
      showToast('报名失败，请稍后重试');
    }
  }
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTestTaskDetail();
});
</script>

<style lang="less" scoped>
.test-task-detail {
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
