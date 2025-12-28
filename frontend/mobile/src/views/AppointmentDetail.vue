<template>
  <div class="appointment-detail-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="预约详情"
      left-arrow
      @click-left="router.back()"
      fixed
    >
      <template #right>
        <van-icon 
          name="edit" 
          size="18" 
          @click="showEditPopup = true" 
          v-if="canEdit"
        />
      </template>
    </van-nav-bar>
    
    <div class="content" v-if="appointment">
      <!-- 加载状态 -->
      <van-loading v-if="loading" size="24px" vertical>加载中...</van-loading>
      
      <!-- 预约信息卡片 -->
      <van-cell-group inset class="info-card">
        <van-cell title="服务类型" :value="appointment.serviceType" />
        <van-cell title="预约时间" :value="formatDateTime(appointment.appointmentTime)" />
        <van-cell title="状态">
          <template #default>
            <van-tag :type="getStatusTagType(appointment.status)" plain>
              {{ getStatusText(appointment.status) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="车辆" :value="vehicleInfo" />
        <van-cell title="服务描述" v-if="appointment.description">
          <template #default>
            <div class="description">{{ appointment.description }}</div>
          </template>
        </van-cell>
        <van-cell title="备注" v-if="appointment.notes">
          <template #default>
            <div class="notes">{{ appointment.notes }}</div>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <!-- 管理员审批操作 -->
        <template v-if="isAdmin && appointment.status === 0">
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
        <template v-if="canOperation">
          <!-- 待处理状态可以取消 -->
          <van-button 
            v-if="appointment.status === 0"
            type="danger" 
            block 
            @click="showCancelPopup = true"
            :loading="submitting"
          >
            取消预约
          </van-button>
          
          <!-- 已确认状态可以查看维修记录 -->
          <van-button 
            v-if="appointment.status === 2"
            type="primary" 
            block 
            @click="goToMaintenance"
          >
            查看维修记录
          </van-button>
        </template>
      </div>
    </div>
    
    <van-empty v-else description="未找到预约信息" />
    
    <!-- 编辑预约弹窗 -->
    <van-popup
      v-model:show="showEditPopup"
      position="bottom"
      round
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-title">编辑预约</div>
      <van-form @submit="onSubmitEdit">
        <van-cell-group inset>
          <van-field
            v-model="editForm.serviceType"
            name="serviceType"
            label="服务类型"
            placeholder="请选择服务类型"
            readonly
            is-link
            @click="showServiceTypePopup = true"
            :rules="[{ required: true, message: '请选择服务类型' }]"
          />
          
          <van-field
            v-model="editForm.appointmentTime"
            name="appointmentTime"
            label="预约时间"
            placeholder="请选择预约时间"
            readonly
            is-link
            @click="showDatetimePicker = true"
            :rules="[{ required: true, message: '请选择预约时间' }]"
          />
          
          <van-field
            v-model="editForm.vehicleId"
            name="vehicleId"
            label="车辆"
            placeholder="请选择车辆"
            readonly
            is-link
            @click="showVehiclePopup = true"
            :rules="[{ required: true, message: '请选择车辆' }]"
          />
          
          <van-field
            v-model="editForm.description"
            name="description"
            label="服务描述"
            type="textarea"
            placeholder="请输入服务描述"
            rows="2"
            autosize
          />
          
          <van-field
            v-model="editForm.notes"
            name="notes"
            label="备注"
            type="textarea"
            placeholder="请输入备注信息"
            rows="2"
            autosize
          />
        </van-cell-group>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 服务类型选择弹窗 -->
    <van-popup
      v-model:show="showServiceTypePopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择服务类型"
        :columns="serviceTypeOptions"
        @confirm="onServiceTypeConfirm"
        @cancel="showServiceTypePopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 日期选择器 -->
    <van-popup
      v-model:show="showDatetimePicker"
      position="bottom"
      round
    >
      <van-date-picker
        v-model="selectedDate"
        title="选择预约日期"
        :min-date="minDate"
        @confirm="onDateConfirm"
        @cancel="showDatetimePicker = false"
      />
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup
      v-model:show="showTimePicker"
      position="bottom"
      round
    >
      <van-time-picker
        v-model="selectedTime"
        title="选择预约时间"
        :min-hour="9"
        :max-hour="17"
        :columns-type="['hour', 'minute']"
        :formatter="(type, option) => option.toString()"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
    
    <!-- 车辆选择弹窗 -->
    <van-popup
      v-model:show="showVehiclePopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择车辆"
        :columns="vehicleOptions"
        @confirm="onVehicleConfirm"
        @cancel="showVehiclePopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 取消预约确认弹窗 -->
    <van-dialog
      v-model:show="showCancelPopup"
      title="取消预约"
      show-cancel-button
      @confirm="cancelAppointment"
    >
      <div class="cancel-dialog-content">
        确定要取消此预约吗？取消后将无法恢复。
      </div>
    </van-dialog>

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
            v-model="rescheduleForm.appointmentTime"
            name="appointmentTime"
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
        :formatter="(type, option) => option.toString()"
        @confirm="onRescheduleTimeConfirm"
        @cancel="showRescheduleTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useAppointmentStore } from '../stores/appointment';
import { useVehicleStore } from '../stores/vehicle';
import { getUserInfo } from '../utils/auth.js';

const route = useRoute();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const vehicleStore = useVehicleStore();

// 状态变量
const loading = ref(true);
const appointment = ref(null);
const vehicles = ref([]);
const submitting = ref(false);
const approvalRemarks = ref('');

// 获取用户信息
const userInfo = computed(() => {
  return getUserInfo();
});

// 判断是否为管理员
const isAdmin = computed(() => {
  return userInfo.value.username === 'admin';
});

// 判断是否可以操作
const canOperation = computed(() => {
  if (!appointment.value || !userInfo.value?.userId) return false;
  return appointment.value.userId === userInfo.value.userId;
});

// 弹窗控制
const showEditPopup = ref(false);
const showServiceTypePopup = ref(false);
const showDatetimePicker = ref(false);
const showTimePicker = ref(false);
const showVehiclePopup = ref(false);
const showCancelPopup = ref(false);
const showReschedulePopup = ref(false);
const showRescheduleDatePicker = ref(false);
const showRescheduleTimePicker = ref(false);

// 编辑表单
const editForm = ref({
  serviceType: '',
  appointmentTime: '',
  vehicleId: '',
  description: '',
  notes: ''
});

// 改期表单
const rescheduleForm = ref({
  appointmentTime: '',
  reason: ''
});

// 日期时间选择器
const selectedDate = ref(['2025', '04', '01']); // 使用 2025 年 4 月日期
const selectedTime = ref(['9', '0']); // 无前置零兼容 van-time-picker
const selectedRescheduleDate = ref(['2025', '04', '01']); // 使用 2025 年 4 月日期
const selectedRescheduleTime = ref(['9', '0']); // 无前置零兼容 van-time-picker
const minDate = new Date();

// 服务类型选项
const serviceTypeOptions = [
  '常规保养',
  '轮胎更换',
  '机油更换',
  '刹车系统检查',
  '空调系统维护',
  '电池检查',
  '灯光系统检查',
  '综合检查'
];

// 获取预约详情
const fetchAppointmentDetail = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    const data = await appointmentStore.fetchAppointmentById(id);
    appointment.value = data;
    
    // 初始化编辑表单
    if (data) {
      editForm.value = {
        serviceType: data.serviceType,
        appointmentTime: formatDateTime(data.appointmentTime),
        vehicleId: data.vehicleId,
        description: data.description || '',
        notes: data.notes || ''
      };
      const appointmentDate = new Date(data.appointmentTime);
      selectedDate.value = [
        appointmentDate.getFullYear().toString(),
        (appointmentDate.getMonth() + 1).toString(),
        appointmentDate.getDate().toString()
      ];
      selectedTime.value = [
        appointmentDate.getHours().toString(),
        appointmentDate.getMinutes().toString()
      ];
    }
  } catch (error) {
    console.error('获取预约详情失败:', error);
    showNotify({ type: 'danger', message: '获取预约详情失败' });
  } finally {
    loading.value = false;
  }
};

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    const data = await vehicleStore.fetchVehicles();
    vehicles.value = data || [];
  } catch (error) {
    console.error('获取车辆列表失败:', error);
  }
};

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchAppointmentDetail(), fetchVehicles()]);
});

