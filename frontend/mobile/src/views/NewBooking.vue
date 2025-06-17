<template>
  <div class="new-booking-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="新建预约"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 预约表单 -->
    <van-form @submit="onSubmit" class="booking-form">
      <!-- 服务类型选择 -->
      <van-cell-group inset title="服务类型">
        <van-field
          v-model="form.serviceType"
          name="serviceType"
          label="服务类型"
          placeholder="请选择服务类型"
          readonly
          is-link
          @click="showServiceTypePicker = true"
          :rules="[{ required: true, message: '请选择服务类型' }]"
        />
      </van-cell-group>

      <!-- 车辆选择 -->
      <van-cell-group inset title="车辆信息">
        <van-field
          v-model="form.vehicleInfo"
          name="vehicleInfo"
          label="选择车辆"
          placeholder="请选择车辆"
          readonly
          is-link
          @click="showVehiclePicker = true"
          :rules="[{ required: true, message: '请选择车辆' }]"
        />
      </van-cell-group>

      <!-- 预约时间 -->
      <van-cell-group inset title="预约时间">
        <van-field
          v-model="form.appointmentDate"
          name="appointmentDate"
          label="预约日期"
          placeholder="请选择预约日期"
          readonly
          is-link
          @click="showDatePicker = true"
          :rules="[{ required: true, message: '请选择预约日期' }]"
        />
        <van-field
          v-model="form.appointmentTime"
          name="appointmentTime"
          label="预约时间"
          placeholder="请选择预约时间"
          readonly
          is-link
          @click="showTimePicker = true"
          :rules="[{ required: true, message: '请选择预约时间' }]"
        />
      </van-cell-group>

      <!-- 服务地点 -->
      <van-cell-group inset title="服务地点">
        <van-field
          v-model="form.location"
          name="location"
          label="服务地点"
          placeholder="请选择或输入服务地点"
          :rules="[{ required: true, message: '请输入服务地点' }]"
        />
      </van-cell-group>

      <!-- 备注信息 -->
      <van-cell-group inset title="备注信息">
        <van-field
          v-model="form.remarks"
          name="remarks"
          label="备注"
          type="textarea"
          placeholder="请输入备注信息（可选）"
          rows="3"
          autosize
        />
      </van-cell-group>

      <!-- 提交按钮 -->
      <div class="submit-button">
        <van-button
          type="primary"
          size="large"
          block
          native-type="submit"
          :loading="submitting"
        >
          提交预约
        </van-button>
      </div>
    </van-form>

    <!-- 服务类型选择器 -->
    <van-popup v-model:show="showServiceTypePicker" position="bottom">
      <van-picker
        :columns="serviceTypeColumns"
        @confirm="onServiceTypeConfirm"
        @cancel="showServiceTypePicker = false"
      />
    </van-popup>

    <!-- 车辆选择器 -->
    <van-popup v-model:show="showVehiclePicker" position="bottom">
      <van-picker
        :columns="vehicleColumns"
        @confirm="onVehicleConfirm"
        @cancel="showVehiclePicker = false"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-datetime-picker
        v-model="selectedDate"
        type="date"
        title="选择日期"
        :min-date="minDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 时间选择器 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-datetime-picker
        v-model="selectedTime"
        type="time"
        title="选择时间"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showSuccessToast } from 'vant';

const router = useRouter();

// 响应式数据
const submitting = ref(false);
const showServiceTypePicker = ref(false);
const showVehiclePicker = ref(false);
const showDatePicker = ref(false);
const showTimePicker = ref(false);
const selectedDate = ref(new Date());
const selectedTime = ref(new Date());
const minDate = new Date();

// 表单数据
const form = reactive({
  serviceType: '',
  vehicleInfo: '',
  appointmentDate: '',
  appointmentTime: '',
  location: '',
  remarks: ''
});

// 服务类型选项
const serviceTypeColumns = [
  { text: '车辆年检', value: 'INSPECTION' },
  { text: '维修保养', value: 'MAINTENANCE' },
  { text: '测试服务', value: 'TEST' },
  { text: '咨询服务', value: 'CONSULTATION' }
];

// 车辆选项（模拟数据）
const vehicleColumns = ref([]);

// 获取用户车辆列表
const fetchUserVehicles = async () => {
  try {
    // 模拟API调用
    const mockVehicles = [
      { text: '京A12345 - 奥迪A4L', value: '1' },
      { text: '京B67890 - 宝马X3', value: '2' },
      { text: '京C11111 - 奔驰C200', value: '3' }
    ];
    vehicleColumns.value = mockVehicles;
  } catch (error) {
    console.error('获取车辆列表失败:', error);
    showToast('获取车辆列表失败');
  }
};

// 服务类型确认
const onServiceTypeConfirm = ({ selectedOptions }) => {
  form.serviceType = selectedOptions[0].text;
  showServiceTypePicker.value = false;
};

// 车辆确认
const onVehicleConfirm = ({ selectedOptions }) => {
  form.vehicleInfo = selectedOptions[0].text;
  showVehiclePicker.value = false;
};

// 日期确认
const onDateConfirm = () => {
  const date = selectedDate.value;
  form.appointmentDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  showDatePicker.value = false;
};

// 时间确认
const onTimeConfirm = () => {
  const time = selectedTime.value;
  form.appointmentTime = `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}`;
  showTimePicker.value = false;
};

// 提交表单
const onSubmit = async () => {
  try {
    submitting.value = true;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    showSuccessToast('预约提交成功');
    router.back();
  } catch (error) {
    console.error('提交预约失败:', error);
    showToast('提交预约失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 组件挂载时获取数据
onMounted(() => {
  fetchUserVehicles();
});
</script>

<style lang="less" scoped>
.new-booking-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.booking-form {
  padding-bottom: 80px;
}

.submit-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}
</style>
