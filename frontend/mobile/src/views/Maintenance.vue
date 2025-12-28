<template>
  <div class="maintenance-container">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索设备名称、维护类型或维护人员"
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
            is-link
            :to="`/maintenance/${record.id}`"
          >
            <template #title>
              <div class="maintenance-title">
                <span class="maintenance-type">{{ record.maintenanceType }}</span>
                <van-tag :type="getStatusTagType(record.status)" plain size="mini" class="status-tag">
                  {{ getStatusText(record.status) }}
                </van-tag>
              </div>
            </template>
            
            <template #label>
              <div class="maintenance-info">
                <div class="equipment-info">
                  <span class="equipment-name">{{ record.equipment?.equipmentName || '未知设备' }}</span>
                  <span class="equipment-no">({{ record.equipment?.equipmentNo || 'N/A' }})</span>
                </div>
                <div class="maintenance-details">
                  <span class="maintenance-date">{{ formatDateTime(record.maintenanceDate) }}</span>
                  <span class="maintainer">{{ record.maintainer }}</span>
                </div>
                <div class="equipment-location" v-if="record.equipment?.location">
                  <van-icon name="location-o" size="12" />
                  <span>{{ record.equipment.location }}</span>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无维护记录" />
      </van-list>
    </van-pull-refresh>
    
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
          <div class="filter-title">设备</div>
          <van-radio-group v-model="filterEquipmentId" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio 
              v-for="equipment in availableEquipments" 
              :key="equipment.id" 
              :name="equipment.id"
            >
              {{ equipment.name }} ({{ equipment.no }})
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

const router = useRouter();
const maintenanceStore = useMaintenanceStore();

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

// 从维护记录中提取唯一的设备列表
const availableEquipments = computed(() => {
  const equipmentMap = new Map();
  
  maintenanceRecords.value.forEach(record => {
    if (record.equipment && record.equipment.equipmentId) {
      equipmentMap.set(record.equipment.equipmentId, {
        id: record.equipment.equipmentId,
        name: record.equipment.equipmentName,
        no: record.equipment.equipmentNo
      });
    }
  });
  
  return Array.from(equipmentMap.values()).sort((a, b) => a.name.localeCompare(b.name));
});

// 筛选相关
const showFilter = ref(false);
const filterStatus = ref('');
const filterEquipmentId = ref('');
const filterTimeRange = ref('all');

// 过滤后的维护记录列表
const filteredMaintenance = computed(() => {
  // 确保 maintenanceRecords.value 是数组
  let result = Array.isArray(maintenanceRecords.value) ? maintenanceRecords.value : [];
  
  // 根据搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(record => {
      return record?.maintenanceType?.toLowerCase().includes(keyword) ||
             record?.description?.toLowerCase().includes(keyword) ||
             record?.equipment?.equipmentName?.toLowerCase().includes(keyword) ||
             record?.equipment?.equipmentNo?.toLowerCase().includes(keyword) ||
             record?.maintainer?.toLowerCase().includes(keyword);
    });
  }
  
  // 根据状态筛选
  if (filterStatus.value) {
    result = result.filter(record => record.status === filterStatus.value);
  }
  
  // 根据设备筛选
  if (filterEquipmentId.value) {
    result = result.filter(record => record.equipmentId === filterEquipmentId.value);
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
    await fetchMaintenanceRecords();
  } catch (error) {
    console.error('获取数据失败:', error);
    showNotify({ type: 'danger', message: '获取数据失败' });
  }
});

// 获取维护记录列表
const fetchMaintenanceRecords = async () => {
  try {
    console.log('🔄 维护页面：开始获取维护记录...');
    const data = await maintenanceStore.fetchMaintenanceRecords();
    console.log('✅ 维护页面：从store获得的数据数量:', data?.length || 0);
    
    // 确保设置的是数组
    maintenanceRecords.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('❌ 获取维护记录失败:', error);
    showNotify({ type: 'danger', message: '获取维护记录失败' });
    // 确保发生错误时设置为空数组
    maintenanceRecords.value = [];
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

// 跳转到设备申请页面
const goToNewEquipmentApply = () => {
  router.push('/equipment/apply');
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

.maintenance-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  
  .maintenance-type {
    font-weight: 600;
    color: #323233;
  }
  
  .status-tag {
    margin-left: 8px;
  }
}

.maintenance-info {
  color: #969799;
  font-size: 12px;
  line-height: 1.4;
  
  .equipment-info {
    margin-bottom: 4px;
    
    .equipment-name {
      font-weight: 500;
      color: #646566;
    }
    
    .equipment-no {
      margin-left: 4px;
      color: #969799;
    }
  }
  
  .maintenance-details {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    
    .maintenance-date {
      color: #646566;
    }
    
    .maintainer {
      color: #969799;
    }
  }
  
  .equipment-location {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #969799;
    
    .van-icon {
      color: #969799;
    }
  }
}
</style>