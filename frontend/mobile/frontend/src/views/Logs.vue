<template>
  <div class="logs-container">
    <NavBar title="系统日志" left-text="返回" left-arrow @click-left="goBack" />
    
    <div class="logs-content">
      <!-- 筛选条件 -->
      <div class="filter-section">
        <Field label="日志级别" input-align="right">
          <template #input>
            <DropdownMenu>
              <DropdownItem v-model="filter.level" :options="levelOptions" />
            </DropdownMenu>
          </template>
        </Field>
        <Field label="服务" input-align="right">
          <template #input>
            <DropdownMenu>
              <DropdownItem v-model="filter.service" :options="serviceOptions" />
            </DropdownMenu>
          </template>
        </Field>
        <Button type="primary" block @click="fetchLogs">查询日志</Button>
      </div>
      
      <!-- 日志统计 -->
      <div class="stats-section" v-if="stats">
        <Card title="日志统计">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-label">总日志数</div>
              <div class="stat-value">{{ stats.total || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">错误日志</div>
              <div class="stat-value error">{{ stats.error || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">警告日志</div>
              <div class="stat-value warning">{{ stats.warning || 0 }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">信息日志</div>
              <div class="stat-value info">{{ stats.info || 0 }}</div>
            </div>
          </div>
        </Card>
      </div>
      
      <!-- 日志列表 -->
      <div class="logs-list">
        <List
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="loadMore"
        >
          <Cell v-for="(log, index) in logs" :key="index" :title="log.message" :value="log.timestamp">
            <template #default>
              <div class="log-item">
                <div class="log-level" :class="log.level.toLowerCase()">{{ log.level }}</div>
                <div class="log-service">{{ log.service }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</div>
                <div class="log-ip" v-if="log.ip">{{ log.ip }}</div>
              </div>
            </template>
          </Cell>
        </List>
      </div>
      
      <!-- 清理日志按钮 -->
      <div class="cleanup-section">
        <Button type="danger" block @click="showCleanupDialog">清理旧日志</Button>
      </div>
    </div>
    
    <!-- 清理日志对话框 -->
    <Dialog
      v-model:show="showCleanupDialogVisible"
      title="清理旧日志"
      show-cancel-button
      @confirm="cleanupLogs"
    >
      <div class="cleanup-dialog-content">
        <Field v-model="cleanupDays" label="清理天数" type="number" placeholder="输入清理天数" />
        <p>将清理指定天数之前的日志</p>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Field, DropdownMenu, DropdownItem, Button, Card, List, Cell, Dialog, NavBar } from 'vant';

const router = useRouter();
const logs = ref([]);
const stats = ref(null);
const loading = ref(false);
const finished = ref(false);
const offset = ref(0);
const limit = 50;

// 筛选条件
const filter = ref({
  level: '',
  service: ''
});

// 清理日志
const showCleanupDialogVisible = ref(false);
const cleanupDays = ref(7);

// 日志级别选项
const levelOptions = [
  { text: '全部', value: '' },
  { text: 'ERROR', value: 'ERROR' },
  { text: 'WARNING', value: 'WARNING' },
  { text: 'INFO', value: 'INFO' },
  { text: 'DEBUG', value: 'DEBUG' }
];

// 服务选项
const serviceOptions = [
  { text: '全部', value: '' },
  { text: 'server', value: 'server' },
  { text: 'sms', value: 'sms' },
  { text: 'login', value: 'login' },
  { text: 'logs', value: 'logs' },
  { text: 'proxy', value: 'proxy' }
];

// 格式化时间戳
function formatTimestamp(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// 获取日志
async function fetchLogs(reset = true) {
  if (reset) {
    logs.value = [];
    offset.value = 0;
    finished.value = false;
  }
  
  loading.value = true;
  try {
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.value.toString()
    });
    
    if (filter.value.level) {
      queryParams.append('level', filter.value.level);
    }
    if (filter.value.service) {
      queryParams.append('service', filter.value.service);
    }
    
    const response = await fetch(`/api/logs?${queryParams.toString()}`, {
      credentials: 'include'
    });
    const data = await response.json();
    
    if (data.error) {
      alert(data.error);
      return;
    }
    
    if (reset) {
      logs.value = data.logs || [];
      stats.value = data.stats;
    } else {
      logs.value = logs.value.concat(data.logs || []);
    }
    
    if ((data.logs || []).length < limit) {
      finished.value = true;
    }
    
    offset.value += limit;
  } catch (error) {
    console.error('获取日志失败:', error);
    alert('获取日志失败，请重试');
  } finally {
    loading.value = false;
  }
}

// 加载更多
function loadMore() {
  fetchLogs(false);
}

// 清理日志
async function cleanupLogs() {
  try {
    const response = await fetch('/api/logs/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ days: parseInt(cleanupDays.value) || 7 }),
      credentials: 'include'
    });
    
    const data = await response.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    
    alert(data.message || '清理成功');
    fetchLogs();
  } catch (error) {
    console.error('清理日志失败:', error);
    alert('清理日志失败，请重试');
  } finally {
    showCleanupDialogVisible.value = false;
  }
}

// 显示清理日志对话框
function showCleanupDialog() {
  showCleanupDialogVisible.value = true;
}

// 返回
function goBack() {
  router.back();
}

// 初始化
onMounted(() => {
  fetchLogs();
});
</script>

<style lang="less" scoped>
.logs-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logs-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.filter-section {
  margin-bottom: 16px;
}

.stats-section {
  margin-bottom: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 12px;
}

.stat-item {
  text-align: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.stat-value.error {
  color: #ff4d4f;
}

.stat-value.warning {
  color: #faad14;
}

.stat-value.info {
  color: #1890ff;
}

.logs-list {
  margin-bottom: 16px;
}

.log-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.log-level {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 8px;
}

.log-level.error {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.log-level.warning {
  background-color: #fff7e6;
  color: #faad14;
}

.log-level.info {
  background-color: #e6f7ff;
  color: #1890ff;
}

.log-level.debug {
  background-color: #f0f0f0;
  color: #666;
}

.log-service {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.log-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  line-height: 1.4;
}

.log-timestamp {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.log-ip {
  font-size: 12px;
  color: #999;
}

.cleanup-section {
  margin-top: 16px;
}

.cleanup-dialog-content {
  padding: 16px 0;
}
</style>