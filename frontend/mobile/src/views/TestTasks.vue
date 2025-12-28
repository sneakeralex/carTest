<template>
  <div class="test-tasks-container">
    <!-- 导航栏 -->
    <van-nav-bar title="测试任务">
      <template #right>
        <van-icon name="plus" @click="$router.push('/test-tasks/new')" style="font-size: 20px;" />
      </template>
    </van-nav-bar>

    <!-- 搜索栏 -->
    <van-search
      v-model="searchKeyword"
      placeholder="搜索测试任务"
      @search="onSearch"
      @clear="onClear"
    />
    
    <!-- 筛选条件 -->
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="selectedTaskType" :options="taskTypeOptions" @change="onFilterChange" />
        <van-dropdown-item v-model="selectedDifficulty" :options="difficultyOptions" @change="onFilterChange" />
        <van-dropdown-item v-model="selectedStatus" :options="statusOptions" @change="onFilterChange" />
      </van-dropdown-menu>
    </div>
    
    <!-- 测试任务列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="test-task-list">
          <van-card
            v-for="task in testTasks"
            :key="task.taskId"
            :title="task.taskName"
            :desc="task.description"
            class="test-task-card"
            @click="goToTestTaskDetail(task.taskId)"
          >
            <template #thumb>
              <div class="task-icon">
                <van-icon :name="getTaskIcon(task.taskType)" size="40" />
              </div>
            </template>
            <template #tags>
              <van-tag 
                :type="getDifficultyType(task.difficulty)" 
                size="small"
              >
                {{ getDifficultyText(task.difficulty) }}
              </van-tag>
              <van-tag 
                plain 
                type="primary" 
                size="small"
                style="margin-left: 4px;"
              >
                {{ task.taskType }}
              </van-tag>
            </template>
            <template #footer>
              <div class="task-info">
                <div class="info-row">
                  <van-icon name="clock-o" />
                  <span>时长: {{ task.duration }}分钟</span>
                </div>
                <div class="info-row">
                  <van-icon name="star-o" />
                  <span>满分: {{ task.maxScore }}分</span>
                </div>
                <div class="info-row">
                  <van-icon name="passed" />
                  <span>及格: {{ task.passScore }}分</span>
                </div>
              </div>
              <div class="action-buttons">
                <van-button 
                  size="small" 
                  type="primary" 
                  @click.stop="registerTask(task)"
                  :disabled="task.status !== 'ACTIVE'"
                >
                  {{ task.status === 'ACTIVE' ? '立即报名' : '暂停报名' }}
                </van-button>
              </div>
            </template>
          </van-card>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <!-- 空状态 -->
    <van-empty v-if="!loading && testTasks.length === 0" description="暂无测试任务" />
    
    <!-- 报名弹窗 -->
    <van-popup v-model:show="showRegisterPopup" position="bottom" round>
      <div class="register-popup">
        <div class="popup-header">
          <h3>报名测试任务</h3>
        </div>
        <div class="popup-content">
          <van-field
            v-model="registerForm.notes"
            label="备注"
            type="textarea"
            placeholder="请输入备注信息（可选）"
            rows="3"
          />
        </div>
        <div class="popup-footer">
          <van-button block type="primary" @click="confirmRegister">
            确认报名
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo } from '../utils/auth.js';
import { useTestTaskStore } from '../stores/testTask';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();
const testTaskStore = useTestTaskStore();

// 响应式数据
const searchKeyword = ref('');
const testTasks = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const showRegisterPopup = ref(false);

// 筛选条件
const selectedTaskType = ref('');
const selectedDifficulty = ref('');
const selectedStatus = ref('');

// 筛选选项
const taskTypeOptions = ref([
  { text: '全部类型', value: '' },
  { text: '性能测试', value: '性能测试' },
  { text: '安全测试', value: '安全测试' },
  { text: '环保测试', value: '环保测试' }
]);

const difficultyOptions = ref([
  { text: '全部难度', value: '' },
  { text: '简单', value: 'EASY' },
  { text: '中等', value: 'MEDIUM' },
  { text: '困难', value: 'HARD' }
]);

