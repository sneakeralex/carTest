<template>
  <div class="maintenance-detail-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="维护详情"
      left-arrow
      @click-left="router.back()"
      fixed
    >
      <template #right>
        <van-icon 
          name="edit" 
          size="18" 
          @click="showEditPopup = true" 
          v-if="canEdit"
        />
      </template>
    </van-nav-bar>
    
    <div class="content" v-if="maintenance">
      <!-- 加载状态 -->
      <van-loading v-if="loading" size="24px" vertical>加载中...</van-loading>
      
      <!-- 维护信息卡片 -->
      <van-cell-group inset class="info-card">
        <van-cell title="维护类型" :value="maintenance.maintenanceType" />
        <van-cell title="维护日期" :value="formatDate(maintenance.maintenanceDate)" />
        <van-cell title="状态">
          <template #default>
            <van-tag :type="getStatusTagType(maintenance.status)" plain>
              {{ getStatusText(maintenance.status) }}
            </van-tag>
          </template>
        </van-cell>
        <van-cell title="车辆" :value="vehicleInfo" />
        <van-cell title="里程数" :value="maintenance.mileage ? `${maintenance.mileage} 公里` : '未记录'" />
        <van-cell title="维护描述" v-if="maintenance.description">
          <template #default>
            <div class="description">{{ maintenance.description }}</div>
          </template>
        </van-cell>
        <van-cell title="技师备注" v-if="maintenance.technicianNotes">
          <template #default>
            <div class="notes">{{ maintenance.technicianNotes }}</div>
          </template>
        </van-cell>
      </van-cell-group>
      
      <!-- 维护项目列表 -->
      <van-cell-group inset title="维护项目" class="items-card">
        <template v-if="maintenance.items && maintenance.items.length > 0">
          <van-cell 
            v-for="(item, index) in maintenance.items" 
            :key="index"
            :title="item.name"
          >
            <template #label>
              <div>{{ item.description }}</div>
            </template>
            <template #right-icon>
              <div class="item-price">¥{{ item.price.toFixed(2) }}</div>
            </template>
          </van-cell>
          <van-cell title="总计" :value="`¥${getTotalPrice().toFixed(2)}`" />
        </template>
        <van-empty v-else description="暂无维护项目" />
      </van-cell-group>
      
      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button 
          v-if="maintenance.status === 'PENDING' || maintenance.status === 'IN_PROGRESS'"
          type="danger" 
          block 
          @click="showCancelPopup = true"
        >
          取消维护
        </van-button>
        
        <van-button 
          v-if="maintenance.appointmentId"
          type="primary" 
          block 
          @click="goToAppointment"
        >
          查看关联预约
        </van-button>
      </div>
    </div>
    
    <van-empty v-else description="未找到维护记录" />
    
    <!-- 编辑维护弹窗 -->
    <van-popup
      v-model:show="showEditPopup"
      position="bottom"
      round
      closeable
      :style="{ height: '80%' }"
    >
      <div class="popup-title">编辑维护记录</div>
      <van-form @submit="onSubmitEdit">
        <van-cell-group inset>
          <van-field
            v-model="editForm.maintenanceType"
            name="maintenanceType"
            label="维护类型"
            placeholder="请选择维护类型"
            readonly
            is-link
            @click="showMaintenanceTypePopup = true"
            :rules="[{ required: true, message: '请选择维护类型' }]"
          />
          
          <van-field
            v-model="editForm.maintenanceDate"
            name="maintenanceDate"
            label="维护日期"
            placeholder="请选择维护日期"
            readonly
            is-link
            @click="showDatePicker = true"
            :rules="[{ required: true, message: '请选择维护日期' }]"
          />
          
          <van-field
            v-model="editForm.vehicleId"
            name="vehicleId"
            label="车辆"
            placeholder="请选择车辆"
            readonly
            is-link
            @click="showVehiclePopup = true"
            :rules="[{ required: true, message: '请选择车辆' }]"
          />
          
          <van-field
            v-model="editForm.mileage"
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
            v-model="editForm.description"
            name="description"
            label="维护描述"
            type="textarea"
            placeholder="请输入维护描述"
            rows="2"
            autosize
          />
          
          <van-field
            v-model="editForm.technicianNotes"
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
          
          <van-cell-group inset v-for="(item, index) in editForm.items" :key="index">
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
        </div>
        
        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" :loading="submitting">
            保存
          </van-button>
        </div>
      </van-form>
    </van-popup>
    
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
    
    <!-- 取消维护确认弹窗 -->
    <van-dialog
      v-model:show="showCancelPopup"
      title="取消维护"
      show-cancel-button
      @confirm="cancelMaintenance"
    >
      <div class="cancel-dialog-content">
        确定要取消此维护记录吗？取消后将无法恢复。
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showNotify, showToast } from 'vant';
import { useMaintenanceStore } from '../stores/maintenance';
import { useVehicleStore } from '../stores/vehicle';

const route = useRoute();
const router = useRouter();
const maintenanceStore = useMaintenanceStore();
const vehicleStore = useVehicleStore();

// 状态变量
const loading = ref(true);
const maintenance = ref(null);
const vehicles = ref([]);
const submitting = ref(false);

// 弹窗控制
const showEditPopup = ref(false);
const showMaintenanceTypePopup = ref(false);
const showDatePicker = ref(false);
const showVehiclePopup = ref(false);
const showCancelPopup = ref(false);

