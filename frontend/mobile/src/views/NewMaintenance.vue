<template>
  <div class="new-maintenance-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="新增维护记录"
      left-arrow
      @click-left="router.back()"
      fixed
    />
    
    <div class="content">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="form.maintenanceType"
            name="maintenanceType"
            label="维护类型"
            placeholder="请选择维护类型"
            readonly
            is-link
            @click="showMaintenanceTypePopup = true"
            :rules="[{ required: true, message: '请选择维护类型' }]"
          />
          
          <van-field
            v-model="form.maintenanceDate"
            name="maintenanceDate"
            label="维护日期"
            placeholder="请选择维护日期"
            readonly
            is-link
            @click="showDatePicker = true"
            :rules="[{ required: true, message: '请选择维护日期' }]"
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
            v-model="form.mileage"
            name="mileage"
            label="里程数"
            type="digit"
            placeholder="请输入车辆里程数"
            :rules="[{ pattern: /^\d+$/, message: '请输入有效的里程数' }]"
          >
            <template #right-icon>
              <span class="mileage-unit">公里</span>
            </template>
          </van-field>
          
          <van-field
            v-model="form.description"
            name="description"
            label="维护描述"
            type="textarea"
            placeholder="请输入维护描述"
            rows="2"
            autosize
          />
          
          <van-field
            v-model="form.technicianNotes"
            name="technicianNotes"
            label="技师备注"
            type="textarea"
            placeholder="请输入技师备注"
            rows="2"
            autosize
          />
        </van-cell-group>
        
        <!-- 维护项目编辑 -->
        <div class="items-section">
          <div class="items-header">
            <div class="items-title">维护项目</div>
            <van-button size="small" type="primary" icon="plus" @click="addMaintenanceItem">添加项目</van-button>
          </div>
          
          <van-cell-group inset v-for="(item, index) in form.items" :key="index">
            <van-field
              v-model="item.name"
              :name="`item-name-${index}`"
              label="项目名称"
              placeholder="请输入项目名称"
              :rules="[{ required: true, message: '请输入项目名称' }]"
            />
            
            <van-field
              v-model="item.description"
              :name="`item-description-${index}`"
              label="项目描述"
              placeholder="请输入项目描述"
            />
            
            <van-field
              v-model="item.price"
              :name="`item-price-${index}`"
              label="价格"
              type="digit"
              placeholder="请输入价格"
              :rules="[{ pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格' }]"
            >
              <template #right-icon>
                <span class="price-unit">¥</span>
              </template>
            </van-field>
            
            <div class="item-actions">
              <van-button size="small" type="danger" @click="removeMaintenanceItem(index)">删除</van-button>
            </div>
          </van-cell-group>
          
          <div class="empty-items" v-if="form.items.length === 0">
            <van-empty description="暂无维护项目" />
            <div class="empty-tip">点击上方"添加项目"按钮添加维护项目</div>
          </div>
        </div>
        
        <!-- 关联预约 -->
        <van-cell-group inset title="关联预约">
          <van-field
            v-model="form.appointmentId"
            name="appointmentId"
            label="关联预约"
            placeholder="请选择关联的预约（可选）"
            readonly
            is-link
            @click="showAppointmentPopup = true"
          />
        </van-cell-group>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
    
    <!-- 维护类型选择弹窗 -->
    <van-popup
      v-model:show="showMaintenanceTypePopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择维护类型"
        :columns="maintenanceTypeOptions"
        @confirm="onMaintenanceTypeConfirm"
        @cancel="showMaintenanceTypePopup = false"
        show-toolbar
      />
    </van-popup>
    
    <!-- 日期选择器 -->
    <van-popup
      v-model:show="showDatePicker"
      position="bottom"
      round
    >
      <van-date-picker
        v-model="selectedDate"
        title="选择维护日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
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
    
    <!-- 预约选择弹窗 -->
    <van-popup
      v-model:show="showAppointmentPopup"
      position="bottom"
      round
    >
      <van-picker
        title="选择关联预约"
        :columns="appointmentOptions"
        @confirm="onAppointmentConfirm"
        @cancel="showAppointmentPopup = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useMaintenanceStore } from '../stores/maintenance';
import { useVehicleStore } from '../stores/vehicle';
import { useAppointmentStore } from '../stores/appointment';

const router = useRouter();
const maintenanceStore = useMaintenanceStore();
const vehicleStore = useVehicleStore();
const appointmentStore = useAppointmentStore();

// 状态变量
const vehicles = ref([]);
const appointments = ref([]);
const submitting = ref(false);

// 弹窗控制
const showMaintenanceTypePopup = ref(false);
const showDatePicker = ref(false);
const showVehiclePopup = ref(false);
const showAppointmentPopup = ref(false);

