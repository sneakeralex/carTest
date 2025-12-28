<template>
  <div class="notifications">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="通知消息"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <van-button 
          size="small" 
          type="primary" 
          @click="markAllAsRead"
          v-if="unreadCount > 0"
        >
          全部已读
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 筛选标签 -->
    <div class="filter-tabs">
      <van-tabs v-model:active="activeTab" @change="onTabChange">
        <van-tab title="全部" name="all">
          <van-badge :content="allNotifications.length" v-if="allNotifications.length > 0" />
        </van-tab>
        <van-tab title="未读" name="unread">
          <van-badge :content="unreadCount" v-if="unreadCount > 0" />
        </van-tab>
        <van-tab title="审批" name="approval">
          <van-badge :content="approvalNotifications.length" v-if="approvalNotifications.length > 0" />
        </van-tab>
        <van-tab title="场地" name="site">
          <van-badge :content="siteNotifications.length" v-if="siteNotifications.length > 0" />
        </van-tab>
        <van-tab title="设备" name="equipment">
          <van-badge :content="equipmentNotifications.length" v-if="equipmentNotifications.length > 0" />
        </van-tab>
      </van-tabs>
    </div>

    <!-- 通知列表 -->
    <div class="notification-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div 
            v-for="notification in displayNotifications" 
            :key="notification.id"
            class="notification-item"
            :class="{ 'unread': !notification.read }"
            @click="viewNotification(notification)"
          >
            <div class="notification-content">
              <!-- 左侧图标 -->
              <div class="notification-icon">
                <van-icon 
                  :name="getNotificationIcon(notification.type)" 
                  :color="getNotificationColor(notification.priority)"
                  size="20"
                />
                <div 
                  v-if="!notification.read" 
                  class="unread-dot"
                ></div>
              </div>

              <!-- 中间内容 -->
              <div class="notification-main">
                <div class="notification-header">
                  <h4 class="notification-title">{{ notification.title }}</h4>
                  <van-tag 
                    :type="getPriorityType(notification.priority)" 
                    size="small"
                    v-if="notification.priority === 'urgent' || notification.priority === 'high'"
                  >
                    {{ getPriorityText(notification.priority) }}
                  </van-tag>
                </div>
                
                <p class="notification-summary">{{ getNotificationSummary(notification.content) }}</p>
                
                <div class="notification-meta">
                  <span class="notification-time">{{ formatRelativeTime(notification.createdAt) }}</span>
                  <van-tag 
                    :type="getCategoryType(notification.category)" 
                    size="small" 
                    plain
                  >
                    {{ getCategoryText(notification.category) }}
                  </van-tag>
                </div>

                <!-- 操作提醒 -->
                <div v-if="notification.actionRequired" class="action-required">
                  <van-icon name="warning-o" size="12" />
                  <span>需要处理</span>
                </div>
              </div>

              <!-- 右侧箭头 -->
              <div class="notification-arrow">
                <van-icon name="arrow" color="#c8c9cc" />
              </div>
            </div>

            <!-- 快捷操作 -->
            <div v-if="notification.actions && notification.actions.length > 0" class="quick-actions">
              <van-button
                v-for="(action, index) in notification.actions.slice(0, 2)"
                :key="action.action"
                size="small"
                :type="index === 0 ? 'primary' : 'default'"
                @click.stop="handleQuickAction(notification, action)"
              >
                {{ action.label }}
              </van-button>
            </div>
          </div>

          <van-empty v-if="displayNotifications.length === 0" description="暂无通知消息" />
        </van-list>
      </van-pull-refresh>
    </div>

    <!-- 操作确认弹窗 -->
    <van-dialog
      v-model:show="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      show-cancel-button
      @confirm="confirmQuickAction"
      @cancel="cancelQuickAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMobileDashboardStore } from '../stores/dashboard';
import { showToast } from 'vant';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const router = useRouter();
const dashboardStore = useMobileDashboardStore();

// 响应式数据
const activeTab = ref('all');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);
const allNotifications = ref([]);
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '',
  message: '',
  notification: null,
  action: null
});

// 计算属性
const unreadCount = computed(() => {
  return allNotifications.value.filter(n => !n.read).length;
});

const unreadNotifications = computed(() => {
  return allNotifications.value.filter(n => !n.read);
});

const approvalNotifications = computed(() => {
  return allNotifications.value.filter(n => n.category === 'approval');
});

const siteNotifications = computed(() => {
  return allNotifications.value.filter(n => n.category === 'site');
});

const equipmentNotifications = computed(() => {
  return allNotifications.value.filter(n => n.category === 'equipment');
});

const displayNotifications = computed(() => {
  switch (activeTab.value) {
    case 'unread':
      return unreadNotifications.value;
    case 'approval':
      return approvalNotifications.value;
    case 'site':
      return siteNotifications.value;
    case 'equipment':
      return equipmentNotifications.value;
    default:
      return allNotifications.value;
  }
});

// 初始化数据
onMounted(async () => {
  await loadNotifications();
});

