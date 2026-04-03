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
        :columns-type="['year', 'month', 'day']"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
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
const showTimePicker = ref(false);
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
const DEFAULT_DATE = ['2025', '04', '01']; // 默认使用 2025 年 4 月日期，无前置零兼容 van-date-picker
const selectedDate = ref([...DEFAULT_DATE]);
const DEFAULT_TIME = ['9', '0']; // 默认时间无前置零，兼容 van-time-picker
const selectedTime = ref([...DEFAULT_TIME]);
const minDate = new Date();

// 服务类型选项
const serviceTypeOptions = [
  { text: '常规保养', value: '常规保养' },
  { text: '轮胎更换', value: '轮胎更换' },
  { text: '机油更换', value: '机油更换' },
  { text: '刹车系统检查', value: '刹车系统检查' },
  { text: '空调系统维护', value: '空调系统维护' },
  { text: '电池检查', value: '电池检查' },
  { text: '灯光系统检查', value: '灯光系统检查' },
  { text: '综合检查', value: '综合检查' }
];

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    console.log('开始获取车辆列表');
    const response = await vehicleStore.fetchVehicles();
    console.log('后端返回的原始数据:', response);
    
    // 正确处理后端返回的数据格式
    let vehicleData = [];
    if (response?.data?.content) {
      vehicleData = response.data.content;
    } else if (Array.isArray(response)) {
      vehicleData = response;
    } else if (response?.data && Array.isArray(response.data)) {
      vehicleData = response.data;
    }
    
    console.log('处理后的车辆数据:', vehicleData);
    vehicles.value = vehicleData;
  } catch (error) {
    console.error('获取车辆列表失败:', error);
    showNotify({ type: 'danger', message: '获取车辆列表失败' });
    vehicles.value = [];
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
      try {
        const slotTime = new Date(baseDate);
        slotTime.setHours(9 + i, 0, 0, 0);
        slots.push(slotTime.toISOString());
      } catch (slotErr) {
        console.error('生成时间段异常:', slotErr);
      }
    }
    
    availableTimeSlots.value = slots;
  } catch (error) {
    console.error('获取可用时间段失败:', error);
    showNotify({ type: 'danger', message: '获取可用时间段失败: ' + error });
    availableTimeSlots.value = [];
  }
};

// 初始化数据
onMounted(async () => {
  try {
    await fetchVehicles();
  } catch (err) {
    console.error('初始化获取车辆列表异常:', err);
    showNotify({ type: 'danger', message: '初始化获取车辆列表异常' });
  }
  try {
    // 获取今天的可用时间段
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await fetchAvailableTimeSlots(today);
  } catch (err) {
    console.error('初始化获取可用时间段异常:', err);
    showNotify({ type: 'danger', message: '初始化获取可用时间段异常' });
  }
});

// 计算属性
const vehicleOptions = computed(() => {
  console.log('vehicleOptions 计算时的 vehicles.value:', vehicles.value);
  if (!Array.isArray(vehicles.value)) return [];
  
  const options = vehicles.value.map(vehicle => {
    // 确保所有必要的字段都存在，使用可选链和空值合并
    const brand = vehicle?.brand ?? '';
    const model = vehicle?.model ?? '';
    const licensePlate = vehicle?.licensePlate ?? '';
    const id = vehicle?.id ?? vehicle?.vehicleId ?? '';
    
    // 生成显示文本
    const text = [brand, model, licensePlate].filter(Boolean).join(' ');
    return {
      text: text || `车辆${id}`,
      value: id
    };
  }).filter(option => option.value); // 过滤掉没有 id 的选项
  
  console.log('生成的车辆选项:', options);
  return options;
});

// 方法
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
};

// 过滤可选时间（工作时间 9:00-18:00）
const filterTime = (type, options) => {
  if (type === 'hour') {
    return options.filter(option => option >= 9 && option <= 17);
  }
  return options;
};

// 服务类型确认
const onServiceTypeConfirm = ({ selectedOptions }) => {
  if (selectedOptions && selectedOptions[0]) {
    form.value.serviceType = selectedOptions[0].value;
  }
  showServiceTypePopup.value = false;
};