const statusOptions = ref([
  { text: '全部状态', value: '' },
  { text: '草稿', value: 'DRAFT' },
  { text: '待审核', value: 'PENDING' },
  { text: '已审核', value: 'APPROVED' },
  { text: '进行中', value: 'IN_PROGRESS' },
  { text: '已完成', value: 'COMPLETED' },
  { text: '已取消', value: 'CANCELLED' }
]);

// 报名表单
const registerForm = reactive({
  taskId: '',
  notes: ''
});

// 分页参数
const pagination = reactive({
  page: 0,
  size: 10
});

// 获取测试任务列表
const fetchTestTasks = async (isRefresh = false) => {
  if (isRefresh) {
    pagination.page = 0;
    finished.value = false;
  }
  
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      keyword: searchKeyword.value,
      taskType: selectedTaskType.value,
      difficulty: selectedDifficulty.value,
      status: selectedStatus.value
    };
    
    const response = await testTaskStore.fetchTestTasks(params);
    
    if (isRefresh) {
      testTasks.value = response.content || [];
    } else {
      testTasks.value.push(...(response.content || []));
    }
    
    // 检查是否还有更多数据
    if (!response.content || response.content.length < pagination.size) {
      finished.value = true;
    } else {
      pagination.page++;
    }
  } catch (error) {
    console.error('获取测试任务列表失败:', error);
    showToast('获取测试任务列表失败');
  }
};

// 页面加载
onMounted(() => {
  fetchTestTasks(true);
});

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await fetchTestTasks(true);
  refreshing.value = false;
};

// 上拉加载
const onLoad = async () => {
  if (finished.value) return;
  loading.value = true;
  await fetchTestTasks();
  loading.value = false;
};

// 搜索
const onSearch = () => {
  fetchTestTasks(true);
};

// 清空搜索
const onClear = () => {
  searchKeyword.value = '';
  fetchTestTasks(true);
};

// 筛选条件变化
const onFilterChange = () => {
  fetchTestTasks(true);
};

// 获取任务图标
const getTaskIcon = (taskType) => {
  const iconMap = {
    '性能测试': 'fire-o',
    '安全测试': 'shield-o',
    '环保测试': 'leaf-o'
  };
  return iconMap[taskType] || 'medal-o';
};

// 获取难度类型
const getDifficultyType = (difficulty) => {
  const typeMap = {
    'EASY': 'success',
    'MEDIUM': 'warning',
    'HARD': 'danger'
  };
  return typeMap[difficulty] || 'default';
};

// 获取难度文本
const getDifficultyText = (difficulty) => {
  const textMap = {
    'EASY': '简单',
    'MEDIUM': '中等',
    'HARD': '困难'
  };
  return textMap[difficulty] || difficulty;
};

// 跳转到测试任务详情
const goToTestTaskDetail = (taskId) => {
  router.push(`/test-tasks/${taskId}`);
};

// 报名测试任务
const registerTask = (task) => {
  registerForm.taskId = task.taskId;
  registerForm.notes = '';
  showRegisterPopup.value = true;
};

// 确认报名
const confirmRegister = async () => {
  try {
    const userInfo = getUserInfo();
    
    const registrationData = {
      taskId: registerForm.taskId,
      userId: userInfo.userId,
      notes: registerForm.notes
    };
    
    await testTaskStore.addTestRegistration(registrationData);
    showToast('报名成功');
    showRegisterPopup.value = false;
    
    // 跳转到我的报名页面
    router.push('/my-registrations');
  } catch (error) {
    console.error('报名失败:', error);
    showToast('报名失败，请稍后重试');
  }
};
</script>

<style lang="less" scoped>
.test-tasks-container {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.filter-bar {
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

.test-task-list {
  padding: 16px;
}

.test-task-card {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  
  .task-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f8fa;
    border-radius: 8px;
    color: #1989fa;
  }
  
  .task-info {
    margin-top: 8px;
    
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 12px;
      color: #969799;
      
      .van-icon {
        margin-right: 4px;
      }
    }
  }
  
  .action-buttons {
    margin-top: 12px;
    text-align: right;
  }
}

.register-popup {
  padding: 20px;
  
  .popup-header {
    text-align: center;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .popup-content {
    margin-bottom: 20px;
  }
}
</style>
