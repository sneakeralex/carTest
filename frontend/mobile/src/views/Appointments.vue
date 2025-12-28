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
            :key="appointment.appointmentNo"
            is-link
            :to="`/appointments/${appointment.appointmentNo}`"
            class="appointment-cell"
          >
            <template #title>
              <div class="appointment-header">
                <div class="service-type">{{ appointment.serviceType }}</div>
                <div class="status-tag">
                  <van-tag :type="getStatusTagType(appointment.status)" plain>
                    {{ getStatusText(appointment.status) }}
                  </van-tag>
                </div>
              </div>
            </template>
            <template #label>
              <div class="appointment-info">
                <div class="appointment-no">
                  <van-icon name="notes-o" />
                  <span>预约编号：{{ appointment.appointmentNo }}</span>
                </div>
                <div class="time-info">
                  <van-icon name="clock-o" />
                  <span>预约时间：{{ formatDateTime(appointment.appointmentTime) }}</span>
                  <span v-if="appointment.duration" class="duration">({{ formatDuration(appointment.duration) }})</span>
                </div>
                <div class="vehicle-info" v-if="appointment.vehicleInfo">
                  <van-icon name="logistics" />
                  <span>车辆信息：{{ `${appointment.vehicleInfo.brand} ${appointment.vehicleInfo.model} (${appointment.vehicleInfo.licensePlate})` }}</span>
                </div>
                <div class="contact-info" v-if="appointment.contactName || appointment.contactPhone">
                  <van-icon name="contact" />
                  <span>联系方式：{{ [appointment.contactName, appointment.contactPhone].filter(Boolean).join(' - ') }}</span>
                </div>
                <div class="description" v-if="appointment.description">
                  <van-icon name="description" />
                  <span>服务描述：{{ appointment.description }}</span>
                </div>
                <div class="remark" v-if="appointment.remark">
                  <van-icon name="comment-o" />
                  <span>备注：{{ appointment.remark }}</span>
                </div>
                <div class="created-time">
                  <van-icon name="underway-o" />
                  <span>创建时间：{{ formatDateTime(appointment.createdTime) }}</span>
                </div>
              </div>
            </template>
          </van-cell>
        </van-cell-group>
        <van-empty v-else description="暂无预约信息" />
      </van-list>
    </van-pull-refresh>
    
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
import { useVehicleStore } from '../stores/vehicle';

const router = useRouter();
const appointmentStore = useAppointmentStore();
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

// 预约数据
const appointments = ref([]);

// 筛选相关
const showFilter = ref(false);
const filterStatus = ref('');
const filterTimeRange = ref('all');

// 过滤后的预约列表
const filteredAppointments = computed(() => {
  let result = Array.isArray(appointments.value) ? appointments.value : [];
  
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
  return Array.isArray(result) ? result.sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime)) : [];
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
    loading.value = true;
    const data = await appointmentStore.fetchAppointments();
    // 获取所有预约记录
    const appointmentList = data.content || [];
    
    // 获取所有涉及的车辆ID
    const vehicleIds = [...new Set(appointmentList.map(a => a.vehicleId))];
    
    // 获取车辆信息
    let vehicleMap = new Map();
    if (vehicleIds.length > 0) {
      try {
        // 获取每个车辆的详细信息
        const vehiclePromises = vehicleIds.map(id => vehicleStore.fetchVehicleById(id));
        const vehicles = await Promise.all(vehiclePromises);
        
        // 建立车辆ID到车辆信息的映射
        vehicles.forEach(vehicle => {
          if (vehicle) {
            vehicleMap.set(vehicle.id, vehicle);
          }
        });
      } catch (err) {
        console.error('获取车辆信息失败:', err);
      }
    }
    
    // 将车辆信息添加到预约记录中
    appointments.value = appointmentList.map(appointment => ({
      ...appointment,
      vehicleInfo: vehicleMap.get(appointment.vehicleId) || null
    }));
    
    console.log('预约列表（含车辆信息）:', appointments.value);
  } catch (error) {
    console.error('获取预约列表失败:', error);
    throw error;
  } finally {
    loading.value = false;
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

// 格式化持续时间
const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  }
  return `${mins}min`;
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
  background-color: #f7f8fa;
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

.appointment-cell {
  margin: 8px 0;
  
  :deep(.van-cell__title) {
    flex: 1;
  }
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .service-type {
    font-size: 16px;
    font-weight: 500;
    color: #323233;
  }
}

.appointment-info {
  .appointment-no,
  .time-info,
  .vehicle-info,
  .contact-info,
  .description,
  .remark,
  .created-time {
    display: flex;
    align-items: center;
    margin: 8px 0;
    font-size: 14px;
    color: #666;
    line-height: 1.5;

    .van-icon {
      margin-right: 8px;
      font-size: 16px;
      color: #969799;
      min-width: 16px;
    }
  }

  .description {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .created-time {
    font-size: 12px;
    color: #969799;
    margin-top: 12px;
  }
}

.status-tag {
  .van-tag {
    padding: 0 8px;
    font-size: 12px;
    height: 24px;
    line-height: 22px;
  }
}

.duration {
  margin-left: 8px;
  color: #969799;
  font-size: 12px;
}
</style>