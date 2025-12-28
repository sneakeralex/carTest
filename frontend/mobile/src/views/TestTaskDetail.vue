<template>
  <div class="test-task-detail">
    <van-nav-bar
      title="测试任务详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <van-loading v-if="loading" class="loading-container" vertical>
      加载中...
    </van-loading>

    <div v-else-if="testTask" class="detail-content">
      <!-- 任务基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="任务名称" :value="testTask.taskName" />
        <van-cell title="任务单位" :value="testTask.department" />
        <van-cell title="测试类型" :value="getTestTypeText(testTask.testType)" />
        <van-cell title="试验类型" :value="getTestTypeText(testTask.experimentType)" />
        <van-cell title="难度等级">
          <template #value>
            <van-tag :type="getDifficultyType(testTask.difficulty)">
              {{ getDifficultyText(testTask.difficulty) }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 时间和地点 -->
      <van-cell-group inset title="时间和地点">
        <van-cell title="开始时间" :value="formatDate(testTask.startDate)" />
        <van-cell title="结束时间" :value="formatDate(testTask.endDate)" />
        <van-cell title="测试地点" :value="testTask.testSite" />
        <van-cell title="预计时长" :value="testTask.estimatedDuration + '小时'" />
      </van-cell-group>

      <!-- 合同信息 -->
      <van-cell-group inset title="合同信息" v-if="testTask.contractInfo">
        <van-cell title="合同编号" :value="testTask.contractInfo.contractNumber" />
        <van-cell title="委托方" :value="testTask.contractInfo.client" />
        <van-cell title="费用" :value="`¥${testTask.fee || 0}`" />
      </van-cell-group>

      <!-- 测试车辆信息 -->
      <van-cell-group inset title="测试车辆" v-if="testTask.vehicles && testTask.vehicles.length">
        <van-cell
          v-for="(vehicle, index) in testTask.vehicles"
          :key="vehicle.vehicleId"
          :title="`车辆 ${index + 1}`"
        >
          <template #value>
            <div class="vehicle-info">
              <div>{{ vehicle.name }}</div>
              <div class="vehicle-test-content">{{ vehicle.testContent }}</div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 设备要求 -->
      <van-cell-group inset title="设备要求" v-if="testTask.equipment">
        <van-cell
          v-for="(equipment, index) in testTask.equipment"
          :key="index"
          :title="`设备 ${index + 1}`"
          :value="equipment"
        />
      </van-cell-group>

      <!-- 任务要求 -->
      <van-cell-group inset title="任务要求" v-if="testTask.requirements">
        <van-cell
          v-for="(requirement, index) in testTask.requirements"
          :key="index"
          :title="`要求 ${index + 1}`"
          :value="requirement"
        />
      </van-cell-group>

      <!-- 注意事项 -->
      <van-cell-group inset title="备注" v-if="testTask.notes">
        <van-cell
          v-for="(note, index) in testTask.notes"
          :key="index"
          :title="`注意事项 ${index + 1}`"
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

    <van-empty v-else description="测试任务不存在" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestTaskStore } from '../stores/testTask';
import { showToast, showConfirmDialog } from 'vant';
import { formatDate } from '../utils/dateFormatter';
import { getTestTypeText, getDifficultyText, getDifficultyType } from '../utils/typeFormatter';
import { getUserInfo } from '../utils/auth.js';

const route = useRoute();
const router = useRouter();
const testTaskStore = useTestTaskStore();

// 响应式数据
const loading = ref(true);
const testTask = ref(null);
const userRegistrations = ref([]);

// 计算属性
const isRegistered = computed(() => {
  // 确保 userRegistrations.value 是数组
  const registrations = Array.isArray(userRegistrations.value) ? userRegistrations.value : [];
  return registrations.some(reg => reg.taskId === testTask.value?.taskId);
});

// 获取测试任务详情
const fetchTestTaskDetail = async () => {
  try {
    loading.value = true;
    const taskId = route.params.id;
    const data = await testTaskStore.fetchTestTaskById(taskId);
    testTask.value = data;
    
    // 获取用户报名信息
    const userInfo = getUserInfo();
    if (userInfo.userId) {
      const registrations = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
      userRegistrations.value = Array.isArray(registrations) ? registrations : [];
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



// 报名测试任务
const registerTask = async () => {
  try {
    await showConfirmDialog({
      title: '确认报名',
      message: `确定要报名参加"${testTask.value.taskName}"测试任务吗？`,
    });

    const userInfo = getUserInfo();
    await testTaskStore.registerTestTask({
      taskId: testTask.value.taskId,
      userId: userInfo.userId
    });

    showToast('报名成功');
    // 重新获取报名信息
    const registrations = await testTaskStore.fetchUserTestRegistrations(userInfo.userId);
    userRegistrations.value = Array.isArray(registrations) ? registrations : [];
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

<style scoped>
.test-task-detail {
  padding-bottom: 80px;
}

.loading-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.detail-content {
  padding: 16px;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.vehicle-info {
  text-align: right;
}

.vehicle-test-content {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.van-cell-group {
  margin-bottom: 12px;
}
</style>
