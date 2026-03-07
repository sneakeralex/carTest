// @ts-nocheck
<template>
  <div class="equipment-ledger">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="设备台账"
      left-arrow
      @click-left="router.back()"
      fixed
    />

    <!-- 顶部搜索 -->
    <div class="search-container">
      <van-search
        v-model="searchText"
        placeholder="搜索设备名称或编号"
        shape="round"
        background="#f7f8fa"
        @search="onSearch"
      >
        <template #right-icon>
          <van-icon name="filter-o" @click="showFilter = true" />
        </template>
      </van-search>
      <!-- 可租用设备切换 -->
      <van-switch
        v-model="showRentable"
        active-color="#1989fa"
        inactive-color="#e4e7ed"
        @change="onToggleRentable"
      >
        <template #node>
          <span class="switch-label">{{ showRentable ? '可租用设备' : '全部设备' }}</span>
        </template>
      </van-switch>
    </div>

    <!-- 设备列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh" success-text="刷新成功">
      <template v-if="loading && !equipments.length">
        <van-cell-group inset v-for="i in 3" :key="i">
          <van-cell>
            <template #title>
              <van-skeleton title :row="2" />
            </template>
          </van-cell>
        </van-cell-group>
      </template>
      
      <van-list
        v-else
        v-model:loading="loadingMore"
        :finished="finished"
        finished-text="没有更多了"
        :error="!!error"
        error-text="加载失败，请点击重试"
        @load="onLoad"
      >
        <van-cell-group inset v-if="filteredEquipments.length > 0">
          <van-cell 
            v-for="equipment in filteredEquipments" 
            :key="equipment.equipmentId"
            :title="`${equipment.equipmentName} (${equipment.equipmentNo})`"
            :label="equipment.equipmentType"
            is-link
            @click="showEquipmentDetail(equipment)"
          >
            <template #value>
              <div class="equipment-tags">
                <van-tag :type="getStatusType(equipment.status)" plain round>
                  {{ getStatusText(equipment.status) }}
                </van-tag>
                <van-tag v-if="showRentable || equipment.rentable" type="success" plain round class="rentable-tag">
                  可租用
                </van-tag>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty 
          v-else-if="!loading" 
          :description="searchText || filterStatus || filterType ? '没有符合条件的设备' : '暂无设备'" 
        />
      </van-list>
    </van-pull-refresh>

    <!-- 筛选器 -->
    <van-action-sheet
      v-model:show="showFilter"
      title="筛选设备"
      close-on-click-action
    >
      <div class="filter-content">
        <div class="filter-item">
          <div class="filter-title">设备状态</div>
          <van-radio-group v-model="filterStatus" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio name="IN_USE">使用中</van-radio>
            <van-radio name="IDLE">闲置</van-radio>
            <van-radio name="MAINTENANCE">维护中</van-radio>
            <van-radio name="RETIRED">已报废</van-radio>
          </van-radio-group>
        </div>

        <div class="filter-item">
          <div class="filter-title">设备类型</div>
          <van-radio-group v-model="filterType" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio v-for="type in equipmentTypes" :key="type" :name="type">
              {{ type }}
            </van-radio>
          </van-radio-group>
        </div>

        <div class="filter-actions">
          <van-button type="primary" block @click="applyFilter">应用筛选</van-button>
          <van-button block @click="resetFilter" style="margin-top: 8px">重置</van-button>
        </div>
      </div>
    </van-action-sheet>

    <!-- 设备详情弹窗 -->
    <van-dialog
      v-model:show="showDetail"
      :title="currentEquipment?.equipmentName"
      class="equipment-detail-dialog"
      show-cancel-button
      confirm-button-text="关闭"
      @confirm="showDetail = false"
      @cancel="showDetail = false"
    >
      <template v-if="currentEquipment">
        <van-cell-group>
          <van-cell title="设备编号" :value="currentEquipment.equipmentNo" />
          <van-cell title="设备类型" :value="currentEquipment.equipmentType" />
          <van-cell title="规格型号" :value="currentEquipment.specification" />
          <van-cell title="生产厂商" :value="currentEquipment.manufacturer" />
          <van-cell title="购置日期" :value="formatDate(currentEquipment.purchaseDate)" />
          <van-cell title="存放位置" :value="currentEquipment.location" />
          <van-cell title="所属部门" :value="currentEquipment.departmentName" />
          <van-cell title="设备状态">
            <template #value>
              <van-tag :type="getStatusType(currentEquipment.status)" plain round>
                {{ getStatusText(currentEquipment.status) }}
              </van-tag>
            </template>
          </van-cell>
          <van-cell title="维护周期" :value="currentEquipment.maintenanceCycle ? `${currentEquipment.maintenanceCycle}天` : '--'" />
          <van-cell title="上次维护" :value="currentEquipment.lastMaintenanceDate ? formatDate(currentEquipment.lastMaintenanceDate) : '--'" />
          <van-cell title="负责人" :value="currentEquipment.responsiblePerson || '--'" />
          <van-cell title="联系电话" :value="currentEquipment.contactInfo || '--'" />
          <van-cell title="购置价格" :value="currentEquipment.purchasePrice ? `￥${currentEquipment.purchasePrice}` : '--'" />
          <van-cell title="设备说明" :label="currentEquipment.description || '--'" />
        </van-cell-group>
      </template>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useEquipmentStore } from '../stores/equipment';