// 表单数据
const form = ref({
  maintenanceType: '',
  maintenanceDate: '',
  vehicleId: '',
  mileage: '',
  description: '',
  technicianNotes: '',
  appointmentId: '',
  items: []
});

// 日期选择器
const selectedDate = ref(new Date());
const minDate = new Date(2000, 0, 1);
const maxDate = new Date();

// 维护类型选项
const maintenanceTypeOptions = [
  '常规保养',
  '轮胎更换',
  '机油更换',
  '刹车系统维护',
  '空调系统维护',
  '电池更换',
  '灯光系统维护',
  '发动机维修',
  '变速箱维修',
  '悬挂系统维修',
  '冷却系统维修',
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

// 获取预约列表
const fetchAppointments = async () => {
  try {
    const data = await appointmentStore.fetchAppointments();
    // 只显示已完成但未关联维护记录的预约
    appointments.value = (data || []).filter(appointment => 
      appointment.status === 'COMPLETED' && !appointment.maintenanceId
    );
  } catch (error) {
    console.error('获取预约列表失败:', error);
  }
};

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchVehicles(), fetchAppointments()]);
  
  // 如果从预约页面跳转过来，预先填充车辆和预约信息
  const appointmentId = router.currentRoute.value.query.appointmentId;
  if (appointmentId) {
    try {
      const appointmentData = await appointmentStore.fetchAppointmentDetail(appointmentId);
      if (appointmentData) {
        form.value.appointmentId = appointmentId;
        form.value.vehicleId = appointmentData.vehicleId;
        form.value.maintenanceType = appointmentData.serviceType;
      }
    } catch (error) {
      console.error('获取预约详情失败:', error);
    }
  }
});

// 计算属性
const vehicleOptions = computed(() => {
  return vehicles.value.map(vehicle => ({
    text: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    value: vehicle.id
  }));
});

const appointmentOptions = computed(() => {
  const options = appointments.value.map(appointment => ({
    text: `${appointment.serviceType} (${formatDate(appointment.appointmentTime)})`,
    value: appointment.id
  }));
  
  // 添加一个"不关联"选项
  return [
    { text: '不关联预约', value: '' },
    ...options
  ];
});

// 方法
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 维护类型确认
const onMaintenanceTypeConfirm = (value) => {
  form.value.maintenanceType = value;
  showMaintenanceTypePopup.value = false;
};

// 日期确认
const onDateConfirm = (value) => {
  selectedDate.value = value;
  form.value.maintenanceDate = formatDate(value);
  showDatePicker.value = false;
};

// 车辆确认
const onVehicleConfirm = (value) => {
  form.value.vehicleId = value.value;
  showVehiclePopup.value = false;
  
  // 更新预约选项，只显示选中车辆的预约
  fetchAppointments().then(() => {
    appointments.value = appointments.value.filter(appointment => 
      appointment.vehicleId === form.value.vehicleId
    );
  });
};

// 预约确认
const onAppointmentConfirm = (value) => {
  form.value.appointmentId = value.value;
  showAppointmentPopup.value = false;
};

// 添加维护项目
const addMaintenanceItem = () => {
  form.value.items.push({
    name: '',
    description: '',
    price: ''
  });
};

// 删除维护项目
const removeMaintenanceItem = (index) => {
  form.value.items.splice(index, 1);
};

// 提交表单
const onSubmit = async () => {
  try {
    submitting.value = true;
    
    // 处理表单数据
    const items = form.value.items.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0
    }));
    
    const newMaintenance = {
      maintenanceType: form.value.maintenanceType,
      maintenanceDate: selectedDate.value.toISOString(),
      vehicleId: form.value.vehicleId,
      mileage: form.value.mileage ? parseInt(form.value.mileage) : null,
      description: form.value.description,
      technicianNotes: form.value.technicianNotes,
      appointmentId: form.value.appointmentId || null,
      status: 'PENDING', // 新维护记录默认为待处理状态
      items: items
    };
    
    await maintenanceStore.createMaintenance(newMaintenance);
    showToast('维护记录创建成功');
    router.push('/maintenance');
  } catch (error) {
    console.error('创建维护记录失败:', error);
    showNotify({ type: 'danger', message: '创建维护记录失败' });
  } finally {
    submitting.value = false;
  }
};
</script>

<style lang="less" scoped>
.new-maintenance-container {
  padding-top: 46px;
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}

.items-section {
  margin: 16px 0;
}

.items-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  margin-bottom: 8px;
}

.items-title {
  font-size: 16px;
  font-weight: 600;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
}

.empty-items {
  padding: 16px;
}

.empty-tip {
  text-align: center;
  color: #969799;
  font-size: 14px;
  margin-top: 8px;
}

.mileage-unit, .price-unit {
  color: #969799;
}
</style>