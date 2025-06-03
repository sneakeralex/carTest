<template>
  <div class="appointments-container">
    <!-- 顶部搜索栏 -->
    <van-search
      v-model="searchText"
      placeholder="搜索预约服务类型"
      shape="round"
      background="#f7f8fa"
      @search="onSearch"
    />
    
    <!-- 预约列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-if="filteredAppointments.length > 0">
          <van-cell 
            v-for="appointment in filteredAppointments" 
            :key="appointment.id"
            :title="appointment.serviceType"
            :label="formatDateTime(appointment.appointmentTime)"
            is-link
            :to="`/appointments/${appointment.id}`"
          >
            <template #right-icon>
              <van-tag :type="getStatusTagType(appointment.status)" plain>
                {{ getStatusText(appointment.status) }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无预约信息" />
      </van-list>
    </van-pull-refresh>
    
    <!-- 添加预约按钮 -->
    <van-button
      type="primary"
      icon="plus"
      class="add-button"
      round
      @click="goToNewAppointment"
    >
      新增预约
    </van-button>
    
    <!-- 筛选器 -->
    <van-action-sheet
      v-model:show="showFilter"
      title="筛选预约"
      close-on-click-action
    >
      <div class="filter-content">
        <div class="filter-item">
          <div class="filter-title">预约状态</div>
          <van-radio-group v-model="filterStatus" direction="horizontal">
            <van-radio name="">全部</van-radio>
            <van-radio name="PENDING">待处理</van-radio>
            <van-radio name="CONFIRMED">已确认</van-radio>
            <van-radio name="COMPLETED">已完成</van-radio>
            <van-radio name="CANCELLED">已取消</van-radio>
          </van-radio-group>
        </div>
        
        <div class="filter-item">
          <div class="filter-title">时间范围</div>
          <van-radio-group v-model="filterTimeRange" direction="horizontal">
            <van-radio name="all">全部</van-radio>
            <van-radio name="today">今天</van-radio>
            <van-radio name="week">本周</van-radio>
            <van-radio name="month">本月</van-radio>
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
import { useAppointmentStore } from '../stores/appointment';

const router = useRouter();
const appointmentStore = useAppointmentStore();

// 搜索相关
const searchText = ref('');
const onSearch = () => {
  // 搜索逻辑在计算属性中处理
};

// 列表相关
const loading = ref(false);
const finished = ref(true); // 由于我们一次性加载所有数据，所以设置为true
const refreshing = ref(false);

// 预约数据
const appointments = ref([]);

// 筛选相关
const showFilter = ref(false);
const filterStatus = ref('');
const filterTimeRange = ref('all');

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  let result = appointments.value;
  
  // 根据搜索文本筛选
  if (searchText.value) {
    const keyword = searchText.value.toLowerCase();
    result = result.filter(appointment => {
      return appointment.serviceType.toLowerCase().includes(keyword) ||
             appointment.description?.toLowerCase().includes(keyword);
    });
  }
  
  // 根据状态筛选
  if (filterStatus.value) {
    result = result.filter(appointment => appointment.status === filterStatus.value);
  }
  
  // 根据时间范围筛选
  if (filterTimeRange.value !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    result = result.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentTime);
      
      if (filterTimeRange.value === 'today') {
        return appointmentDate >= today && appointmentDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      } else if (filterTimeRange.value === 'week') {
        return appointmentDate >= weekStart && appointmentDate < new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
      } else if (filterTimeRange.value === 'month') {
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return appointmentDate >= monthStart && appointmentDate < nextMonth;
      }
      
      return true;
    });
  }
  
  // 按预约时间排序
  return result.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime));
});

// 获取数据
onMounted(async () => {
  try {
    await fetchAppointments();
  } catch (error) {
    console.error('获取预约列表失败:', error);
    showNotify({ type: 'danger', message: '获取预约列表失败' });
  }
});

// 获取预约列表
const fetchAppointments = async () => {
  try {
    const data = await appointmentStore.fetchAppointments();
    appointments.value = data || [];
  } catch (error) {
    console.error('获取预约列表失败:', error);
    throw error;
  }
};

// 下拉刷新
const onRefresh = async () => {
  try {
    await fetchAppointments();
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

// 跳转到新增预约页面
const goToNewAppointment = () => {
  router.push('/appointments/new');
};

// 应用筛选
const applyFilter = () => {
  showFilter.value = false;
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'CONFIRMED': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'CONFIRMED': '已确认',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};
</script>

<style lang="less" scoped>
.appointments-container {
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