// 加载通知数据
const loadNotifications = async () => {
  try {
    await dashboardStore.initializeDashboard();
    allNotifications.value = dashboardStore.announcements;
    finished.value = true;
  } catch (error) {
    console.error('加载通知失败:', error);
    showToast('加载通知失败');
  }
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await loadNotifications();
  refreshing.value = false;
  showToast('刷新成功');
};

// 加载更多
const onLoad = async () => {
  // 这里可以实现分页加载
  loading.value = false;
};

// 标签切换
const onTabChange = (name) => {
  activeTab.value = name;
};

// 格式化相对时间
const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).fromNow();
};

// 获取通知摘要
const getNotificationSummary = (content) => {
  if (content.length <= 50) return content;
  return content.substring(0, 50) + '...';
};

// 获取通知图标
const getNotificationIcon = (type) => {
  const iconMap = {
    'APPROVAL': 'check-circle-o',
    'SITE_NOTIFICATION': 'location-o',
    'EQUIPMENT_REMINDER': 'tool-o',
    'APPOINTMENT': 'calendar-o',
    'TEST': 'experiment'
  };
  return iconMap[type] || 'bell';
};

// 获取通知颜色
const getNotificationColor = (priority) => {
  const colorMap = {
    'urgent': '#ee0a24',
    'high': '#ff976a',
    'medium': '#1989fa',
    'low': '#969799'
  };
  return colorMap[priority] || '#969799';
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
    'equipment': 'success'
  };
  return typeMap[category] || 'default';
};

// 获取分类文本
const getCategoryText = (category) => {
  const textMap = {
    'approval': '审批',
    'site': '场地',
    'equipment': '设备'
  };
  return textMap[category] || category;
};

// 查看通知详情
const viewNotification = (notification) => {
  // 标记为已读
  if (!notification.read) {
    notification.read = true;
  }
  
  router.push(`/notifications/${notification.id}`);
};

// 全部标记为已读
const markAllAsRead = async () => {
  try {
    allNotifications.value.forEach(notification => {
      notification.read = true;
    });
    showToast('已全部标记为已读');
  } catch (error) {
    console.error('标记已读失败:', error);
    showToast('操作失败');
  }
};

// 处理快捷操作
const handleQuickAction = (notification, action) => {
  confirmDialog.value = {
    title: '确认操作',
    message: `确定要${action.label}吗？`,
    notification,
    action
  };
  showConfirmDialog.value = true;
};

// 确认快捷操作
const confirmQuickAction = async () => {
  const { notification, action } = confirmDialog.value;
  showConfirmDialog.value = false;
  
  try {
    // 执行快捷操作逻辑
    switch (action.action) {
      case 'confirm_attendance':
        showToast('已确认参加测试');
        break;
      case 'confirm_return':
        showToast('已确认设备归还');
        break;
      case 'accept_change':
        showToast('已接受时间调整');
        break;
      case 'view_detail':
        viewNotification(notification);
        break;
      default:
        showToast(`执行${action.label}操作`);
    }
    
    // 标记为已读
    if (!notification.read) {
      notification.read = true;
    }
  } catch (error) {
    console.error('操作失败:', error);
    showToast('操作失败');
  }
};

// 取消快捷操作
const cancelQuickAction = () => {
  showConfirmDialog.value = false;
};
</script>

<style lang="less" scoped>
.notifications {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.filter-tabs {
  background-color: #fff;
  
  :deep(.van-tabs__nav) {
    padding: 0 16px;
  }
  
  :deep(.van-tab) {
    position: relative;
    
    .van-badge {
      position: absolute;
      top: 4px;
      right: -8px;
    }
  }
}

.notification-list {
  padding: 8px 16px 16px;
}

.notification-item {
  background-color: #fff;
  border-radius: 12px;
  margin-bottom: 8px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &.unread {
    border-left: 3px solid #1989fa;
    
    .notification-title {
      font-weight: 600;
    }
  }

  .notification-content {
    display: flex;
    align-items: flex-start;
    padding: 16px;
    position: relative;

    .notification-icon {
      position: relative;
      margin-right: 12px;
      margin-top: 2px;

      .unread-dot {
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background-color: #ee0a24;
        border-radius: 50%;
        border: 2px solid #fff;
      }
    }

    .notification-main {
      flex: 1;

      .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;

        .notification-title {
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          margin-right: 8px;
          flex: 1;
        }
      }

      .notification-summary {
        font-size: 13px;
        color: #646566;
        line-height: 1.4;
        margin: 0 0 8px 0;
      }

      .notification-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .notification-time {
          font-size: 12px;
          color: #969799;
        }
      }

      .action-required {
        display: flex;
        align-items: center;
        margin-top: 8px;
        font-size: 12px;
        color: #ff976a;

        .van-icon {
          margin-right: 4px;
        }
      }
    }

    .notification-arrow {
      margin-left: 8px;
      margin-top: 8px;
    }
  }

  .quick-actions {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
    border-top: 1px solid #f0f0f0;
    margin-top: -8px;
    padding-top: 12px;
  }
}
</style>
