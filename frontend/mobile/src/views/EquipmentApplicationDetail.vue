<template>
  <div class="equipment-application-detail">
    <!-- 头部导航 -->
    <van-nav-bar
      title="设备领用详情"
      left-arrow
      @click-left="router.back()"
    />
    
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading" size="24px" vertical>加载中...</van-loading>
    
    <!-- 错误提示 -->
    <van-empty v-else-if="error" :description="error" />
    
    <!-- 申请详情 -->
    <template v-else-if="applicationDetail">
      <!-- 设备信息 -->
      <van-cell-group inset title="设备信息">
        <van-cell title="设备名称" :value="applicationDetail.equipmentName" />
        <van-cell title="设备编号" :value="applicationDetail.equipmentCode" />
      </van-cell-group>
      
      <!-- 申请信息 -->
      <van-cell-group inset title="申请信息">
        <van-cell title="使用类型" :value="getApplyTypeText(applicationDetail.applyType)" />
        <van-cell title="开始时间" :value="formatDateTime(applicationDetail.startTime)" />
        <van-cell title="结束时间" :value="formatDateTime(applicationDetail.endTime)" />
        <van-cell title="使用时长" :value="applicationDetail.duration + '天'" />
        <van-cell title="使用地点" :value="applicationDetail.location" />
        <van-cell title="申请用途" :value="applicationDetail.purpose" />
        <van-cell title="备注说明" :value="applicationDetail.remarks || '无'" />
      </van-cell-group>
      
      <!-- 申请状态 -->
      <van-cell-group inset title="申请状态">
        <van-cell title="当前状态">
          <template #value>
            <van-tag :type="getStatusTagType(applicationDetail.status)" plain>
              {{ getStatusText(applicationDetail.status) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="申请人" :value="applicationDetail.applicantName" />
        <van-cell title="申请时间" :value="formatDateTime(applicationDetail.applyTime)" />
        <template v-if="applicationDetail.approverName">
          <van-cell title="审批人" :value="applicationDetail.approverName" />
          <van-cell title="审批时间" :value="formatDateTime(applicationDetail.approveTime)" />
          <van-cell title="审批备注" :value="applicationDetail.approveRemarks || '无'" />
        </template>
      </van-cell-group>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 管理员的审批操作 -->
        <template v-if="isAdmin && applicationDetail.status === 'PENDING'">
          <van-field
            v-model="approvalRemarks"
            rows="2"
            type="textarea"
            placeholder="请输入审批意见"
            label="审批意见"
          />
          <div class="approval-buttons">
            <van-button 
              type="success" 
              @click="handleApprove(true)"
              :loading="submitting"
            >
              批准申请
            </van-button>
            <van-button 
              type="danger" 
              @click="handleApprove(false)"
              :loading="submitting"
            >
              拒绝申请
            </van-button>
          </div>
        </template>

        <!-- 申请人的操作 -->
        <template v-if="canOperation">
          <!-- 待审批状态下显示取消申请按钮 -->
          <template v-if="applicationDetail.status === 'PENDING'">
            <van-button 
              type="danger" 
              block 
              @click="handleCancel"
              :loading="submitting"
            >
              取消申请
            </van-button>
          </template>
          
          <!-- 已批准状态下可以提前归还 -->
          <template v-if="applicationDetail.status === 'APPROVED'">
            <van-button 
              type="primary" 
              block 
              @click="handleReturn"
              :loading="submitting"
            >
              提前归还
            </van-button>
          </template>
        </template>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showDialog, showToast } from 'vant';
import { useEquipmentStore } from '../stores/equipment';
import { formatDateTime } from '@/utils/dateFormatter';
import { getUserInfo } from '../utils/auth.js';

const router = useRouter();
const route = useRoute();
const equipmentStore = useEquipmentStore();

// 页面状态
const loading = ref(false);
const error = ref(null);
const submitting = ref(false);
const applicationDetail = ref(null);
const approvalRemarks = ref('');
const cancelReason = ref('');

// 获取用户信息
const userInfo = computed(() => {
  return getUserInfo();
});

// 判断是否为管理员 
const isAdmin = computed(() => {
  // 检查用户名是否为admin
  return userInfo.value.username === 'admin';
});

// 根据登录用户判断是否可以操作
const canOperation = computed(() => {
  if (!applicationDetail.value) return false;
  return applicationDetail.value.applicantId === userInfo.value.userId;
});

// 获取申请详情
const fetchApplicationDetail = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const id = route.params.id;
    if (!id) throw new Error('无效的申请ID');
    
    const data = await equipmentStore.fetchApplicationById(id);
    applicationDetail.value = data;
  } catch (err) {
    console.error('获取申请详情失败:', err);
    error.value = err.message || '获取申请详情失败';
  } finally {
    loading.value = false;
  }
};

