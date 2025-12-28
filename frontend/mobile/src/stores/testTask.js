import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { 
  getTestTasks, 
  getTestTaskById,
  getTestRegistrations,
  getTestRegistrationById,
  createTestRegistration,
  updateTestRegistration,
  cancelTestRegistration,
  scheduleTest,
  completeTest,
  getUserTestRegistrations,
  getTaskRegistrations,
  getTestStats,
  createTestTask as createTestTaskApi
} from '../api/testTask';
import { testRegistrationApi } from '../api/testRegistration';

// 测试任务状态枚举
export const TEST_TASK_STATUS = {
  DRAFT: 'DRAFT',           // 草稿
  PENDING: 'PENDING',       // 待审核
  APPROVED: 'APPROVED',     // 已审核
  IN_PROGRESS: 'IN_PROGRESS', // 进行中
  COMPLETED: 'COMPLETED',   // 已完成
  CANCELLED: 'CANCELLED'    // 已取消
};

export const useTestTaskStore = defineStore('testTask', () => {
  // 状态显示文本映射
  const STATUS_TEXT_MAP = {
    [TEST_TASK_STATUS.DRAFT]: '草稿',
    [TEST_TASK_STATUS.PENDING]: '待审核',
    [TEST_TASK_STATUS.APPROVED]: '已审核',
    [TEST_TASK_STATUS.IN_PROGRESS]: '进行中',
    [TEST_TASK_STATUS.COMPLETED]: '已完成',
    [TEST_TASK_STATUS.CANCELLED]: '已取消'
  };

  // 状态
  const testTasks = ref({
    content: [],
    pageable: {},
    totalPages: 0,
    totalElements: 0,
    last: true,
    first: true,
    empty: true
  });
  const currentTestTask = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const userTestRegistrations = ref([]);

  // 分页
  const pagination = ref({
    page: 0,
    size: 10,
    total: 0
  });

  // 方法
  const fetchTestTasks = async (params = {}) => {
    loading.value = true;
    error.value = null;
    
    try {
      const queryParams = {
        page: params.page ?? pagination.value.page,
        size: params.size ?? pagination.value.size,
        ...params
      };
      
      const response = await getTestTasks(queryParams);
      
      // 保持完整的响应数据结构
      if (!response.data.content) {
        // 如果返回的不是分页结构，构造分页结构
        testTasks.value = {
          content: Array.isArray(response.data) ? response.data : [response.data],
          pageable: pagination.value,
          totalPages: 1,
          totalElements: Array.isArray(response.data) ? response.data.length : 1,
          last: true,
          first: true,
          empty: !response.data || (Array.isArray(response.data) && response.data.length === 0)
        };
      } else {
        testTasks.value = response.data;
      }

      // 更新分页信息
      pagination.value = {
        page: testTasks.value.pageable?.pageNumber ?? 0,
        size: testTasks.value.pageable?.pageSize ?? 10,
        total: testTasks.value.totalElements ?? 0
      };
      
      return testTasks.value;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试任务列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取已审核的任务
  const approvedTasks = computed(() => {
    if (!testTasks.value?.content) return [];
    return testTasks.value.content.filter(task => task.status === TEST_TASK_STATUS.APPROVED);
  });

  // 获取可预约的任务（已审核且在有效期内）
  const bookableTasks = computed(() => {
    if (!testTasks.value?.content) {
      console.log('无可用任务数据');
      return [];
    }
    console.log('原始任务数量:', testTasks.value.content.length);

    const now = new Date();
    // 获取今天凌晨的时间，用于日期比较
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return testTasks.value.content.filter(task => {
      // 1. 检查任务状态
      const isApproved = task.status === TEST_TASK_STATUS.APPROVED;
      console.log(`\n检查任务 [${task.taskId}] ${task.taskName}:`);
      console.log(`状态: ${task.status} (已审核: ${isApproved})`);

      if (!isApproved) {
        console.log('任务未审核，跳过');
        return false;
      }

      // 2. 获取和验证日期
      try {
        const endDate = new Date(task.endDate);
        const startDate = new Date(task.startDate);
        
        // 确保日期有效
        if (isNaN(endDate.getTime()) || isNaN(startDate.getTime())) {
          console.log('无效的日期格式:', { start: task.startDate, end: task.endDate });
          return false;
        }

        // 截止日期要大于等于今天
        const isDateValid = endDate >= today;
        console.log('日期检查:', {
          开始: task.startDate,
          结束: task.endDate,
          今天: today.toISOString().split('T')[0],
          有效: isDateValid
        });

        return isDateValid;
      } catch (err) {
        console.log('日期处理出错:', err);
        return false;
      }
    });
  });

  // 根据ID获取任务详情
  const fetchTestTaskById = async (taskId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getTestTaskById(taskId);
      currentTestTask.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || '获取测试任务详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取用户测试报名列表
  const fetchUserTestRegistrations = async (userId) => {
    loading.value = true;
    error.value = null;
    
    try {
      // 使用新的 testRegistrationApi 获取用户测试报名数据
      const response = await testRegistrationApi.getUserRegistrations(userId);
      // testRegistrationApi 返回的是 mockResponse 格式: {data: {content: [...], ...}}
      const registrations = response.data?.content || [];
      userTestRegistrations.value = Array.isArray(registrations) ? registrations : [];
      return userTestRegistrations.value;
    } catch (err) {
      error.value = err.message || '获取用户测试报名列表失败';
      // 如果API调用失败，回退到旧的API
      try {
        const response = await getUserTestRegistrations(userId);
        // 从响应中提取数组数据
        const registrations = response.data?.content || response.data || [];
        userTestRegistrations.value = Array.isArray(registrations) ? registrations : [];
        return userTestRegistrations.value;
      } catch (fallbackErr) {
        console.error('Fallback API also failed:', fallbackErr);
        // 确保即使失败也返回空数组
        userTestRegistrations.value = [];
        throw error.value;
      }
    } finally {
      loading.value = false;
    }
  };

  // 创建测试任务
  const createTestTask = async (taskData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createTestTaskApi(taskData);
      // 创建成功后，可以选择刷新任务列表
      // await fetchTestTasks(); // 可选：刷新列表
      return response;
    } catch (err) {
      error.value = err.message || '创建测试任务失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // 状态
    testTasks,
    currentTestTask,
    loading,
    error,
    pagination,
    userTestRegistrations,
    
    // 计算属性
    approvedTasks,
    bookableTasks,
    
    // 方法
    fetchTestTasks,
    fetchTestTaskById,
    fetchUserTestRegistrations,
    createTestTask
  };
});
