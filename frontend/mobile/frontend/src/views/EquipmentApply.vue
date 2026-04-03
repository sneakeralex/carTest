<template>
  <div class="equipment-apply">
    <van-nav-bar
      title="设备领用申请"
      left-text="返回"
      left-arrow
      @click-left="router.back()"
    />

    <div class="form-container">
      <van-form @submit="onSubmit">
        <!-- 设备选择 -->
        <van-field
          v-model="equipmentName"
          name="equipment"
          label="申请设备"
          readonly
          is-link
          :rules="[{ required: true, message: '请选择设备' }]"
          @click="showEquipmentPicker = true"
        />

        <!-- 申请类型 -->
        <van-field
          v-model="formData.applyType"
          name="applyType"
          label="申请类型"
          :rules="[{ required: true, message: '请选择申请类型' }]"
        >
          <template #input>
            <van-radio-group v-model="formData.applyType" direction="horizontal">
              <van-radio name="BORROW">借用</van-radio>
              <van-radio name="USE">使用</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <!-- 计划开始时间 -->
        <van-field
          v-model="formData.startTime"
          name="startTime"
          label="开始时间"
          readonly
          is-link
          :rules="[{ required: true, message: '请选择开始时间' }]"
          @click="showStartTimePopup = true"
        />

        <!-- 计划结束时间 -->
        <van-field
          v-model="formData.endTime"
          name="endTime"
          label="结束时间"
          readonly
          is-link
          :rules="[{ required: true, message: '请选择结束时间' }]"
          @click="showEndTimePopup = true"
        />

        <!-- 使用地点 -->
        <van-field
          v-model="formData.location"
          name="location"
          label="使用地点"
          placeholder="请输入使用地点"
          :rules="[{ required: true, message: '请输入使用地点' }]"
        />

        <!-- 申请用途 -->
        <van-field
          v-model="formData.purpose"
          name="purpose"
          label="申请用途"
          type="textarea"
          rows="3"
          autosize
          placeholder="请描述设备用途"
          :rules="[{ required: true, message: '请输入申请用途' }]"
        />

        <!-- 备注 -->
        <van-field
          v-model="formData.remarks"
          name="remarks"
          label="备注"
          type="textarea"
          rows="2"
          autosize
          placeholder="请输入备注信息（选填）"
        />

        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit">
            提交申请
          </van-button>
        </div>
      </van-form>
    </div>

    <!-- 设备选择弹窗 -->
    <van-popup v-model:show="showEquipmentPicker" position="bottom">
      <van-picker
        :columns="equipmentColumns"
        @confirm="onEquipmentConfirm"
        @cancel="showEquipmentPicker = false"
        show-toolbar
        title="选择设备"
      />
    </van-popup>

    <!-- 时间选择弹窗 -->
    <van-popup v-model:show="showStartTimePopup" position="bottom">
      <van-picker
        :columns="timeColumns"
        @confirm="onStartTimeConfirm"
        @cancel="showStartTimePopup = false"
        show-toolbar
        title="选择开始时间"
      />
    </van-popup>

    <van-popup v-model:show="showEndTimePopup" position="bottom">
      <van-picker
        :columns="timeColumns"
        @confirm="onEndTimeConfirm"
        @cancel="showEndTimePopup = false"
        show-toolbar
        title="选择结束时间"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify, showSuccessToast } from 'vant';
import { useEquipmentStore } from '../stores/equipment';
import { formatDateTime } from '@/utils/dateFormatter';

const router = useRouter();
const equipmentStore = useEquipmentStore();

// 表单数据
const formData = ref({
  equipmentId: '',
  applyType: 'BORROW',
  startTime: '',
  endTime: '',
  location: '',
  purpose: '',
  remarks: ''
});

// 设备选择相关
const showEquipmentPicker = ref(false);
const equipmentName = ref('');
const equipments = ref([]);

// 时间选择相关
const showStartTimePopup = ref(false);
const showEndTimePopup = ref(false);
const minDate = new Date();
const maxDate = new Date(minDate.getFullYear() + 1, minDate.getMonth(), minDate.getDate());

// 生成时间选择器列
const generateTimeColumns = () => {
  const days = [];
  let currentDate = new Date(minDate);
  
  while (currentDate <= maxDate) {
    days.push({
      text: formatDateTime(currentDate),
      value: new Date(currentDate)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const hours = Array.from({ length: 24 }, (_, i) => ({
    text: `${String(i).padStart(2, '0')}:00`,
    value: i
  }));

  return [
    { values: days },
    { values: hours }
  ];
};

const timeColumns = computed(() => generateTimeColumns());

// 时间确认处理函数
const onStartTimeConfirm = (values) => {
  const [date, hour] = values;
  const selectedDate = new Date(date.value);
  selectedDate.setHours(hour.value);
  formData.value.startTime = formatDateTime(selectedDate);
  showStartTimePopup.value = false;
};

const onEndTimeConfirm = (values) => {
  const [date, hour] = values;
  const selectedDate = new Date(date.value);
  selectedDate.setHours(hour.value);
  formData.value.endTime = formatDateTime(selectedDate);
  showEndTimePopup.value = false;
};

// 设备选择确认
const onEquipmentConfirm = (item) => {
  formData.value.equipmentId = item.value;
  equipmentName.value = item.text;
  showEquipmentPicker.value = false;
};

// 获取可用设备列表
const fetchEquipments = async () => {
  console.log('🔧 开始获取设备列表...');
  try {
    const data = await equipmentStore.fetchEquipments();
    console.log('✅ equipmentStore.fetchEquipments返回数据:', data);
    console.log('数据类型:', typeof data);
    console.log('是否为数组:', Array.isArray(data));
    console.log('data.records存在:', !!data?.records);
    console.log('data.records类型:', typeof data?.records);
    console.log('data.records长度:', data?.records?.length);
    
    // 处理不同的数据结构
    const records = data?.records || data || [];
    console.log('📋 处理后的records:', records);
    console.log('records长度:', records.length);
    
    if (records.length > 0) {
      console.log('第一个设备样本:', records[0]);
      const statusDistribution = records.reduce((acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      }, {});
      console.log('设备状态分布:', statusDistribution);
    }
    
    equipments.value = records.filter(item => item.status === 'IDLE');
    console.log('🎯 筛选后的空闲设备:', equipments.value);
    console.log('空闲设备数量:', equipments.value.length);
    
    if (equipments.value.length === 0) {
      console.warn('⚠️ 没有找到状态为 IDLE 的设备！');
      console.log('可能的解决方案: 检查mock数据中设备的status字段值');
    }
  } catch (error) {
    console.error('❌ 获取设备列表错误:', error);
    showNotify({ type: 'danger', message: '获取设备列表失败' });
  }
};

// 设备选择列表
const equipmentColumns = computed(() => {
  return equipments.value.map(item => ({
    text: `${item.equipmentName} (${item.equipmentNo})`,
    value: item.equipmentId
  }));
});

// 提交表单
const onSubmit = async (values) => {
  try {
    await equipmentStore.applyEquipment(values);
    showSuccessToast('申请提交成功');
    router.back();
  } catch (error) {
    showNotify({ type: 'danger', message: '提交申请失败' });
  }
};

// 初始化数据
onMounted(fetchEquipments);
</script>

<style lang="less" scoped>
.equipment-apply {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.form-container {
  margin-top: 12px;
}

.submit-btn {
  margin: 16px;
}
</style>