// 日期确认
const onDateConfirm = async ({ selectedValues }) => {
  try {
    // Vant DatePicker columns-type: ['year','month','day']，选项值无前置零
    if (!Array.isArray(selectedValues) || selectedValues.some(v => typeof v !== 'string')) {
      showNotify({ type: 'danger', message: '日期选择器返回值异常，请重试' });
      showDatetimePicker.value = false;
      return;
    }
    // 只在值变化时才更新 selectedDate，且 fetchAvailableTimeSlots 只用局部变量，不依赖 selectedDate
    const isChanged = JSON.stringify(selectedDate.value) !== JSON.stringify(selectedValues);
    showDatetimePicker.value = false; // 优先关闭弹窗，防止递归
    if (isChanged) {
      selectedDate.value = [...selectedValues];
      await nextTick();
      // 校验并转换为数字，防止无效日期
      const year = Number(selectedValues[0]);
      const month = Number(selectedValues[1]);
      const day = Number(selectedValues[2]);
      if (!year || !month || !day) {
        showNotify({ type: 'danger', message: '请选择有效的日期' });
        return;
      }
      const dateObj = new Date(year, month - 1, day);
      if (isNaN(dateObj.getTime())) {
        showNotify({ type: 'danger', message: '日期格式错误' });
        return;
      }
      await fetchAvailableTimeSlots(dateObj);
      // 日期选择成功后弹出时间选择器
      showTimePicker.value = true;
    }
    // 如果日期未变化，不做任何操作，防止递归
  } catch (err) {
    console.error('日期选择异常:', err);
    showNotify({ type: 'danger', message: '日期选择异常，请重试' });
    showDatetimePicker.value = false;
  }
};

// 时间确认
const onTimeConfirm = (value) => {
  // Vant TimePicker columns-type: ['hour','minute']，选项值无前置零
  if (!Array.isArray(value) || value.some(v => typeof v !== 'string')) {
    showNotify({ type: 'danger', message: '时间选择器返回值异常，请重试' });
    selectedTime.value = [...DEFAULT_TIME];
    showTimePicker.value = false;
    return;
  }
  selectedTime.value = [...value];
  showTimePicker.value = false;
  // 校验并转换为数字，防止无效时间
  const year = Number(selectedDate.value[0]);
  const month = Number(selectedDate.value[1]);
  const day = Number(selectedDate.value[2]);
  const hour = Number(value[0]);
  const minute = Number(value[1]);
  if (!year || !month || !day || isNaN(hour) || isNaN(minute)) {
    showNotify({ type: 'danger', message: '请选择有效的时间' });
    return;
  }
  const dateObj = new Date(year, month - 1, day, hour, minute);
  if (isNaN(dateObj.getTime())) {
    showNotify({ type: 'danger', message: '时间格式错误' });
    return;
  }
  form.value.appointmentTime = formatDateTime(dateObj);
};

// 车辆确认
const onVehicleConfirm = ({ selectedOptions }) => {
  console.log('选择的车辆选项:', selectedOptions);
  if (selectedOptions?.[0]) {
    const selectedVehicle = selectedOptions[0];
    console.log('选中的车辆:', selectedVehicle);
    form.value.vehicleId = selectedVehicle.value;
  }
  showVehiclePopup.value = false;
};

// 选择时间段
const selectTimeSlot = (slot) => {
  const slotDate = new Date(slot);
  selectedDate.value = [
    slotDate.getFullYear().toString(),
    (slotDate.getMonth() + 1).toString(), // 无前置零
    slotDate.getDate().toString()
  ];
  selectedTime.value = [
    slotDate.getHours().toString(), // 无前置零
    slotDate.getMinutes().toString()
  ];
  form.value.appointmentTime = formatDateTime(slot);
};

// 提交表单
const onSubmit = async () => {
  try {
    submitting.value = true;
    
    // 组合日期和时间，创建完整的日期时间对象
    const appointmentDateTime = new Date(
      parseInt(selectedDate.value[0]),
      parseInt(selectedDate.value[1]) - 1,
      parseInt(selectedDate.value[2]),
      parseInt(selectedTime.value[0]),
      parseInt(selectedTime.value[1])
    );

    // 验证日期时间是否有效
    if (isNaN(appointmentDateTime.getTime())) {
      showNotify({ type: 'danger', message: '请选择有效的预约时间' });
      return;
    }

    // 验证必填字段
    if (!form.value.serviceType || !form.value.vehicleId) {
      showNotify({ type: 'danger', message: '请填写所有必填项' });
      return;
    }

    const newAppointment = {
      serviceType: form.value.serviceType,
      appointmentTime: appointmentDateTime.toISOString(),
      vehicleId: form.value.vehicleId,
      description: form.value.description || '',  // 确保空值为空字符串
      notes: form.value.notes || '',  // 确保空值为空字符串
      // status: 'PENDING'  // 新预约默认为待处理状态
    };
    
    await appointmentStore.addAppointment(newAppointment);
    showToast('预约创建成功');
    router.push('/appointments');
  } catch (error) {
    console.error('创建预约失败:', error);
    showNotify({ type: 'danger', message: '创建预约失败：' + (error.message || '未知错误') });
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