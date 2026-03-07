<template>
  <div class="notification-detail">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="消息详情"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="detail-container" v-if="notification">
      <!-- 消息头部 -->
      <div class="message-header">
        <div class="header-left">
          <van-icon 
            :name="getNotificationIcon(notification.type)" 
            :color="getNotificationColor(notification.priority)"
            size="24"
          />
          <div class="header-info">
            <h3 class="message-title">{{ notification.title }}</h3>
            <div class="message-meta">
              <van-tag 
                :type="getPriorityType(notification.priority)" 
                size="small"
              >
                {{ getPriorityText(notification.priority) }}
              </van-tag>
              <span class="message-time">{{ formatDateTime(notification.createdAt) }}</span>
            </div>
          </div>
        </div>
        <van-button 
          v-if="!notification.read"
          size="small" 
          type="primary" 
          @click="markAsRead"
        >
          标为已读
        </van-button>
      </div>

      <!-- 消息内容 -->
      <div class="message-content">
        <p>{{ notification.content }}</p>
      </div>

      <!-- 额外信息显示 -->
      <div v-if="notification.dueDate" class="info-section">
        <van-cell-group title="重要信息">
          <van-cell title="截止时间" :value="formatDateTime(notification.dueDate)" />
        </van-cell-group>
      </div>

      <!-- 审批进度显示 -->
      <div v-if="notification.approvalProgress" class="approval-progress">
        <van-cell-group title="审批进度">
          <van-cell
            v-for="progress in notification.approvalProgress"
            :key="progress.department"
            :title="progress.department"
            :value="getApprovalStatusText(progress.status)"
          >
            <template #label v-if="progress.date">
              {{ formatDate(progress.date) }}
            </template>
            <template #right-icon>
              <van-icon
                :name="getApprovalStatusIcon(progress.status)"
                :color="getApprovalStatusColor(progress.status)"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 受影响的预约 -->
      <div v-if="notification.affectedBookings && notification.affectedBookings.length > 0" class="affected-bookings">
        <van-cell-group title="受影响的预约">
          <van-cell
            v-for="bookingId in notification.affectedBookings"
            :key="bookingId"
            :title="`预约 ${bookingId}`"
            value="查看详情"
            is-link
            @click="viewBookingDetail(bookingId)"
          />
        </van-cell-group>
      </div>

      <!-- 操作按钮 -->
      <div v-if="notification.actions && notification.actions.length > 0" class="action-buttons">
        <van-button
          v-for="action in notification.actions"
          :key="action.action"
          :type="getActionButtonType(action.action)"
          block
          @click="handleAction(action)"
          class="action-button"
        >
          {{ action.label }}
        </van-button>
      </div>

      <!-- 告警信息显示 -->
      <div v-if="notification.category === 'alert'" class="alert-section">
        <van-cell-group title="告警信息">
          <van-cell title="告警类型" :value="notification.alertType" />
          <van-cell title="设备名称" :value="notification.deviceName || '未知'" v-if="notification.deviceName" />
          <van-cell title="场地名称" :value="notification.siteName || '未知'" v-if="notification.siteName" />
          <van-cell title="告警状态">
            <template #value>
              <van-tag :type="notification.status === 'active' ? 'danger' : 'success'" plain round>
                {{ notification.status === 'active' ? '未处理' : '已处理' }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 告警处理操作 -->
      <div v-if="notification.category === 'alert' && notification.status === 'active'" class="action-buttons">
        <van-button
          type="primary"
          block
          @click="handleAlert"
          class="action-button"
        >
          处理告警
        </van-button>
      </div>

      <!-- 相关链接 -->
      <div class="related-links">
        <van-cell-group title="相关操作">
          <van-cell 
            title="查看相关详情" 
            is-link 
            @click="viewRelatedDetail"
            v-if="notification.relatedId"
          />
          <van-cell 
            title="消息设置" 
            is-link 
            @click="goToNotificationSettings"
          />
        </van-cell-group>
      </div>
    </div>

    <van-empty v-else description="消息不存在" />

    <!-- 操作确认弹窗 -->
    <van-dialog
      v-model:show="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      show-cancel-button
      @confirm="confirmAction"
      @cancel="cancelAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMobileDashboardStore } from '../stores/dashboard';
import { showToast } from 'vant';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const dashboardStore = useMobileDashboardStore();

const notificationId = route.params.id;
const notification = ref(null);
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '',
  message: '',
  action: null
});

// 获取通知详情
onMounted(async () => {
  try {
    await dashboardStore.initializeDashboard();
    const notifications = dashboardStore.announcements;
    notification.value = notifications.find(n => n.id === notificationId);
    
    if (!notification.value) {
      showToast('消息不存在');
      router.back();
    }
  } catch (error) {
    console.error('获取消息详情失败:', error);
    showToast('获取消息详情失败');
  }
});

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD HH:mm');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return dayjs(dateString).format('YYYY-MM-DD');
};