// 编辑表单
const editForm = ref({
  maintenanceType: '',
  maintenanceDate: '',
  vehicleId: '',
  mileage: '',
  description: '',
  technicianNotes: '',
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

// 获取维护详情
const fetchMaintenanceDetail = async () => {
  try {
    loading.value = true;
    const id = route.params.id;
    const data = await maintenanceStore.fetchMaintenanceDetail(id);
    maintenance.value = data;
    
    // 初始化编辑表单
    if (data) {
      editForm.value = {
        maintenanceType: data.maintenanceType,
        maintenanceDate: formatDate(data.maintenanceDate),
        vehicleId: data.vehicleId,
        mileage: data.mileage ? String(data.mileage) : '',
        description: data.description || '',
        technicianNotes: data.technicianNotes || '',
        items: data.items ? [...data.items] : []
      };
      selectedDate.value = new Date(data.maintenanceDate);
    }
  } catch (error) {
    console.error('获取维护详情失败:', error);
    showNotify({ type: 'danger', message: '获取维护详情失败' });
  } finally {
    loading.value = false;
  }
};

// 获取车辆列表
const fetchVehicles = async () => {
  try {
    const data = await vehicleStore.fetchVehicles();
    vehicles.value = data || [];
  } catch (error) {
    console.error('获取车辆列表失败:', error);
  }
};

// 初始化数据
onMounted(async () => {
  await Promise.all([fetchMaintenanceDetail(), fetchVehicles()]);
});

// 计算属性
const vehicleInfo = computed(() => {
  if (!maintenance.value || !vehicles.value.length) return '';
  
  const vehicle = vehicles.value.find(v => v.id === maintenance.value.vehicleId);
  if (vehicle) {
    return `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`;
  }
  return '';
});

const vehicleOptions = computed(() => {
  return vehicles.value.map(vehicle => ({
    text: `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})`,
    value: vehicle.id
  }));
});

const canEdit = computed(() => {
  return maintenance.value && 
         (maintenance.value.status === 'PENDING' || 
          maintenance.value.status === 'IN_PROGRESS');
});

// 方法
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getStatusTagType = (status) => {
  const typeMap = {
    'PENDING': 'warning',
    'IN_PROGRESS': 'primary',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return typeMap[status] || 'default';
};

const getStatusText = (status) => {
  const statusMap = {
    'PENDING': '待处理',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

const getTotalPrice = () => {
  if (!maintenance.value || !maintenance.value.items) return 0;
  
  return maintenance.value.items.reduce((total, item) => {
    return total + (parseFloat(item.price) || 0);
  }, 0);
};

// 维护类型确认
const onMaintenanceTypeConfirm = (value) => {
  editForm.value.maintenanceType = value;
  showMaintenanceTypePopup.value = false;
};

// 日期确认
const onDateConfirm = (value) => {
  selectedDate.value = value;
  editForm.value.maintenanceDate = formatDate(value);
  showDatePicker.value = false;
};

// 车辆确认
const onVehicleConfirm = (value) => {
  editForm.value.vehicleId = value.value;
  showVehiclePopup.value = false;
};

// 添加维护项目
const addMaintenanceItem = () => {
  editForm.value.items.push({
    name: '',
    description: '',
    price: ''
  });
};

// 删除维护项目
const removeMaintenanceItem = (index) => {
  editForm.value.items.splice(index, 1);
};

// 提交编辑
const onSubmitEdit = async () => {
  try {
    submitting.value = true;
    
    // 处理表单数据
    const items = editForm.value.items.map(item => ({
      ...item,
      price: parseFloat(item.price) || 0
    }));
    
    const updatedMaintenance = {
      id: maintenance.value.id,
      maintenanceType: editForm.value.maintenanceType,
      maintenanceDate: selectedDate.value.toISOString(),
      vehicleId: editForm.value.vehicleId,
      mileage: editForm.value.mileage ? parseInt(editForm.value.mileage) : null,
      description: editForm.value.description,
      technicianNotes: editForm.value.technicianNotes,
      status: maintenance.value.status,
      items: items
    };
    
    await maintenanceStore.updateMaintenance(updatedMaintenance);
    showToast('维护记录更新成功');
    showEditPopup.value = false;
    await fetchMaintenanceDetail();
  } catch (error) {
    console.error('更新维护记录失败:', error);
    showNotify({ type: 'danger', message: '更新维护记录失败' });
  } finally {
    submitting.value = false;
  }
};

// 取消维护
const cancelMaintenance = async () => {
  try {
    await maintenanceStore.cancelMaintenance(maintenance.value.id);
    showToast('维护记录已取消');
    await fetchMaintenanceDetail();
  } catch (error) {
    console.error('取消维护记录失败:', error);
    showNotify({ type: 'danger', message: '取消维护记录失败' });
  }
};

// 跳转到关联预约
const goToAppointment = () => {
  if (maintenance.value && maintenance.value.appointmentId) {
    router.push(`/appointments/${maintenance.value.appointmentId}`);
  } else {
    showToast('没有关联的预约');
  }
};
</script>

<style lang="less" scoped>
.maintenance-detail-container {
  padding-top: 46px;
  padding-bottom: 20px;
}

.content {
  padding: 16px;
}

.info-card, .items-card {
  margin-bottom: 20px;
}

.description, .notes {
  white-space: pre-wrap;
  word-break: break-word;
}

.item-price {
  font-weight: 600;
  color: #f56c6c;
}

.action-buttons {
  margin-top: 24px;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  padding: 16px;
  border-bottom: 1px solid #ebedf0;
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

.mileage-unit, .price-unit {
  color: #969799;
}

.cancel-dialog-content {
  padding: 20px 16px;
  text-align: center;
}
</style>