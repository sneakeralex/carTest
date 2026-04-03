<template>
  <div class="booking-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="预约详情"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 预约详情内容 -->
    <template v-if="booking">
      <!-- 预约状态 -->
      <van-cell-group inset title="预约状态" class="status-group">
        <van-cell title="当前状态">
          <template #value>
            <van-tag :type="getStatusType(booking.status)" size="large">
              {{ getStatusText(booking.status) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="预约编号" :value="booking.bookingNo || '无'" />
        <van-cell title="预约时间">
          <template #value>
            <div class="datetime-range">
              <div>{{ formatBookingDateTime('start') }}</div>
              <div>{{ formatBookingDateTime('end') }}</div>
            </div>
          </template>
        </van-cell>
        <van-cell title="调度状态" :value="booking.schedulingStatus || '无'" />
        <van-cell title="创建时间" :value="booking.createTime || formatDateTime(booking.createdAt)" />
        <van-cell title="更新时间" :value="booking.updateTime || formatDateTime(booking.updatedAt)" />
      </van-cell-group>

      <!-- 车辆信息 -->
      <van-cell-group inset title="车辆信息" v-if="booking.vehicle || booking.vinName">
        <van-cell
          :title="booking.vehicle?.licensePlate || '车辆信息'"
          is-link
          @click="booking.vehicle && goToVehicle(booking.vehicle.id)"
          v-if="booking.vehicle"
        >
          <template #value>
            <div class="vehicle-info">
              {{ booking.vehicle.brand }} {{ booking.vehicle.model }}
            </div>
          </template>
        </van-cell>
        <van-cell title="VIN码" :value="booking.vin || booking.vinName || '无'" />
      </van-cell-group>

      <!-- 项目信息 -->
      <van-cell-group inset title="项目信息">
        <van-cell title="项目号" :value="booking.projectNo || '无'" />
        <van-cell title="合同编号" :value="booking.contractNo || '无'" />
        <van-cell title="委托编号" :value="booking.entrustNo || '无'" />
        <van-cell title="任务单号" :value="booking.taskNo || '无'" />
        <van-cell title="试验类型" :value="booking.testTypeName || '无'" />
        <van-cell title="试验内容" :value="booking.testContent || '无'" />
      </van-cell-group>

      <!-- 场地信息 -->
      <van-cell-group inset title="场地信息">
        <van-cell title="试验场" :value="booking.provingGroundName || '无'" />
        <van-cell title="场地" :value="booking.groundName || '无'" />
      </van-cell-group>

      <!-- 人员信息 -->
      <van-cell-group inset title="人员信息">
        <van-cell title="驾驶员" :value="booking.driverName || '无'" />
        <van-cell title="驾驶员电话" :value="booking.driverPhone || '无'" v-if="booking.driverName" />
        <van-cell title="参与人数" :value="booking.participantCount || '0人'" />
        <van-cell title="辅助车辆数" :value="booking.auxiliaryVehicleCount || '0辆'" />
      </van-cell-group>

      <!-- 费用信息 -->
      <van-cell-group inset title="费用信息">
        <van-cell title="计费类型" :value="booking.billingTypeName || '无'" />
        <van-cell title="是否包场">
          <template #value>
            <van-tag :type="booking.isExclusive === 1 ? 'success' : 'default'">
              {{ booking.isExclusive === 1 ? '是' : '否' }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 其他信息 -->
      <van-cell-group inset title="其他信息">
        <van-cell title="影像需求">
          <template #value>
            <van-tag :type="booking.imagingRequirement === 1 ? 'success' : 'default'">
              {{ booking.imagingRequirement === 1 ? '有' : '无' }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="备注信息" :value="booking.remark || booking.notes || '无'" />
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 管理员审批操作 -->
        <template v-if="isAdmin && booking.status === 'PENDING'">
          <van-field
            v-model="approvalRemarks"
            rows="2"
            type="textarea"
            placeholder="请输入审批意见"
            label="审批意见"
            :rules="[{ required: true, message: '请输入审批意见' }]"
          />
          <div class="approval-buttons">
            <van-button 
              type="success" 
              @click="handleApprove(true)"
              :loading="submitting"
            >
              批准预约
            </van-button>
            <van-button 
              type="danger" 
              @click="handleApprove(false)"
              :loading="submitting"
            >
              拒绝预约
            </van-button>
            <van-button 
              type="warning" 
              @click="showReschedulePopup = true"
              :loading="submitting"
            >
              建议改期
            </van-button>
          </div>
        </template>

        <!-- 用户操作 -->
        <template v-if="userInfo.value?.userId && booking.userId === userInfo.value?.userId">
          <van-button 
            v-if="booking.status === 'PENDING'"
            round 
            block 
            type="danger" 
            @click="showCancelConfirm"
          >
            取消预约
          </van-button>
        </template>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-else-if="loading" class="loading-container">
      <van-loading type="spinner" size="24px">加载中...</van-loading>
    </div>

    <!-- 错误状态 -->
    <van-empty 
      v-else 
      description="预约信息加载失败"
    >
      <template #image>
        <van-icon name="warning-o" size="48" />
      </template>
      <template #bottom>
        <van-button round type="primary" size="small" @click="fetchBookingDetail">
          重试
        </van-button>
      </template>
    </van-empty>

    <!-- 改期弹窗 -->
    <van-popup
      v-model:show="showReschedulePopup"
      position="bottom"
      round
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-title">建议改期</div>
      <van-form @submit="onSubmitReschedule">
        <van-cell-group inset>
          <van-field
            v-model="rescheduleForm.suggestedTime"
            name="suggestedTime"
            label="建议时间"
            placeholder="请选择建议时间"
            readonly
            is-link
            @click="showRescheduleDatePicker = true"
            :rules="[{ required: true, message: '请选择建议时间' }]"
          />
          
          <van-field
            v-model="rescheduleForm.reason"
            name="reason"
            label="改期原因"
            type="textarea"
            placeholder="请输入改期原因"
            rows="2"
            :rules="[{ required: true, message: '请输入改期原因' }]"
          />
        </van-cell-group>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            提交改期建议
          </van-button>
        </div>
      </van-form>
    </van-popup>

    <!-- 改期日期选择器 -->
    <van-popup
      v-model:show="showRescheduleDatePicker"
      position="bottom"
      round
    >
      <van-date-picker
        v-model="selectedRescheduleDate"
        title="选择建议日期"
        :min-date="minDate"
        @confirm="onRescheduleDateConfirm"
        @cancel="showRescheduleDatePicker = false"
      />
    </van-popup>

    <!-- 改期时间选择器 -->
    <van-popup
      v-model:show="showRescheduleTimePicker"
      position="bottom"
      round
    >
      <van-time-picker
        v-model="selectedRescheduleTime"
        title="选择建议时间"
        :min-hour="9"
        :max-hour="17"
        :columns-type="['hour', 'minute']"
        :formatter="(_, option) => option.toString()"
        @confirm="onRescheduleTimeConfirm"
        @cancel="showRescheduleTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showToast, showDialog } from 'vant';
import { useBookingStore } from '../stores/booking';
import { getUserInfo } from '../utils/auth.js';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

// 状态
const loading = ref(true);
const booking = ref(null);
const submitting = ref(false);
const showReschedulePopup = ref(false);
const showRescheduleDatePicker = ref(false);
const showRescheduleTimePicker = ref(false);
const selectedRescheduleDate = ref(['2025', '04', '01']); // 使用数组格式兼容 van-date-picker
const selectedRescheduleTime = ref(['9', '0']); // 使用数组格式，无前置零兼容 van-time-picker
const minDate = new Date(); // 最小日期限制
const rescheduleForm = ref({
  suggestedTime: '',
  reason: ''
});
const approvalRemarks = ref('');

// 获取用户信息
const userInfo = computed(() => getUserInfo());

// 判断是否为管理员
const isAdmin = computed(() => {
  return userInfo.value?.username === 'admin';
});

// 状态映射
const statusMap = {
  'PENDING': { text: '待审批', type: 'warning' },
  'CONFIRMED': { text: '已确认', type: 'success' },
  'COMPLETED': { text: '已完成', type: 'primary' },
  'CANCELLED': { text: '已取消', type: 'danger' },
  'RESCHEDULED': { text: '已改期', type: 'warning' },
  // 支持数字状态值
  0: { text: '待审批', type: 'warning' },    // PENDING
  1: { text: '已确认', type: 'success' },    // CONFIRMED  
  2: { text: '已完成', type: 'primary' },    // COMPLETED
  3: { text: '已改期', type: 'warning' },    // RESCHEDULED
  4: { text: '已取消', type: 'danger' }     // CANCELLED
};

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  // 如果是完整的日期时间对象或字符串
  if (dateTime.toString().length > 10) {
    const parsed = dayjs(dateTime);
    if (parsed.isValid()) {
      return parsed.format('YYYY-MM-DD HH:mm');
    }
  }
  
  // 如果只有时间，需要结合日期
  if (dateTime.toString().includes(':')) {
    // 如果只是时间格式如 "09:00"
    const timeRegex = /^\d{1,2}:\d{2}$/;
    if (timeRegex.test(dateTime.toString())) {
      return `${dayjs().format('YYYY-MM-DD')} ${dateTime.toString().padStart(5, '0')}`;
    }
  }
  
  return dateTime.toString();
};

// 格式化预约时间
const formatBookingDateTime = (type) => {
  if (!booking.value) return '';
  
  const data = booking.value;
  
  if (type === 'start') {
    // 优先使用完整的日期时间，其次使用组合方式
    if (data.startTime && dayjs(data.startTime).isValid()) {
      return dayjs(data.startTime).format('YYYY-MM-DD HH:mm');
    }
    // 如果有预约日期和开始时间
    if (data.bookingDate && data.startTime) {
      return `${data.bookingDate} ${data.startTime}`;
    }
    // 如果只有开始时间
    if (data.startTime) {
      return data.startTime;
    }
    return '未设置开始时间';
  }
  
  if (type === 'end') {
    // 优先使用完整的日期时间，其次使用组合方式
    if (data.endTime && dayjs(data.endTime).isValid()) {
      return dayjs(data.endTime).format('YYYY-MM-DD HH:mm');
    }
    // 如果有预约日期和结束时间
    if (data.bookingDate && data.endTime) {
      return `${data.bookingDate} ${data.endTime}`;
    }
    // 如果只有结束时间
    if (data.endTime) {
      return data.endTime;
    }
    return '未设置结束时间';
  }
  
  return '';
};

// 获取状态文本
const getStatusText = (status) => {
  // 处理数字状态值
  const statusStr = status !== undefined && status !== null ? status.toString() : status;
  return statusMap[statusStr]?.text || statusMap[status]?.text || statusStr || status;
};

// 获取状态类型
const getStatusType = (status) => {
  // 处理数字状态值
  const statusStr = status !== undefined && status !== null ? status.toString() : status;
  return statusMap[statusStr]?.type || statusMap[status]?.type || 'default';
};

// 跳转到车辆详情
const goToVehicle = (vehicleId) => {
  router.push(`/vehicles/${vehicleId}`);
};

// 显示取消确认对话框
const showCancelConfirm = () => {
  showDialog({
    title: '取消预约',
    message: '确定要取消这个预约吗？',
    showCancelButton: true
  }).then(() => {
    cancelBooking();
  });
};

// 取消预约
const cancelBooking = async () => {
  try {
    await bookingStore.cancelBookingById(route.params.id);
    showToast({ type: 'success', message: '预约已取消' });
    fetchBookingDetail();
  } catch (error) {
    showToast({ type: 'fail', message: error.message || '取消预约失败' });
  }
};

// 获取预约详情
const fetchBookingDetail = async () => {
  loading.value = true;
  try {
    const data = await bookingStore.fetchBookingById(route.params.id);
    booking.value = data;
  } catch (error) {
    showToast({ type: 'fail', message: '获取预约详情失败' });
  } finally {
    loading.value = false;
  }
};

// 处理审批
const handleApprove = async (approved) => {
  if (!approvalRemarks.value) {
    showToast('请输入审批意见');
    return;
  }

  try {
    await showDialog({
      title: approved ? '确认批准' : '确认拒绝',
      message: approved ? '确定要批准此预约吗？' : '确定要拒绝此预约吗？',
      showCancelButton: true
    });

    submitting.value = true;
    await bookingStore.approveBooking(booking.value.id, {
      status: approved ? 'CONFIRMED' : 'CANCELLED',
      approvalRemarks: approvalRemarks.value,
      approverId: userInfo.value?.userId,
      approverName: userInfo.value?.username
    });

    showToast({
      type: 'success',
      message: approved ? '已批准预约' : '已拒绝预约'
    });
    await fetchBookingDetail();
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '审批失败'
    });
  } finally {
    submitting.value = false;
  }
};

// 改期日期确认
const onRescheduleDateConfirm = () => {
  // 不需要手动赋值，v-model 会自动更新 selectedRescheduleDate
  showRescheduleDatePicker.value = false;
  showRescheduleTimePicker.value = true;
};

// 改期时间确认
const onRescheduleTimeConfirm = (value) => {
  selectedRescheduleTime.value = value;
  // value 是数组格式 ['9', '0'] 或 ['14', '30']，无前置零
  const dateStr = `${selectedRescheduleDate.value[0]}-${selectedRescheduleDate.value[1].padStart(2, '0')}-${selectedRescheduleDate.value[2].padStart(2, '0')}`;
  const timeStr = `${value[0].padStart(2, '0')}:${value[1].padStart(2, '0')}`;
  rescheduleForm.value.suggestedTime = `${dateStr} ${timeStr}`;
  showRescheduleTimePicker.value = false;
};

// 提交改期
const onSubmitReschedule = async () => {
  if (!rescheduleForm.value.reason) {
    showToast('请输入改期原因');
    return;
  }

  try {
    submitting.value = true;
    await bookingStore.rescheduleBooking(booking.value.id, {
      status: 'RESCHEDULED',
      suggestedTime: rescheduleForm.value.suggestedTime,
      reason: rescheduleForm.value.reason,
      approverId: userInfo.value?.userId,
      approverName: userInfo.value?.username
    });

    showToast({
      type: 'success',
      message: '已提交改期建议'
    });
    showReschedulePopup.value = false;
    await fetchBookingDetail();
  } catch (error) {
    showToast({
      type: 'fail',
      message: error.message || '提交改期建议失败'
    });
  } finally {
    submitting.value = false;
  }
};

// 初始化
onMounted(() => {
  fetchBookingDetail();
});
</script>

<style lang="less" scoped>
.booking-detail {
  padding-bottom: 20px;

  .status-group {
    margin-top: 12px;
  }

  .datetime-range {
    text-align: right;
    font-size: 14px;
    color: #666;
  }

  .vehicle-info {
    font-size: 14px;
    color: #666;
  }

  .action-buttons {
    margin: 24px 16px;

    .van-field {
      margin-bottom: 8px;
      background-color: #fff;
      border-radius: 8px;
    }

    .approval-buttons {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .van-button {
      width: 100%;
      height: 40px;
    }
  }

  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
  }

  .van-cell-group {
    margin: 12px 0;
  }

  .popup-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin: 16px 0;
  }

  // 优化详情页面样式
  .van-cell {
    &:after {
      right: 16px;
    }
    
    .van-cell__title {
      font-weight: 500;
      color: #323233;
      min-width: 80px;
    }
    
    .van-cell__value {
      text-align: right;
      color: #646566;
    }
  }

  .van-tag {
    font-size: 12px;
    padding: 2px 6px;
  }
}
</style>
