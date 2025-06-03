<template>
  <div class="maintenance-container">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索维护记录"
      shape="round"
      background="#f7f8fa"
      @search="onSearch"
    />
    
    <!-- 维护记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-if="filteredMaintenance.length > 0">
          <van-cell 
            v-for="record in filteredMaintenance" 
            :key="record.id"
            :title="record.maintenanceType"
            :label="formatDateTime(record.maintenanceDate)"
            is-link
            :to="`/maintenance/${record.id}`"
          >
            <template #right-icon>
              <van-tag :type="getStatusTagType(record.status)" plain>
                {{ getStatusText(record.status) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无维护记录" />
      </van-list>
    </van-pull-refresh>
    
    <!-- 添加维护记录按钮 -->
    <van-button
      type="primary"
      icon="plus"
      class="add-button"
      round
      @click="goToNewMaintenance"
    >
      新增维护记录
    </van-button>
    
    <!-- 筛选器 -->
    <van-action-sheet
      v-model:show="showFilter"
      title="筛选维护记录"
      close-on-click-action
    >
      <div class="filter-content">
        <div class="filter-item">
          <div class="filter-title">维护状态</div>
          <van-radio-group v-model="filterStatus" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio name="PENDING">待处理</van-radio>
            <van-radio name="IN_PROGRESS">进行中</van-radio>
            <van-radio name="COMPLETED">已完成</van-radio>
            <van-radio name="CANCELLED">已取消</van-radio>
          </van-radio-group>
        </div>
        
        <div class="filter-item">
          <div class="filter-title">车辆</div>
          <van-radio-group v-model="filterVehicleId" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio 
              v-for="vehicle in vehicles" 
              :key="vehicle.id" 
              :name="vehicle.id"
            >
              {{ vehicle.make }} {{ vehicle.model }} ({{ vehicle.licensePlate }})
            </van-radio>
          </van-radio-group>
        </div>
        
        <div class="filter-item">
          <div class="filter-title">时间范围</div>
          <van-radio-group v-model="filterTimeRange" direction="horizontal">
            <van-radio name="all">全部</van-radio>
            <van-radio name="month">近一个月</van-radio>
            <van-radio name="quarter">近三个月</van-radio>
            <van-radio name="year">近一年</van-radio>
          </van-radio-group>
        </div>
        
        <div class="filter-actions">
          <van-button type="primary" block @click="applyFilter">应用筛选</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useMaintenanceStore } from '../stores/maintenance';
import { useVehicleStore } from '../stores/vehicle';

const router = useRouter();
const maintenanceStore = useMaintenanceStore();
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

// 维护记录数据
const maintenanceRecords = ref([]);
const vehicles = ref([]);

// 筛选相关
const showFilter = ref(false);
const filterStatus = ref('');
const filterVehicleId = ref('');
const filterTimeRange = ref('all');

// 过滤后的维护记录列表
const filteredMaintenance = computed(() => {
  let result = maintenanceRecords.value;
  
  // 根据搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(record => {
      return record.maintenanceType.toLowerCase().includes(keyword) ||
             record.description?.toLowerCase().includes(keyword);
    });
  }
  
  // 根据状态筛选
  if (filterStatus.value) {
    result = result.filter(record => record.status === filterStatus.value);
  }
  
  // 根据车辆筛选
  if (filterVehicleId.value) {
    result = result.filter(record => record.vehicleId === filterVehicleId.value);
  }
  
  // 根据时间范围筛选
  if (filterTimeRange.value !== 'all') {
    const now = new Date();
    let startDate;
    
    if (filterTimeRange.value === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    } else if (filterTimeRange.value === 'quarter') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
    } else if (filterTimeRange.value === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    }
    
    if (startDate) {
      result = result.filter(record => {
        const recordDate = new Date(record.maintenanceDate);
        return recordDate >= startDate;
      });
    }
  }
  
  // 按维护日期排序（最新的在前面）
  return result.sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate));
});

// 获取数据
onMounted(async () => {
  try {
    await Promise.all([fetchMaintenanceRecords(), fetchVehicles()]);
  } catch (error) {
    console.error('获取数据失败:', error);
    showNotify({ type: 'danger', message: '获取数据失败' });
  }
});

// 获取维护记录列表
const fetchMaintenanceRecords = async () => {
  try {
    const data = await maintenanceStore.fetchMaintenanceRecords();
    maintenanceRecords.value = data || [];
  } catch (error) {
    console.error('获取维护记录失败:', error);
    throw error;
  }
};

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

// 下拉刷新
const onRefresh = async () => {
  try {
    await fetchMaintenanceRecords();
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

// 跳转到新增维护记录页面
const goToNewMaintenance = () => {
  router.push('/maintenance/new');
};

// 应用筛选
const applyFilter = () => {
  showFilter.value = false;
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'IN_PROGRESS': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};
</script>

<style lang="less" scoped>
.maintenance-container {
  padding-bottom: 80px;
}

.add-button {
  position: fixed;
  bottom: 80px;
  right: 20px;
  z-index: 10;
}

.filter-content {
  padding: 16px;
}

.filter-item {
  margin-bottom: 16px;
}

.filter-title {
  margin-bottom: 8px;
  font-weight: 600;
}

.filter-actions {
  margin-top: 24px;
}
</style>