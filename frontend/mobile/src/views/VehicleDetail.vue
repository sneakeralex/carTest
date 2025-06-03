<template>
  <div class="vehicle-detail-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="车辆详情"
      left-arrow
      @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="edit" size="18" @click="showEditPopup" />
      </template>
    </van-nav-bar>
    
    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading" size="24px" vertical>
      加载中...
    </van-loading>
    
    <template v-else-if="vehicle">
      <!-- 车辆基本信息 -->
      <div class="vehicle-header">
        <van-image
          width="100%"
          height="200"
          fit="cover"
          :src="getVehicleImage(vehicle)"
          class="vehicle-image"
        />
        <div class="vehicle-title">
          <h2>{{ vehicle.brand }} {{ vehicle.model }}</h2>
          <van-tag plain :type="getStatusTagType(vehicle.status)">
            {{ getStatusText(vehicle.status) }}
          </van-tag>
        </div>
        <div class="license-plate">{{ vehicle.licensePlate }}</div>
      </div>
      
      <!-- 车辆详细信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="车辆类型" :value="vehicle.vehicleTypeName" />
        <van-cell title="出厂年份" :value="vehicle.year + '年'" />
        <van-cell title="当前里程" :value="vehicle.mileage + 'km'" />
        <van-cell title="上次保养日期" :value="formatDate(vehicle.lastMaintenanceDate) || '暂无记录'" />
        <van-cell title="上次保养里程" :value="vehicle.lastMaintenanceMileage ? vehicle.lastMaintenanceMileage + 'km' : '暂无记录'" />
      </van-cell-group>
      
      <!-- 操作按钮组 -->
      <div class="action-buttons">
        <van-grid :column-num="3" :border="false">
          <van-grid-item icon="calendar-o" text="预约服务" @click="goToAppointment" />
          <van-grid-item icon="setting-o" text="维修保养" @click="goToMaintenance" />
          <van-grid-item icon="delete-o" text="删除车辆" @click="showDeleteConfirm" />
        </van-grid>
      </div>
      
      <!-- 维修保养记录 -->
      <div class="maintenance-history">
        <div class="section-title">维修保养记录</div>
        <van-cell-group inset v-if="maintenanceHistory.length > 0">
          <van-cell 
            v-for="record in maintenanceHistory" 
            :key="record.id"
            :title="record.maintenanceType"
            :label="formatDate(record.maintenanceDate)"
            :value="record.cost ? '¥' + record.cost : ''"
            is-link
            :to="`/maintenance/${record.id}`"
          />
        </van-cell-group>
        <van-empty v-else description="暂无维修保养记录" />
      </div>
    </template>
    
    <van-empty v-else description="未找到车辆信息" />
    
    <!-- 编辑车辆弹出层 -->
    <van-popup
      v-model:show="showEdit"
      position="bottom"
      round
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-title">编辑车辆</div>
      <van-form @submit="onSubmitEdit" v-if="vehicle">
        <van-cell-group inset>
          <van-field
            v-model="editForm.licensePlate"
            name="licensePlate"
            label="车牌号"
            placeholder="请输入车牌号"
            :rules="[{ required: true, message: '请输入车牌号' }]"
          />
          <van-field
            v-model="editForm.brand"
            name="brand"
            label="品牌"
            placeholder="请输入品牌"
            :rules="[{ required: true, message: '请输入品牌' }]"
          />
          <van-field
            v-model="editForm.model"
            name="model"
            label="型号"
            placeholder="请输入型号"
            :rules="[{ required: true, message: '请输入型号' }]"
          />
          <van-field
            v-model="editForm.year"
            name="year"
            label="年份"
            placeholder="请输入年份"
            type="digit"
            :rules="[{ required: true, message: '请输入年份' }]"
          />
          <van-field
            v-model="editForm.mileage"
            name="mileage"
            label="里程数(km)"
            placeholder="请输入里程数"
            type="digit"
            :rules="[{ required: true, message: '请输入里程数' }]"
          />
          <van-field
            readonly
            name="vehicleType"
            label="车辆类型"
            :model-value="editForm.vehicleTypeName"
            placeholder="请选择车辆类型"
            @click="showVehicleTypePicker = true"
            :rules="[{ required: true, message: '请选择车辆类型' }]"
          />
          <van-field
            readonly
            name="status"
            label="车辆状态"
            :model-value="getStatusText(editForm.status)"
            placeholder="请选择车辆状态"
            @click="showStatusPicker = true"
            :rules="[{ required: true, message: '请选择车辆状态' }]"
          />
        </van-cell-group>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
    <!-- 车辆类型选择器 -->
    <van-popup v-model:show="showVehicleTypePicker" position="bottom" round>
      <van-picker
        :columns="vehicleTypeColumns"
        @confirm="onVehicleTypeConfirm"
        @cancel="showVehicleTypePicker = false"
        show-toolbar
        title="选择车辆类型"
      />
    </van-popup>
    
    <!-- 车辆状态选择器 -->
    <van-popup v-model:show="showStatusPicker" position="bottom" round>
      <van-picker
        :columns="statusColumns"
        @confirm="onStatusConfirm"
        @cancel="showStatusPicker = false"
        show-toolbar
        title="选择车辆状态"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showDialog } from 'vant';