// 计算属性
const vehicleInfo = computed(() => {
  if (!appointment.value || !vehicles.value.length) return '';
  
  const vehicle = vehicles.value.find(v => v.id === appointment.value.vehicleId);
  if (vehicle) {
    return `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
  }
  return '';
});

const vehicleOptions = computed(() => {
  return vehicles.value.map(vehicle => ({
    text: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    value: vehicle.id
  }));
});

const canEdit = computed(() => {
  return appointment.value && 
         (appointment.value.status === 'PENDING' || 
          appointment.value.status === 'CONFIRMED');
});

// 方法
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const getStatusTagType = (status) => {
  const typeMap = {
    0: 'warning',   // 待处理
    1: 'primary',   // 已确认
    2: 'success',   // 已完成
    3: 'danger',    // 已取消
    4: 'warning'    // 已改期
  };
  return typeMap[status] || 'default';
};

const getStatusText = (status) => {
  const statusMap = {
    0: '待处理',
    1: '已确认',
    2: '已完成',
    3: '已取消',
    4: '已改期'
  };
  return statusMap[status] || '未知状态';
};

// 过滤可选时间（工作时间 9:00-18:00）
const filterTime = (type, options) => {
  if (type === 'hour') {
    return options.filter(option => option >= 9 && option <= 17);
  }
  return options;
};

// 服务类型确认
const onServiceTypeConfirm = (value) => {
  editForm.value.serviceType = value;
  showServiceTypePopup.value = false;
};

// 日期确认
const onDateConfirm = ({ selectedValues }) => {
  // 不需要手动赋值，v-model 会自动更新 selectedDate
  // selectedDate.value = selectedValues; // 这行导致递归更新
  showDatetimePicker.value = false;
  showTimePicker.value = true; // 选择完日期后显示时间选择器
};

// 时间确认
const onTimeConfirm = (value) => {
  selectedTime.value = value;
  showTimePicker.value = false;

  // 组合日期和时间
  const dateObj = new Date(
    parseInt(selectedDate.value[0]),
    parseInt(selectedDate.value[1]) - 1,
    parseInt(selectedDate.value[2]),
    parseInt(value[0]),
    parseInt(value[1])
  );

  editForm.value.appointmentTime = formatDateTime(dateObj);
};

// 车辆确认
const onVehicleConfirm = (value) => {
  editForm.value.vehicleId = value.value;
  showVehiclePopup.value = false;
};

// 提交编辑
const onSubmitEdit = async () => {
  try {
    submitting.value = true;
    
    // 组合日期和时间创建完整的日期时间对象
    const appointmentDateTime = new Date(
      parseInt(selectedDate.value[0]),
      parseInt(selectedDate.value[1]) - 1,
      parseInt(selectedDate.value[2]),
      parseInt(selectedTime.value[0]),
      parseInt(selectedTime.value[1])
    );

    const updatedAppointment = {
      id: appointment.value.id,
      serviceType: editForm.value.serviceType,
      appointmentTime: appointmentDateTime.toISOString(),
      vehicleId: editForm.value.vehicleId,
      description: editForm.value.description,
      notes: editForm.value.notes,
      status: appointment.value.status
    };
    
    await appointmentStore.updateAppointment(updatedAppointment);
    showToast('预约更新成功');
    showEditPopup.value = false;
    await fetchAppointmentDetail();
  } catch (error) {
    console.error('更新预约失败:', error);
    showNotify({ type: 'danger', message: '更新预约失败' });
  } finally {
    submitting.value = false;
  }
};

// 取消预约
const cancelAppointment = async () => {
  try {
    await appointmentStore.cancelAppointment(appointment.value.id);
    showToast('预约已取消');
    await fetchAppointmentDetail();
  } catch (error) {
    console.error('取消预约失败:', error);
    showNotify({ type: 'danger', message: '取消预约失败' });
  }
};

// 跳转到维修记录
const goToMaintenance = () => {
  if (appointment.value && appointment.value.maintenanceId) {
    router.push(`/maintenance/${appointment.value.maintenanceId}`);
  } else {
    showToast('没有关联的维修记录');
  }
};

// 改期日期确认
const onRescheduleDateConfirm = ({ selectedValues }) => {
  // 不需要手动赋值，v-model 会自动更新 selectedRescheduleDate
  // selectedRescheduleDate.value = selectedValues; // 这行导致递归更新
  showRescheduleDatePicker.value = false;
  showRescheduleTimePicker.value = true;
};

// 改期时间确认
const onRescheduleTimeConfirm = (value) => {
  selectedRescheduleTime.value = value;
  showRescheduleTimePicker.value = false;

  // 组合日期和时间
  const dateObj = new Date(
    parseInt(selectedRescheduleDate.value[0]),
    parseInt(selectedRescheduleDate.value[1]) - 1,
    parseInt(selectedRescheduleDate.value[2]),
    parseInt(value[0]),
    parseInt(value[1])
  );

  rescheduleForm.value.appointmentTime = formatDateTime(dateObj);
};

// 提交改期建议
const onSubmitReschedule = async () => {
  try {
    submitting.value = true;

    const rescheduleData = {
      id: appointment.value.id,
      appointmentTime: rescheduleForm.value.appointmentTime,
      reason: rescheduleForm.value.reason
    };

    await appointmentStore.rescheduleAppointment(rescheduleData);
    showToast('改期建议提交成功');
    showReschedulePopup.value = false;
    await fetchAppointmentDetail();
  } catch (error) {
    console.error('提交改期建议失败:', error);
    showNotify({ type: 'danger', message: '提交改期建议失败' });
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
      message: approved ? '确定要批准此预约吗？' : '确定要拒绝此预约吗？',
      showCancelButton: true
    });

    submitting.value = true;
    await appointmentStore.approveAppointment(
      appointment.value.id, 
      {
        status: approved ? 1 : 3, // 1-已确认, 3-已取消
        approvalRemarks: approvalRemarks.value,
        approverId: userInfo.value?.userId,
        approverName: userInfo.value?.username
      }
    );

    showToast({
      type: 'success',
      message: approved ? '已批准预约' : '已拒绝预约'
    });

    // 重新获取详情
    await fetchAppointmentDetail();
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
</script>

<style lang="less" scoped>
.appointment-detail-container {
  padding-top: 46px;
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}

.info-card {
  margin-bottom: 20px;
}

.description, .notes {
  white-space: pre-wrap;
  word-break: break-word;
}

.action-buttons {
  margin: 16px;
  
  .van-button {
    margin-top: 12px;
  }

  .approval-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
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

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}

.cancel-dialog-content {
  padding: 20px 16px;
  text-align: center;
}
</style>