// 获取申请类型文本
const getApplyTypeText = (type) => {
  const typeMap = {
    'BORROW': '借用',
    'USE': '使用'
  };
  return typeMap[type] || type;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    0: 'warning',  // 待审批
    1: 'success',  // 已批准
    2: 'danger',   // 已拒绝
    3: 'primary',  // 已领用/使用
    4: 'default'   // 已归还
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    0: '待审批',
    1: '已批准', 
    2: '已拒绝',
    3: '已领用/使用',
    4: '已归还'
  };
  return statusMap[status] || '未知状态';
};

// 取消申请
const handleCancel = async () => {
  try {
    const { action } = await showDialog({
      title: '取消原因',
      message: 
        h('div', [
          h('p', '请输入取消原因'),
          h('van-field', {
            modelValue: cancelReason.value,
            'onUpdate:modelValue': (val) => cancelReason.value = val,
            type: 'textarea',
            rows: 2,
            placeholder: '请输入取消原因'
          })
        ]),
      showCancelButton: true,
      confirmButtonText: '确认取消',
      className: 'dialog-with-input',
      beforeClose: (action) => {
        if (action === 'confirm' && !cancelReason.value) {
          showToast('请输入取消原因');
          return false;
        }
        return true;
      }
    });
    
    if (action === 'cancel') return;
    
    submitting.value = true;
    await equipmentStore.cancelEquipmentRequest(
      applicationDetail.value.requestId,
      cancelReason.value
    );
    
    showToast({
      type: 'success',
      message: '已取消申请'
    });
    
    // 重新获取详情
    await fetchApplicationDetail();
  } catch (error) {
    console.error('取消申请失败:', error);
    showToast({
      type: 'fail',
      message: error.message || '取消申请失败，请重试'
    });
  } finally {
    submitting.value = false;
  }
};

// 提前归还
const handleReturn = async () => {
  try {
    await showDialog({
      title: '确认归还',
      message: '确定要提前归还此设备吗？',
      showCancelButton: true
    });
    
    submitting.value = true;
    const now = new Date().toISOString().split('T')[0] + ' 00:00:00';
    await equipmentStore.updateApplicationStatus(applicationDetail.value.id, {
      status: 'COMPLETED',
      endTime: now,
      approveRemarks: '用户提前归还'
    });
    
    showToast({
      type: 'success',
      message: '设备已归还'
    });
    
    // 重新获取详情
    await fetchApplicationDetail();
  } catch (error) {
    if (error.message) {
      showToast({
        type: 'fail',
        message: error.message
      });
    }
  } finally {
    submitting.value = false;
  }
};

// 处理审批
const handleApprove = async (approved) => {
  if (!approvalRemarks.value) {
    showToast({
      type: 'warning',
      message: '请输入审批意见'
    });
    return;
  }

  try {
    await showDialog({
      title: approved ? '确认批准' : '确认拒绝', 
      message: approved ? '确定要批准此设备领用申请吗？' : '确定要拒绝此设备领用申请吗？',
      showCancelButton: true
    });

    submitting.value = true;
    await equipmentStore.approveEquipmentRequest(
      applicationDetail.value.requestId, 
      approved,
      approvalRemarks.value,
      userInfo.value.userId
    );

    showToast({
      type: 'success',
      message: approved ? '已批准申请' : '已拒绝申请'
    });

    // 重新获取详情
    await fetchApplicationDetail();
  } catch (error) {
    console.error('审批失败:', error);
    showToast({
      type: 'fail',
      message: error.message || '审批失败，请重试'
    });
  } finally {
    submitting.value = false;
  }
};

// 初始化
onMounted(fetchApplicationDetail);
</script>

<style lang="less" scoped>
.equipment-application-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 24px;
}

.loading {
  margin: 20px auto;
  text-align: center;
}

.action-buttons {
  margin: 16px;
  
  .van-button {
    margin-top: 12px;
  }

  .approval-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 16px;
  }

  .van-field {
    margin-bottom: 8px;
    background-color: #fff;
  }
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  font-weight: 600;
}

:deep(.dialog-with-input) {
  .van-dialog__content {
    padding: 16px;
    
    .van-field {
      margin: 8px 0;
    }
  }
}
</style>
