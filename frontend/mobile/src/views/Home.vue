<template>
  <div class="home-container">
    <!-- 顶部用户信息 -->
    <div class="user-info">
      <van-image
        round
        width="50"
        height="50"
        :src="userAvatar"
        class="avatar"
      />
      <div class="welcome">
        <p class="greeting">您好，{{ userName }}</p>
        <p class="date">{{ currentDate }}</p>
      </div>
    </div>
    
    <!-- 快捷功能区 -->
    <van-grid :column-num="4" :border="false" class="quick-actions">
      <van-grid-item icon="logistics" text="我的车辆" to="/vehicles" />
      <van-grid-item icon="calendar-o" text="预约服务" to="/appointments" />
      <van-grid-item icon="setting-o" text="维修保养" to="/maintenance" />
      <van-grid-item icon="contact" text="个人中心" to="/profile" />
    </van-grid>
    
    <!-- 车辆状态卡片 -->
    <div class="section-title">车辆状态</div>
    <div class="vehicle-status" v-if="vehicles.length > 0">
      <van-swipe :loop="false" :width="300" :show-indicators="false">
        <van-swipe-item v-for="vehicle in vehicles" :key="vehicle.id">
          <van-card
            :title="vehicle.brand + ' ' + vehicle.model"
            :desc="'车牌: ' + vehicle.licensePlate"
            class="vehicle-card"
            @click="goToVehicleDetail(vehicle.id)"
          >
            <template #thumb>
              <van-image
                width="100%"
                height="80"
                fit="cover"
                :src="getVehicleImage(vehicle)"
              />
            </template>
            <template #tags>
              <van-tag plain type="primary" v-if="vehicle.status === 'NORMAL'">正常</van-tag>
              <van-tag plain type="warning" v-else-if="vehicle.status === 'MAINTENANCE'">维修中</van-tag>
              <van-tag plain type="danger" v-else-if="vehicle.status === 'ISSUE'">有故障</van-tag>
            </template>
            <template #footer>
              <div class="vehicle-info">
                <div class="info-item">
                  <van-icon name="underway-o" />
                  <span>{{ vehicle.mileage }}km</span>
                </div>
                <div class="info-item">
                  <van-icon name="clock-o" />
                  <span>{{ formatDate(vehicle.lastMaintenanceDate) }}</span>
                </div>
              </div>
            </template>
          </van-card>
        </van-swipe-item>
      </van-swipe>
    </div>
    <van-empty v-else description="暂无车辆信息" />
    
    <!-- 最近预约 -->
    <div class="section-title">最近预约</div>
    <div class="recent-appointments" v-if="appointments.length > 0">
      <van-cell-group inset>
        <van-cell 
          v-for="appointment in appointments" 
          :key="appointment.id"
          :title="appointment.serviceType"
          :label="formatDateTime(appointment.appointmentTime)"
          :value="getStatusText(appointment.status)"
          :to="`/appointments/${appointment.id}`"
          is-link
        >
          <template #icon>
            <van-icon name="calendar-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无预约信息" />
    
    <!-- 维修保养提醒 -->
    <div class="section-title">维修保养提醒</div>
    <div class="maintenance-reminders" v-if="maintenanceReminders.length > 0">
      <van-cell-group inset>
        <van-cell 
          v-for="reminder in maintenanceReminders" 
          :key="reminder.id"
          :title="reminder.title"
          :label="reminder.description"
          is-link
          :to="`/vehicles/${reminder.vehicleId}`"
        >
          <template #icon>
            <van-icon name="warning-o" class="cell-icon warning" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
    <van-empty v-else description="暂无维修保养提醒" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicleStore } from '../stores/vehicle';
import { useAppointmentStore } from '../stores/appointment';
import { useMaintenanceStore } from '../stores/maintenance';

const router = useRouter();
const vehicleStore = useVehicleStore();
const appointmentStore = useAppointmentStore();
const maintenanceStore = useMaintenanceStore();