import { useVehicleStore } from '../stores/vehicle';

const route = useRoute();
const router = useRouter();
const vehicleStore = useVehicleStore();

// 车辆ID
const vehicleId = computed(() => route.params.id);

// 加载状态
const loading = ref(true);

// 车辆数据
const vehicle = ref(null);

// 维修保养历史记录
const maintenanceHistory = ref([]);

// 编辑相关
const showEdit = ref(false);
const submitting = ref(false);
const editForm = ref({});

// 车辆类型选择器
const showVehicleTypePicker = ref(false);
const vehicleTypes = ref([]);
const vehicleTypeColumns = computed(() => {
  return vehicleTypes.value.map(type => ({
    text: type.name,
    value: type.id
  }));
});

// 车辆状态选择器
const showStatusPicker = ref(false);
const statusColumns = [
  { text: '正常', value: 'NORMAL' },
  { text: '维修中', value: 'MAINTENANCE' },
  { text: '有故障', value: 'ISSUE' }
];

// 获取数据
onMounted(async () => {
  try {
    // 获取车辆详情
    await fetchVehicleDetail();
    
    // 获取车辆类型列表
    await fetchVehicleTypes();
    
    // 获取维修保养历史记录
    await fetchMaintenanceHistory();
  } catch (error) {
    console.error('获取数据失败:', error);
    showNotify({ type: 'danger', message: '获取数据失败' });
  } finally {
    loading.value = false;
  }
});

// 获取车辆详情
const fetchVehicleDetail = async () => {
  try {
    const data = await vehicleStore.fetchVehicleById(vehicleId.value);
    vehicle.value = data;
  } catch (error) {
    console.error('获取车辆详情失败:', error);
    throw error;
  }
};

// 获取车辆类型列表
const fetchVehicleTypes = async () => {
  try {
    // 这里假设API中有获取车辆类型的方法
    const response = await fetch('/api/vehicle-types');
    const data = await response.json();
    vehicleTypes.value = data || [];
  } catch (error) {
    console.error('获取车辆类型失败:', error);
    vehicleTypes.value = [
      { id: 1, name: '轿车' },
      { id: 2, name: 'SUV' },
      { id: 3, name: '卡车' },
      { id: 4, name: '面包车' }
    ];
  }
};

// 获取维修保养历史记录
const fetchMaintenanceHistory = async () => {
  try {
    // 这里假设API中有获取车辆维修保养历史的方法
    const response = await fetch(`/api/vehicles/${vehicleId.value}/maintenance-history`);
    const data = await response.json();
    maintenanceHistory.value = data || [];
  } catch (error) {
    console.error('获取维修保养历史失败:', error);
    // 模拟数据
    maintenanceHistory.value = [];
  }
};