import { formatDate } from '@/utils/dateFormatter';

const router = useRouter();
const equipmentStore = useEquipmentStore();

// 列表相关
const loading = ref(false);
const loadingMore = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const error = ref(null);
const equipments = ref([]);
const pageSize = 20;
const currentPage = ref(1);

// 搜索相关
const searchText = ref(localStorage.getItem('equipment_search') || '');
const showFilter = ref(false);
const filterStatus = ref(localStorage.getItem('equipment_status') || '');
const filterType = ref(localStorage.getItem('equipment_type') || '');
const showRentable = ref(false);

// 设备类型列表
const equipmentTypes = [
  '压力测试仪',
  '温度检测仪',
  '电压表',
  '万用表',
  '示波器',
  '信号发生器',
  '专用工具',
  '其他设备'
];

// 详情弹窗
const showDetail = ref(false);
const currentEquipment = ref(null);

// 持久化搜索和筛选条件
watch(searchText, (val) => {
  localStorage.setItem('equipment_search', val);
});

watch(filterStatus, (val) => {
  localStorage.setItem('equipment_status', val);
});

watch(filterType, (val) => {
  localStorage.setItem('equipment_type', val);
});

// 过滤后的设备列表
const filteredEquipments = computed(() => {
  let result = equipments.value;

  // 搜索过滤
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(item => 
      item.equipmentName.toLowerCase().includes(keyword) ||
      item.equipmentNo.toLowerCase().includes(keyword)
    );
  }

  // 状态过滤
  if (filterStatus.value) {
    result = result.filter(item => item.status === filterStatus.value);
  }

  // 类型过滤
  if (filterType.value) {
    result = result.filter(item => item.equipmentType === filterType.value);
  }

  return result;
});

// 获取数据
const fetchEquipments = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    let data;
    
    if (showRentable.value) {
      // 获取可租用设备
      data = await equipmentStore.fetchRentableEquipments({
        page: currentPage.value,
        pageSize: pageSize,
        deviceNo: searchText.value,
        deviceName: searchText.value
      });
    } else {
      // 获取全部设备
      data = await equipmentStore.fetchEquipments({
        page: currentPage.value,
        pageSize: pageSize,
        status: filterStatus.value,
        type: filterType.value,
        keyword: searchText.value
      });
    }
    
    const records = data?.records || [];
    
    if (refreshing.value || currentPage.value === 1) {
      equipments.value = records;
    } else {
      equipments.value = [...equipments.value, ...records];
    }
    
    finished.value = !records.length || records.length < pageSize;
  } catch (err) {
    console.error('获取设备列表失败:', err);
    error.value = err;
    showNotify({ type: 'danger', message: '获取设备列表失败' });
  } finally {
    loading.value = false;
    loadingMore.value = false;
    refreshing.value = false;
  }
};

// 搜索
const onSearch = () => {
  currentPage.value = 1;
  fetchEquipments();
};

// 应用筛选
const applyFilter = () => {
  showFilter.value = false;
  currentPage.value = 1;
  fetchEquipments();
};

// 重置筛选
const resetFilter = () => {
  filterStatus.value = '';
  filterType.value = '';
  showFilter.value = false;
  currentPage.value = 1;
  fetchEquipments();
};

// 切换可租用设备
const onToggleRentable = () => {
  currentPage.value = 1;
  fetchEquipments();
};

// 下拉刷新
const onRefresh = async () => {
  currentPage.value = 1;
  await fetchEquipments();
};

// 加载更多
const onLoad = () => {
  if (!finished.value && !loading.value) {
    currentPage.value += 1;
    fetchEquipments();
  }
};

// 显示设备详情
const showEquipmentDetail = (equipment) => {
  currentEquipment.value = equipment;
  showDetail.value = true;
};

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    'IN_USE': 'warning',
    'IDLE': 'primary',
    'MAINTENANCE': 'danger',
    'RETIRED': 'default'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'IN_USE': '使用中',
    'IDLE': '闲置',
    'MAINTENANCE': '维护中',
    'RETIRED': '已报废'
  };
  return textMap[status] || status;
};

// 初始化
onMounted(fetchEquipments);
</script>

<style lang="less" scoped>
.equipment-ledger {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 46px 0 20px;
}

.search-container {
  padding: 10px 16px;
  background-color: #f7f8fa;
  position: sticky;
  top: 46px;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .van-search {
    margin-bottom: 10px;
  }
  
  .switch-label {
    font-size: 14px;
    color: #333;
    margin-right: 10px;
  }
}

.equipment-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .rentable-tag {
    margin-left: 4px;
  }
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

.equipment-detail-dialog {
  :deep(.van-dialog__content) {
    padding: 20px 0;
  }
}

:deep(.van-list) {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