// 用户信息
const userInfo = JSON.parse(localStorage.getItem('user') || '{}');
const userName = computed(() => userInfo.name || '用户');
const userAvatar = ref('https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg'); // 默认头像

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
});

// 车辆数据
const vehicles = ref([]);

// 预约数据
const appointments = ref([]);

// 维修保养提醒
const maintenanceReminders = ref([]);

// 获取数据
onMounted(async () => {
  try {
    // 获取车辆列表
    const vehicleData = await vehicleStore.fetchVehicles();
    vehicles.value = vehicleData || [];
    
    // 获取预约列表
    const appointmentData = await appointmentStore.fetchAppointments();
    // 只显示最近的3个预约
    appointments.value = (appointmentData || [])
      .filter(item => item.status !== 'COMPLETED' && item.status !== 'CANCELLED')
      .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))
      .slice(0, 3);
    
    // 获取维修保养记录
    await maintenanceStore.fetchMaintenanceRecords();
    
    // 生成维修保养提醒
    generateMaintenanceReminders();
  } catch (error) {
    console.error('获取数据失败:', error);
  }
});

// 生成维修保养提醒
const generateMaintenanceReminders = () => {
  const reminders = [];
  
  // 检查每辆车的状态和保养情况
  vehicles.value.forEach(vehicle => {
    // 里程数提醒
    if (vehicle.mileage > 5000 && !vehicle.lastMaintenanceDate) {
      reminders.push({
        id: `mileage-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: `${vehicle.brand} ${vehicle.model} 需要首次保养`,
        description: `当前里程数: ${vehicle.mileage}km`,
        type: 'MILEAGE'
      });
    } else if (vehicle.mileage - vehicle.lastMaintenanceMileage > 5000) {
      reminders.push({
        id: `mileage-${vehicle.id}`,
        vehicleId: vehicle.id,
        title: `${vehicle.brand} ${vehicle.model} 需要常规保养`,
        description: `距离上次保养已行驶: ${vehicle.mileage - vehicle.lastMaintenanceMileage}km`,
        type: 'MILEAGE'
      });
    }
    
    // 时间提醒
    if (vehicle.lastMaintenanceDate) {
      const lastDate = new Date(vehicle.lastMaintenanceDate);
      const now = new Date();
      const monthsDiff = (now.getFullYear() - lastDate.getFullYear()) * 12 + now.getMonth() - lastDate.getMonth();
      
      if (monthsDiff >= 6) {
        reminders.push({
          id: `time-${vehicle.id}`,
          vehicleId: vehicle.id,
          title: `${vehicle.brand} ${vehicle.model} 需要定期保养`,
          description: `距离上次保养已超过${monthsDiff}个月`,
          type: 'TIME'
        });
      }
    }
  });
  
  maintenanceReminders.value = reminders;
};

// 获取车辆图片
const getVehicleImage = (vehicle) => {
  // 这里可以根据车型返回不同的图片
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-8.jpeg';
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '暂无记录';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${formatDate(dateTimeString)} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
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

// 跳转到车辆详情
const goToVehicleDetail = (id) => {
  router.push(`/vehicles/${id}`);
};
</script>

<style lang="less" scoped>
.home-container {
  padding: 16px;
  padding-bottom: 60px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  
  .avatar {
    margin-right: 12px;
  }
  
  .welcome {
    .greeting {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .date {
      font-size: 14px;
      color: #969799;
    }
  }
}

.quick-actions {
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  padding-left: 4px;
}

.vehicle-status {
  margin-bottom: 16px;
  
  .vehicle-card {
    width: 300px;
    background-color: #fff;
    border-radius: 8px;
    margin-right: 12px;
    
    .vehicle-info {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
      
      .info-item {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #969799;
        
        .van-icon {
          margin-right: 4px;
        }
      }
    }
  }
}

.recent-appointments,
.maintenance-reminders {
  margin-bottom: 16px;
}

.cell-icon {
  margin-right: 8px;
  font-size: 18px;
  
  &.warning {
    color: #ff976a;
  }
}
</style>