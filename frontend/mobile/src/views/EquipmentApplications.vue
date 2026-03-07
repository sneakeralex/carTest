<template>
  <div class="equipment-applications-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="设备领用"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索设备领用记录"
      shape="round"
      background="#f7f8fa"
      @search="onSearch"
    />
    
    <!-- 领用记录列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-if="filteredApplications.length > 0">
          <van-cell 
            v-for="record in filteredApplications" 
            :key="record.id"
            :title="`${record.equipmentName} (${record.equipmentCode})`"
            is-link
            :to="`/equipment/application/${record.id}`"
          >
            <template #label>
              <div class="record-info">
                <span class="time">{{ formatDateTime(record.startTime) }} 至 {{ formatDateTime(record.endTime) }}</span>
                <div class="purpose">用途：{{ record.purpose }}</div>
                <div class="location">地点：{{ record.location }}</div>
              </div>
            </template>
            <template #right-icon>
              <div class="record-status">
                <van-tag :type="getStatusTagType(record.status)" plain>
                  {{ getStatusText(record.status) }}
                </van-tag>
                <div class="applicant">{{ record.applicantName }}</div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无领用记录" />
      </van-list>
    </van-pull-refresh>
    
    <!-- 设备申请按钮 -->
    <van-button
      type="primary"
      icon="orders-o"
      class="add-button"
      round
      @click="goToNewEquipmentApply"
    >
      设备领用申请
    </van-button>
    
    <!-- 筛选器 -->
    <van-action-sheet
      v-model:show="showFilter"
      title="筛选领用记录"
      close-on-click-action
    >
      <div class="filter-content">
        <div class="filter-item">
          <div class="filter-title">申请状态</div>
          <van-radio-group v-model="filterStatus" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio name="PENDING">待审批</van-radio>
            <van-radio name="APPROVED">已批准</van-radio>
            <van-radio name="REJECTED">已拒绝</van-radio>
            <van-radio name="CANCELLED">已取消</van-radio>
          </van-radio-group>
        </div>
        
        <div class="filter-item">
          <div class="filter-title">设备</div>
          <van-radio-group v-model="filterEquipmentId" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio 
              v-for="equipment in equipments" 
              :key="equipment.id" 
              :name="equipment.id"
            >
              {{ equipment.name }} ({{ equipment.code }})
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
import { useEquipmentStore } from '../stores/equipment';
import { formatDateTime } from '@/utils/dateFormatter';

const router = useRouter();
const equipmentStore = useEquipmentStore();

// 搜索相关
const searchText = ref('');
const onSearch = () => {
  // 搜索逻辑在计算属性中处理
};

// 列表相关
const loading = ref(false);
const finished = ref(true); // 由于我们一次性加载所有数据，所以设置为true
const refreshing = ref(false);

// 领用记录数据
const applications = ref([]);
const equipments = ref([]);

// 筛选相关
const showFilter = ref(false);
const filterStatus = ref('');
const filterEquipmentId = ref('');
const filterTimeRange = ref('all');

// 过滤后的领用记录列表
const filteredApplications = computed(() => {
  let result = Array.isArray(applications.value) ? applications.value : [];
  
  // 根据搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(record => {
      return record?.equipmentName?.toLowerCase().includes(keyword) ||
             record?.purpose?.toLowerCase().includes(keyword);
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
        const recordDate = new Date(record.startTime);
        return recordDate >= startDate;
      });
    }
  }
  
  // 按申请时间排序（最新的在前面）
  return result.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
});

// 获取数据
onMounted(async () => {
  try {
    await Promise.all([fetchApplications(), fetchEquipments()]);
  } catch (error) {
    console.error('获取数据失败:', error);
    showNotify({ type: 'danger', message: '获取数据失败' });
  }
});

// 获取领用记录列表
const fetchApplications = async () => {
  try {
    const data = await equipmentStore.fetchApplications();
    applications.value = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('获取领用记录失败:', error);
    showNotify({ type: 'danger', message: '获取领用记录失败' });
    applications.value = [];
  }
};

// 获取设备列表
const fetchEquipments = async () => {
  try {
    const data = await equipmentStore.fetchEquipments();
    equipments.value = data || [];
  } catch (error) {
    console.error('获取设备列表失败:', error);
    throw error;
  }
};

// 下拉刷新
const onRefresh = async () => {
  try {
    await fetchApplications();
    showNotify({ type: 'success', message: '刷新成功' });
  } catch (error) {
    showNotify({ type: 'danger', message: '刷新失败' });
  } finally {
    refreshing.value = false;
  }
};

// 加载更多
const onLoad = () => {
  loading.value = false;
};

// 跳转到设备申请页面
const goToNewEquipmentApply = () => {
  router.push('/equipment/apply');
};

// 返回上一页
const onClickLeft = () => {
  router.back();
};

// 应用筛选
const applyFilter = () => {
  showFilter.value = false;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'danger',
    'CANCELLED': 'default'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待审批',
    'APPROVED': '已批准',
    'REJECTED': '已拒绝',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};
</script>

<style lang="less" scoped>
.equipment-applications-container {
  padding-bottom: 80px;
}

.record-info {
  .time {
    color: #666;
    font-size: 13px;
  }
  
  .purpose, .location {
    color: #666;
    font-size: 13px;
    margin-top: 4px;
  }
}

.record-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  
  .applicant {
    margin-top: 4px;
    font-size: 12px;
    color: #999;
  }
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