// 返回上一页
const onClickLeft = () => {
  router.back();
};

// 显示编辑弹窗
const showEditPopup = () => {
  if (!vehicle.value) return;
  
  // 初始化编辑表单
  editForm.value = {
    licensePlate: vehicle.value.licensePlate,
    brand: vehicle.value.brand,
    model: vehicle.value.model,
    year: vehicle.value.year.toString(),
    mileage: vehicle.value.mileage.toString(),
    vehicleTypeId: vehicle.value.vehicleTypeId,
    vehicleTypeName: vehicle.value.vehicleTypeName,
    status: vehicle.value.status
  };
  
  showEdit.value = true;
};

// 车辆类型确认
const onVehicleTypeConfirm = (value) => {
  editForm.value.vehicleTypeId = value.value;
  editForm.value.vehicleTypeName = value.text;
  showVehicleTypePicker.value = false;
};

// 车辆状态确认
const onStatusConfirm = (value) => {
  editForm.value.status = value.value;
  showStatusPicker.value = false;
};

// 提交编辑表单
const onSubmitEdit = async () => {
  submitting.value = true;
  
  try {
    // 转换数据类型
    const vehicleData = {
      ...editForm.value,
      year: parseInt(editForm.value.year),
      mileage: parseInt(editForm.value.mileage),
      vehicleTypeId: parseInt(editForm.value.vehicleTypeId)
    };
    
    await vehicleStore.updateVehicleById(vehicleId.value, vehicleData);
    showNotify({ type: 'success', message: '更新车辆信息成功' });
    showEdit.value = false;
    
    // 刷新车辆详情
    await fetchVehicleDetail();
  } catch (error) {
    showNotify({ type: 'danger', message: '更新车辆信息失败: ' + error });
  } finally {
    submitting.value = false;
  }
};

// 跳转到预约服务
const goToAppointment = () => {
  router.push({
    path: '/appointments/new',
    query: { vehicleId: vehicleId.value }
  });
};

// 跳转到维修保养
const goToMaintenance = () => {
  router.push({
    path: '/maintenance/new',
    query: { vehicleId: vehicleId.value }
  });
};

// 显示删除确认对话框
const showDeleteConfirm = () => {
  showDialog({
    title: '删除车辆',
    message: '确定要删除该车辆吗？删除后无法恢复。',
    showCancelButton: true,
    confirmButtonText: '删除',
    confirmButtonColor: '#ee0a24',
  }).then(async () => {
    try {
      await vehicleStore.removeVehicle(vehicleId.value);
      showNotify({ type: 'success', message: '删除车辆成功' });
      router.replace('/vehicles');
    } catch (error) {
      showNotify({ type: 'danger', message: '删除车辆失败: ' + error });
    }
  }).catch(() => {
    // 取消删除
  });
};

// 获取车辆图片
const getVehicleImage = (vehicle) => {
  // 这里可以根据车型返回不同的图片
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg';
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'NORMAL': 'primary',
    'MAINTENANCE': 'warning',
    'ISSUE': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'NORMAL': '正常',
    'MAINTENANCE': '维修中',
    'ISSUE': '有故障'
  };
  return statusMap[status] || status;
};
</script>

<style lang="less" scoped>
.vehicle-detail-container {
  padding-bottom: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.vehicle-header {
  position: relative;
  margin-bottom: 16px;
  
  .vehicle-image {
    width: 100%;
  }
  
  .vehicle-title {
    position: absolute;
    bottom: 40px;
    left: 0;
    width: 100%;
    padding: 16px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h2 {
      margin: 0;
      font-size: 20px;
    }
  }
  
  .license-plate {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 8px 16px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    font-size: 16px;
    font-weight: 600;
  }
}

.action-buttons {
  margin: 16px 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  padding-left: 16px;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}
</style>