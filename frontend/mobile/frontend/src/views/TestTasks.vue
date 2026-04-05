<template>
  <div class="test-tasks-container">
    <!-- 导航栏 -->
    <van-nav-bar title="实验任务单">
      <template #right>
        <van-icon name="plus" @click="$router.push('/test-tasks/new')" style="font-size: 20px;" />
      </template>
    </van-nav-bar>

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
            :key="task.id"
            :title="task.taskNo"
            :desc="task.delegatingEntityNm"
            class="test-task-card"
            @click="goToTestTaskDetail(task)"
          >
            <template #tags>
              <van-tag 
                :type="getStatusType(task.status)" 
                size="small"
              >
                {{ getStatusText(task.status) }}
              </van-tag>
            </template>
            <template #footer>
              <div class="task-info">
                <div class="info-row">
                  <van-icon name="calendar-o" />
                  <span>开始: {{ task.plannedStartDate }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="clock-o" />
                  <span>结束: {{ task.plannedEndDate }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="user-o" />
                  <span>创建人: {{ task.username }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="phone-o" />
                  <span>联系方式: {{ task.userPhone }}</span>
                </div>
              </div>
              <div class="action-buttons">
                <van-button 
                  size="small" 
                  type="success" 
                  @click.stop="viewTaskDetail(task)"
                >
                  详情
                </van-button>
                <van-button 
                  size="small" 
                  type="primary" 
                  @click.stop="editTask(task)"
                  style="margin-left: 8px;"
                >
                  编辑
                </van-button>
                <van-button 
                  size="small" 
                  type="danger" 
                  @click.stop="deleteTaskItem(task)"
                  style="margin-left: 8px;"
                >
                  删除
                </van-button>
              </div>
            </template>
          </van-card>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <!-- 空状态 -->
    <van-empty v-if="!loading && testTasks.length === 0" description="暂无实验任务单" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getItem } from '../utils/storage.js';
import { getTaskList, deleteTask as deleteTaskApi } from '../api/testTask';
import { showToast, showConfirmDialog } from 'vant';

const router = useRouter();

// 响应式数据
const testTasks = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 20
});

// 获取测试任务列表
const fetchTestTasks = async (isRefresh = false) => {
  if (isRefresh) {
    pagination.pageNum = 1;
    finished.value = false;
  }
  
  try {
    const userInfo = getItem('user', {});
    const userIdValue = userInfo?.userId || userInfo?.id;
    
    const params = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      userId: userIdValue
    };
    
    const response = await getTaskList(params);
    
    if (isRefresh) {
      testTasks.value = response.data?.content || [];
    } else {
      testTasks.value.push(...(response.data?.content || []));
    }
    
    // 检查是否还有更多数据
    const total = response.data?.total || 0;
    if (testTasks.value.length >= total) {
      finished.value = true;
    } else {
      pagination.pageNum++;
    }
  } catch (error) {
    console.error('获取实验任务单列表失败:', error);
    showToast('获取实验任务单列表失败');
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

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '1': 'primary',
    '2': 'success',
    '3': 'warning',
    '4': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    '1': '草稿',
    '2': '待审核',
    '3': '进行中',
    '4': '已完成'
  };
  return textMap[status] || status;
};

// 编辑任务
const editTask = (task) => {
  const taskData = encodeURIComponent(JSON.stringify(task));
  router.push({ 
    name: 'NewTestTask', 
    params: { taskData } 
  });
};

// 删除任务
const deleteTaskItem = async (task) => {
  try {
    await showConfirmDialog({
      title: '确认删除',
      message: `确定要删除实验任务单"${task.taskNo}"吗？`,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    });
    
    await deleteTaskApi(task.id);
    showToast('删除成功');
    // 刷新列表
    fetchTestTasks(true);
  } catch (error) {
    console.error('删除任务失败:', error);
    if (error !== 'cancel') {
      showToast('删除失败，请稍后重试');
    }
  }
};

// 查看任务详情
const viewTaskDetail = (task) => {
  const taskData = encodeURIComponent(JSON.stringify(task));
  router.push({ 
    name: 'NewTestTask', 
    params: { taskData } 
  });
};

// 跳转到测试任务详情
const goToTestTaskDetail = (task) => {
  // 目前先跳转到编辑页面
  const taskData = encodeURIComponent(JSON.stringify(task));
  router.push({ 
    name: 'NewTestTask', 
    params: { taskData } 
  });
};
</script>

<style lang="less" scoped>
.test-tasks-container {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.test-task-list {
  padding: 16px;
}

.test-task-card {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  
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
</style>
