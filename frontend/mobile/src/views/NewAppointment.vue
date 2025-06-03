<template>
  <div class="new-appointment-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="新增预约"
      left-arrow
      @click-left="router.back()"
      fixed
    />
    
    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.serviceType"
            name="serviceType"
            label="服务类型"
            placeholder="请选择服务类型"
            readonly
            is-link
            @click="showServiceTypePopup = true"
            :rules="[{ required: true, message: '请选择服务类型' }]"
          />
          
          <van-field
            v-model="form.appointmentTime"
            name="appointmentTime"
            label="预约时间"
            placeholder="请选择预约时间"
            readonly
            is-link
            @click="showDatetimePicker = true"
            :rules="[{ required: true, message: '请选择预约时间' }]"
          />
          
          <van-field
            v-model="form.vehicleId"
            name="vehicleId"
            label="车辆"
            placeholder="请选择车辆"
            readonly
            is-link
            @click="showVehiclePopup = true"
            :rules="[{ required: true, message: '请选择车辆' }]"
          />
          
          <van-field
            v-model="form.description"
            name="description"
            label="服务描述"
            type="textarea"
            placeholder="请输入服务描述"
            rows="2"
            autosize
          />
          
          <van-field
            v-model="form.notes"
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
            提交预约
          </van-button>
        </div>
      </van-form>
      
      <!-- 可用时间段提示 -->
      <van-cell-group inset title="可用时间段" v-if="availableTimeSlots.length > 0">
        <van-cell v-for="(slot, index) in availableTimeSlots" :key="index" :title="formatDateTime(slot)" @click="selectTimeSlot(slot)" is-link />
      </van-cell-group>
    </div>
    
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useAppointmentStore } from '../stores/appointment';
import { useVehicleStore } from '../stores/vehicle';

const router = useRouter();
const appointmentStore = useAppointmentStore();
const vehicleStore = useVehicleStore();

// 状态变量
const vehicles = ref([]);
const availableTimeSlots = ref([]);
const submitting = ref(false);

// 弹窗控制
const showServiceTypePopup = ref(false);
const showDatetimePicker = ref(false);
const showVehiclePopup = ref(false);

// 表单数据
const form = ref({
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

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    const data = await vehicleStore.fetchVehicles();
    vehicles.value = data || [];
  } catch (error) {
    console.error('获取车辆列表失败:', error);
    showNotify({ type: 'danger', message: '获取车辆列表失败' });
  }
};

// 获取可用时间段
const fetchAvailableTimeSlots = async (date) => {
  try {
    // 这里应该调用API获取可用时间段，但由于我们没有实际的后端，所以模拟一些数据
    // const data = await appointmentStore.fetchAvailableTimeSlots(date);
    // availableTimeSlots.value = data || [];
    
    // 模拟数据
    const baseDate = new Date(date);
    baseDate.setHours(9, 0, 0, 0);
    
    const slots = [];
    for (let i = 0; i < 8; i++) {
      const slotTime = new Date(baseDate);
      slotTime.setHours(9 + i, 0, 0, 0);
      slots.push(slotTime.toISOString());
    }
    
    availableTimeSlots.value = slots;
  } catch (error) {
    console.error('获取可用时间段失败:', error);
  }
};

// 初始化数据
onMounted(async () => {
  await fetchVehicles();
  
  // 获取今天的可用时间段
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await fetchAvailableTimeSlots(today);
});

// 计算属性
const vehicleOptions = computed(() => {
  return vehicles.value.map(vehicle => ({
    text: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    value: vehicle.id
  }));
});

// 方法
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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
  form.value.serviceType = value;
  showServiceTypePopup.value = false;
};

// 日期时间确认
const onDateTimeConfirm = (value) => {
  selectedDateTime.value = value;
  form.value.appointmentTime = formatDateTime(value);
  showDatetimePicker.value = false;
  
  // 获取选择日期的可用时间段
  const selectedDate = new Date(value);
  selectedDate.setHours(0, 0, 0, 0);
  fetchAvailableTimeSlots(selectedDate);
};

// 车辆确认
const onVehicleConfirm = (value) => {
  form.value.vehicleId = value.value;
  showVehiclePopup.value = false;
};

// 选择时间段
const selectTimeSlot = (slot) => {
  selectedDateTime.value = new Date(slot);
  form.value.appointmentTime = formatDateTime(slot);
};

// 提交表单
const onSubmit = async () => {
  try {
    submitting.value = true;
    
    const newAppointment = {
      serviceType: form.value.serviceType,
      appointmentTime: selectedDateTime.value.toISOString(),
      vehicleId: form.value.vehicleId,
      description: form.value.description,
      notes: form.value.notes,
      status: 'PENDING' // 新预约默认为待处理状态
    };
    
    await appointmentStore.createAppointment(newAppointment);
    showToast('预约创建成功');
    router.push('/appointments');
  } catch (error) {
    console.error('创建预约失败:', error);
    showNotify({ type: 'danger', message: '创建预约失败' });
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="less" scoped>
.new-appointment-container {
  padding-top: 46px;
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}
</style>