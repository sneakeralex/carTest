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
        <van-button 
          v-if="appointment.status === 'PENDING' || appointment.status === 'CONFIRMED'"
          type="danger" 
          block 
          @click="showCancelPopup = true"
        >
          取消预约
        </van-button>
        
        <van-button 
          v-if="appointment.status === 'COMPLETED'"
          type="primary" 
          block 
          @click="goToMaintenance"
        >
          查看维修记录
        </van-button>
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
    
    <!-- 日期时间选择器 -->
    <van-popup
      v-model:show="showDatetimePicker"
      position="bottom"
      round
    >
      <van-datetime-picker
        v-model="selectedDateTime"
        type="datetime"
        title="选择预约时间"
        :min-date="minDate"
        :filter="filterTime"
        @confirm="onDateTimeConfirm"
        @cancel="showDatetimePicker = false"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useAppointmentStore } from '../stores/appointment';
import { useVehicleStore } from '../stores/vehicle';

const route = useRoute();
const router = useRouter();
const appointmentStore = useAppointmentStore();
const vehicleStore = useVehicleStore();

// 状态变量
const loading = ref(true);
const appointment = ref(null);
const vehicles = ref([]);
const submitting = ref(false);

// 弹窗控制
const showEditPopup = ref(false);
const showServiceTypePopup = ref(false);
const showDatetimePicker = ref(false);
const showVehiclePopup = ref(false);
const showCancelPopup = ref(false);

// 编辑表单
const editForm = ref({
  serviceType: '',
  appointmentTime: '',
  vehicleId: '',
  description: '',
  notes: ''
});

// 日期时间选择器
const selectedDateTime = ref(new Date());
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
    const data = await appointmentStore.fetchAppointmentDetail(id);
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
      selectedDateTime.value = new Date(data.appointmentTime);
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
    'PENDING': 'warning',
    'CONFIRMED': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return typeMap[status] || 'default';
};

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
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

// 日期时间确认
const onDateTimeConfirm = (value) => {
  selectedDateTime.value = value;
  editForm.value.appointmentTime = formatDateTime(value);
  showDatetimePicker.value = false;
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
    
    const updatedAppointment = {
      id: appointment.value.id,
      serviceType: editForm.value.serviceType,
      appointmentTime: selectedDateTime.value.toISOString(),
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
  margin-top: 24px;
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