// 获取通知图标
const getNotificationIcon = (type) => {
  const iconMap = {
    'APPROVAL': 'check-circle-o',
    'SITE_NOTIFICATION': 'location-o',
    'EQUIPMENT_REMINDER': 'tool-o',
    'APPOINTMENT': 'calendar-o',
    'TEST': 'experiment',
    'ALERT': 'warning-o'
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

// 获取审批状态文本
const getApprovalStatusText = (status) => {
  const statusMap = {
    'approved': '已通过',
    'pending': '审核中',
    'waiting': '等待中',
    'rejected': '已拒绝'
  };
  return statusMap[status] || status;
};

// 获取审批状态图标
const getApprovalStatusIcon = (status) => {
  const iconMap = {
    'approved': 'check-circle',
    'pending': 'clock-o',
    'waiting': 'pause-circle-o',
    'rejected': 'close-circle'
  };
  return iconMap[status] || 'info-o';
};

// 获取审批状态颜色
const getApprovalStatusColor = (status) => {
  const colorMap = {
    'approved': '#07c160',
    'pending': '#1989fa',
    'waiting': '#969799',
    'rejected': '#ee0a24'
  };
  return colorMap[status] || '#969799';
};

// 获取操作按钮类型
const getActionButtonType = (action) => {
  const typeMap = {
    'confirm_attendance': 'primary',
    'confirm_return': 'success',
    'accept_change': 'primary',
    'reapply': 'warning',
    'request_extension': 'warning',
    'book_now': 'primary',
    'reschedule': 'default'
  };
  return typeMap[action] || 'default';
};

// 标记为已读
const markAsRead = async () => {
  try {
    // 这里应该调用API标记消息为已读
    notification.value.read = true;
    showToast('已标记为已读');
  } catch (error) {
    console.error('标记已读失败:', error);
    showToast('操作失败');
  }
};

// 处理操作按钮点击
const handleAction = (action) => {
  confirmDialog.value = {
    title: '确认操作',
    message: `确定要${action.label}吗？`,
    action: action
  };
  showConfirmDialog.value = true;
};

// 确认操作
const confirmAction = async () => {
  const action = confirmDialog.value.action;
  showConfirmDialog.value = false;
  
  try {
    // 根据不同的操作类型执行相应的逻辑
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
      case 'reapply':
        router.push('/equipment/applications');
        break;
      case 'request_extension':
        showToast('延期申请已提交');
        break;
      case 'book_now':
        router.push(`/test-sites/${notification.value.relatedId}`);
        break;
      case 'reschedule':
        router.push('/bookings');
        break;
      default:
        showToast(`执行${action.label}操作`);
    }
  } catch (error) {
    console.error('操作失败:', error);
    showToast('操作失败');
  }
};

// 取消操作
const cancelAction = () => {
  showConfirmDialog.value = false;
};

// 查看预约详情
const viewBookingDetail = (bookingId) => {
  router.push(`/bookings/${bookingId}`);
};

// 查看相关详情
const viewRelatedDetail = () => {
  const { relatedType, relatedId } = notification.value;
  
  switch (relatedType) {
    case 'TEST_TASK':
      router.push(`/test-tasks/${relatedId}`);
      break;
    case 'EQUIPMENT_APPLICATION':
      router.push(`/equipment/applications/${relatedId}`);
      break;
    case 'TEST_SITE':
      router.push(`/test-sites/${relatedId}`);
      break;
    case 'BOOKING':
      router.push(`/bookings/${relatedId}`);
      break;
    case 'CONTRACT':
      router.push(`/contracts/${relatedId}`);
      break;
    default:
      showToast('相关详情页面暂未开放');
  }
};

// 跳转到通知设置
const goToNotificationSettings = () => {
  router.push('/profile/notifications');
};

// 处理告警
const handleAlert = async () => {
  try {
    await dashboardStore.handleAlert(notification.value.id, {
      status: 'resolved',
      handler: userProfile.value.name || '未知用户',
      remark: '已处理告警'
    });
    
    // 更新本地状态
    notification.value.status = 'resolved';
    showToast('告警处理成功');
  } catch (error) {
    console.error('处理告警失败:', error);
    showToast('处理告警失败');
  }
};
</script>

<style lang="less" scoped>
.notification-detail {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.detail-container {
  padding: 16px;
}

.message-header {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .header-left {
    display: flex;
    align-items: flex-start;
    flex: 1;

    .van-icon {
      margin-right: 12px;
      margin-top: 2px;
    }

    .header-info {
      flex: 1;

      .message-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        line-height: 1.4;
      }

      .message-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .message-time {
          font-size: 12px;
          color: #969799;
        }
      }
    }
  }
}

.message-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;

  p {
    line-height: 1.6;
    color: #323233;
    margin: 0;
  }
}

.info-section,
.approval-progress,
.affected-bookings,
.related-links {
  margin-bottom: 12px;

  :deep(.van-cell-group) {
    border-radius: 12px;
  }
}

.action-buttons {
  margin-bottom: 12px;

  .action-button {
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.approval-progress {
  :deep(.van-cell) {
    .van-cell__value {
      font-weight: 600;
    }
  }
}
</style>
