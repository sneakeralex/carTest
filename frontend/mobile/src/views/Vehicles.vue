<template>
  <div class="vehicles-container">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索车牌号或品牌型号"
      shape="round"
      background="#f7f8fa"
      @search="onSearch"
    />
    
    <!-- 车辆列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-if="filteredVehicles.length > 0">
          <van-cell 
            v-for="vehicle in filteredVehicles" 
            :key="vehicle.id"
            :title="vehicle.brand + ' ' + vehicle.model"
            :label="'车牌: ' + vehicle.licensePlate"
            is-link
            :to="`/vehicles/${vehicle.id}`"
          >
            <template #icon>
              <van-image
                width="50"
                height="50"
                fit="cover"
                :src="getVehicleImage(vehicle)"
                class="vehicle-image"
              />
            </template>
            <template #right-icon>
              <van-tag plain :type="getStatusTagType(vehicle.status)">
                {{ getStatusText(vehicle.status) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无车辆信息" />
      </van-list>
    </van-pull-refresh>
    
    <!-- 添加车辆按钮 -->
    <van-button
      type="primary"
      icon="plus"
      class="add-button"
      round
      @click="showAddVehiclePopup"
    >
      添加车辆
    </van-button>
    
    <!-- 添加车辆弹出层 -->
    <van-popup
      v-model:show="showAddPopup"
      position="bottom"
      round
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-title">添加车辆</div>
      <van-form @submit="onSubmitVehicle">
        <van-cell-group inset>
          <van-field
            v-model="vehicleForm.licensePlate"
            name="licensePlate"
            label="车牌号"
            placeholder="请输入车牌号"
            :rules="[{ required: true, message: '请输入车牌号' }]"
          />
          <van-field
            v-model="vehicleForm.brand"
            name="brand"
            label="品牌"
            placeholder="请输入品牌"
            :rules="[{ required: true, message: '请输入品牌' }]"
          />
          <van-field
            v-model="vehicleForm.model"
            name="model"
            label="型号"
            placeholder="请输入型号"
            :rules="[{ required: true, message: '请输入型号' }]"
          />
          <van-field
            v-model="vehicleForm.year"
            name="year"
            label="年份"
            placeholder="请输入年份"
            type="digit"
            :rules="[{ required: true, message: '请输入年份' }]"
          />
          <van-field
            v-model="vehicleForm.mileage"
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
            :model-value="vehicleForm.vehicleTypeName"
            placeholder="请选择车辆类型"
            @click="showVehicleTypePicker = true"
            :rules="[{ required: true, message: '请选择车辆类型' }]"
          />
        </van-cell-group>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            提交
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
        :default-index="0"
        show-toolbar
        title="选择车辆类型"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { showNotify } from 'vant';
import { useVehicleStore } from '../stores/vehicle';

const vehicleStore = useVehicleStore();

// 搜索相关
const searchText = ref('');
const onSearch = () => {
  // 搜索逻辑在计算属性中处理
};

// 列表相关
const loading = ref(false);
const finished = ref(true); // 由于我们一次性加载所有数据，所以设置为true
const refreshing = ref(false);

// 车辆数据
const vehicles = ref([]);

// 过滤后的车辆列表
const filteredVehicles = computed(() => {
  if (!searchText.value) return vehicles.value;
  
  const keyword = searchText.value.toLowerCase();
  return vehicles.value.filter(vehicle => {
    return vehicle.licensePlate.toLowerCase().includes(keyword) ||
           vehicle.brand.toLowerCase().includes(keyword) ||
           vehicle.model.toLowerCase().includes(keyword);
  });
});

// 添加车辆相关
const showAddPopup = ref(false);
const submitting = ref(false);
const vehicleForm = ref({
  licensePlate: '',
  brand: '',
  model: '',
  year: '',
  mileage: '',
  vehicleTypeId: '',
  vehicleTypeName: ''
});

// 车辆类型选择器
const showVehicleTypePicker = ref(false);
const vehicleTypes = ref([]);
const vehicleTypeColumns = computed(() => {
  return vehicleTypes.value.map(type => ({
    text: type.name,
    value: type.id
  }));
});

// 获取数据
onMounted(async () => {
  try {
    // 获取车辆列表
    await fetchVehicles();
    
    // 获取车辆类型列表
    await fetchVehicleTypes();
  } catch (error) {
    console.error('获取数据失败:', error);
    showNotify({ type: 'danger', message: '获取数据失败' });
  }
});

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    const data = await vehicleStore.fetchVehicles();
    vehicles.value = data || [];
  } catch (error) {
    console.error('获取车辆列表失败:', error);
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

// 下拉刷新
const onRefresh = async () => {
  try {
    await fetchVehicles();
    showNotify({ type: 'success', message: '刷新成功' });
  } catch (error) {
    showNotify({ type: 'danger', message: '刷新失败' });
  } finally {
    refreshing.value = false;
  }
};

// 加载更多
const onLoad = () => {
  // 由于我们一次性加载所有数据，所以直接设置loading为false
  loading.value = false;
};

// 显示添加车辆弹窗
const showAddVehiclePopup = () => {
  // 重置表单
  vehicleForm.value = {
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    mileage: '',
    vehicleTypeId: '',
    vehicleTypeName: ''
  };
  showAddPopup.value = true;
};

// 车辆类型确认
const onVehicleTypeConfirm = (value) => {
  vehicleForm.value.vehicleTypeId = value.value;
  vehicleForm.value.vehicleTypeName = value.text;
  showVehicleTypePicker.value = false;
};

// 提交车辆表单
const onSubmitVehicle = async () => {
  submitting.value = true;
  
  try {
    // 转换数据类型
    const vehicleData = {
      ...vehicleForm.value,
      year: parseInt(vehicleForm.value.year),
      mileage: parseInt(vehicleForm.value.mileage),
      vehicleTypeId: parseInt(vehicleForm.value.vehicleTypeId)
    };
    
    await vehicleStore.createVehicle(vehicleData);
    showNotify({ type: 'success', message: '添加车辆成功' });
    showAddPopup.value = false;
    
    // 刷新车辆列表
    await fetchVehicles();
  } catch (error) {
    showNotify({ type: 'danger', message: '添加车辆失败: ' + error });
  } finally {
    submitting.value = false;
  }
};

// 获取车辆图片
const getVehicleImage = (vehicle) => {
  // 这里可以根据车型返回不同的图片
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg';
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
.vehicles-container {
  padding-bottom: 80px;
}

.vehicle-image {
  margin-right: 8px;
  border-radius: 4px;
}

.add-button {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 10;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
}
</style>