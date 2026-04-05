<template>
  <div class="new-task">
    <van-nav-bar
      :title="isEditMode ? '编辑实验任务' : '新增实验任务'"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 步骤指示器 -->
    <van-steps :active="currentStep" class="step-indicator">
      <van-step>基本信息</van-step>
      <van-step>委托信息</van-step>
      <van-step>时间安排</van-step>
      <van-step>测试车辆</van-step>
      <van-step>实验内容</van-step>
      <van-step>确认提交</van-step>
    </van-steps>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 基本信息 -->
      <div v-if="currentStep === 0" class="step-section">
        <van-cell-group inset title="基本信息">
          <van-field
            v-model="taskNo"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="任务单号"
            placeholder="点击生成任务单号"
            is-link
            @click="generateTaskNo"
          />
          <van-field
            v-model="username"
            autocomplete="off"
            data-no-ext="true"
            label="创建人姓名"
            placeholder="请输入创建人姓名"
          />
          <van-field
            v-model="userPhone"
            autocomplete="off"
            data-no-ext="true"
            label="创建人联系方式"
            placeholder="请输入创建人联系方式"
          />
        </van-cell-group>
      </div>

      <!-- 步骤2: 委托信息 -->
      <div v-if="currentStep === 1" class="step-section">
        <van-cell-group inset title="委托信息">
          <van-field
            v-model="delegatingEntityNm"
            autocomplete="off"
            data-no-ext="true"
            label="委托企业名称"
            placeholder="请输入委托企业名称"
          />
          <van-field
            v-model="delegationNo"
            autocomplete="off"
            data-no-ext="true"
            label="委托单编号"
            placeholder="请输入委托单编号"
          />
        </van-cell-group>
      </div>

      <!-- 步骤3: 时间安排 -->
      <div v-if="currentStep === 2" class="step-section">
        <van-cell-group inset title="时间安排">
          <van-field
            v-model="plannedStartDate"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="计划开始时间"
            placeholder="请选择计划开始时间"
            is-link
            @click="showStartDatePicker = true"
          />
          <van-field
            v-model="plannedEndDate"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="计划结束时间"
            placeholder="请选择计划结束时间"
            is-link
            @click="showEndDatePicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 步骤4: 测试车辆 -->
      <div v-if="currentStep === 3" class="step-section">
        <van-cell-group inset title="测试车辆">
          <van-cell title="车辆信息" :value="testVehicles.length > 0 ? '已添加 ' + testVehicles.length + ' 辆' : '未添加'" is-link @click="showVehicleDialog = true" />
          <van-field
            v-model="testVehicleCount"
            autocomplete="off"
            data-no-ext="true"
            label="测试车辆数量"
            type="number"
            placeholder="请输入测试车辆数量"
          />
          <van-field
            v-model="participantCount"
            autocomplete="off"
            data-no-ext="true"
            label="参与人数"
            type="number"
            placeholder="请输入参与人数"
          />
        </van-cell-group>
      </div>

      <!-- 步骤5: 实验内容 -->
      <div v-if="currentStep === 4" class="step-section">
        <van-cell-group inset title="实验内容">
          <van-cell title="实验内容" :value="testVehicles.some(v => v.testContents.length > 0) ? '已添加实验内容' : '未添加'" is-link @click="showTestContentDialog = true" />
          <van-field
            v-model="remark"
            autocomplete="off"
            data-no-ext="true"
            label="备注"
            type="textarea"
            placeholder="请输入备注信息（选填）"
            rows="2"
            autosize
          />
        </van-cell-group>
      </div>

      <!-- 步骤6: 确认提交 -->
      <div v-if="currentStep === 5" class="step-section">
        <van-cell-group inset title="任务信息确认">
          <van-cell title="任务单号" :value="taskNo" />
          <van-cell title="创建人姓名" :value="username" />
          <van-cell title="创建人联系方式" :value="userPhone" />
          <van-cell title="委托企业名称" :value="delegatingEntityNm" />
          <van-cell title="委托单编号" :value="delegationNo" />
          <van-cell title="计划开始时间" :value="plannedStartDate" />
          <van-cell title="计划结束时间" :value="plannedEndDate" />
          <van-cell title="测试车辆数量" :value="testVehicleCount" />
          <van-cell title="参与人数" :value="participantCount" />
          <van-cell title="测试车辆" :value="testVehicles.length > 0 ? '已添加' : '未添加'" />
          <van-cell title="实验内容" :value="testVehicles.some(v => v.testContents.length > 0) ? '已添加' : '未添加'" />
          <van-cell title="备注" :value="remark || '无'" />
        </van-cell-group>
      </div>
    </div>

    <!-- 步骤导航按钮 -->
    <div class="step-navigation">
      <van-button 
        v-if="currentStep > 0" 
        @click="prevStep" 
        plain 
        type="primary"
        style="margin-right: 10px;"
      >
        上一步
      </van-button>
      <van-button 
        v-if="currentStep < 5" 
        @click="nextStep" 
        type="primary"
        :disabled="!canProceed"
      >
        下一步
      </van-button>
      <van-button 
        v-if="currentStep === 5" 
        @click="onSubmit" 
        type="primary" 
        :loading="submitting"
        :disabled="!canSubmit"
      >
        提交任务
      </van-button>
    </div>

    <!-- 开始日期选择器 -->
    <van-popup
      v-model:show="showStartDatePicker"
      position="bottom"
      round
    >
      <van-date-picker
        :model-value="currentStartDate"
        type="date"
        title="选择计划开始时间"
        :min-date="minDate"
        @confirm="onStartDateSelect"
        @cancel="showStartDatePicker = false"
      />
    </van-popup>

    <!-- 结束日期选择器 -->
    <van-popup
      v-model:show="showEndDatePicker"
      position="bottom"
      round
    >
      <van-date-picker
        :model-value="currentEndDate"
        type="date"
        title="选择计划结束时间"
        :min-date="plannedStartDate ? new Date(plannedStartDate) : minDate"
        @confirm="onEndDateSelect"
        @cancel="showEndDatePicker = false"
      />
    </van-popup>

    <!-- 车辆信息对话框 -->
    <van-popup
      v-model:show="showVehicleDialog"
      position="right"
      :style="{ width: '80%' }"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>测试车辆信息</h3>
          <van-icon name="close" @click="showVehicleDialog = false" />
        </div>
        <div class="dialog-body">
          <van-field
            v-model="newVehicle.vin"
            autocomplete="off"
            data-no-ext="true"
            label="车辆VIN"
            placeholder="请输入车辆VIN"
          />
          <van-field
            v-model="newVehicle.vehicleColor"
            autocomplete="off"
            data-no-ext="true"
            label="车辆颜色"
            placeholder="请输入车辆颜色"
          />
          <van-button type="primary" @click="addVehicle">添加车辆</van-button>
          <div class="vehicle-list">
            <div v-for="(vehicle, index) in testVehicles" :key="index" class="vehicle-item">
              <div class="vehicle-info">
                <div>车辆VIN: {{ vehicle.vin }}</div>
                <div>颜色: {{ vehicle.vehicleColor || '未设置' }}</div>
                <div>实验内容: {{ vehicle.testContents.length }} 项</div>
              </div>
              <div class="vehicle-actions">
                <van-button size="small" @click="editVehicle(index)">编辑</van-button>
                <van-button size="small" type="danger" @click="removeVehicle(index)">删除</van-button>
                <van-button size="small" type="primary" @click="addTestContent(index)">添加实验内容</van-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 实验内容对话框 -->
    <van-popup
      v-model:show="showTestContentDialog"
      position="right"
      :style="{ width: '80%' }"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>实验内容</h3>
          <van-icon name="close" @click="showTestContentDialog = false" />
        </div>
        <div class="dialog-body">
          <div v-for="(vehicle, vehicleIndex) in testVehicles" :key="vehicleIndex" class="vehicle-section">
            <h4>车辆 {{ vehicleIndex + 1 }}: {{ vehicle.vin }}</h4>
            <div v-for="(content, contentIndex) in vehicle.testContents" :key="contentIndex" class="test-content-item">
              <div class="content-info">
                <div>场地分区: {{ content.provingGroundNm }}</div>
                <div>场地: {{ content.groundNm }}</div>
                <div>实验类型: {{ content.testTypeId === '1' ? '自驾试验' : 'V2X试验' }}</div>
                <div>计费类型: {{ content.billingTypeId === '1' ? '分时' : content.billingTypeId === '3' ? '包场' : '按天' }}</div>
                <div>实验内容: {{ content.testItemName }}</div>
              </div>
              <van-button size="small" type="danger" @click="removeTestContent(vehicleIndex, contentIndex)">删除</van-button>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 添加实验内容对话框 -->
    <van-popup
      v-model:show="showAddTestContentDialog"
      position="bottom"
      round
      :style="{ height: '80%' }"
    >
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>添加实验内容</h3>
          <van-icon name="close" @click="showAddTestContentDialog = false" />
        </div>
        <div class="dialog-body">
          <van-field
            v-model="newTestContent.provingGroundId"
            autocomplete="off"
            data-no-ext="true"
            label="场地分区ID"
            placeholder="请输入场地分区ID"
          />
          <van-field
            v-model="newTestContent.provingGroundNm"
            autocomplete="off"
            data-no-ext="true"
            label="场地分区名称"
            placeholder="请输入场地分区名称"
          />
          <van-field
            v-model="newTestContent.groundId"
            autocomplete="off"
            data-no-ext="true"
            label="场地ID"
            placeholder="请输入场地ID"
          />
          <van-field
            v-model="newTestContent.groundNm"
            autocomplete="off"
            data-no-ext="true"
            label="场地名称"
            placeholder="请输入场地名称"
          />
          <van-field
            v-model="newTestContent.testTypeId"
            autocomplete="off"
            data-no-ext="true"
            label="实验类型"
            placeholder="1-自驾试验/7-V2X试验"
          />
          <van-field
            v-model="newTestContent.billingTypeId"
            autocomplete="off"
            data-no-ext="true"
            label="计费类型"
            placeholder="1-分时/3-包场/4-按天"
          />
          <van-field
            v-model="newTestContent.testItemName"
            autocomplete="off"
            data-no-ext="true"
            label="实验内容"
            placeholder="请输入实验内容"
          />
          <van-button type="primary" @click="confirmAddTestContent">添加实验内容</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { showToast } from 'vant';
import { useTestTaskStore } from '../stores/testTask';
import { getTaskManagementNo, getTaskManagementNoByContract, createTask, updateTask } from '../api/testTask';
import { TEST_TASK_API } from '../api/config';
import { getItem } from '../utils/storage.js';
import { artemisRequest } from '../api/request';

// 路由
const router = useRouter();
const route = useRoute();

// 状态
const isEditMode = ref(false);
const taskNo = ref('');
const delegatingEntityId = ref('1');
const delegatingEntityNm = ref('');
const productionUnitId = ref('0');
const productionUnitNm = ref('');
const delegationNo = ref('');
const username = ref('');
const userId = ref('');
const userPhone = ref('');
const plannedStartDate = ref('');
const plannedEndDate = ref('');
const testVehicleCount = ref('0');
const participantCount = ref('0');
const accommodationStatus = ref('0');
const status = ref('1');
const diningStatus = ref('0');
const driverRental = ref('0');
const laborEmployment = ref('0');
const equipmentRental = ref('0');
const confidentialWorkshopRental = ref('0');
const imagingRequirement = ref('0');
const remark = ref('');
const testVehicles = ref([]);
const submitting = ref(false);
const generatingTaskNo = ref(false);

// 步骤状态
const currentStep = ref(0);

// 日期选择器状态
const showStartDatePicker = ref(false);
const showEndDatePicker = ref(false);
const currentStartDate = ref([]);
const currentEndDate = ref([]);
const minDate = new Date();

// 对话框状态
const showVehicleDialog = ref(false);
const showTestContentDialog = ref(false);
const showAddTestContentDialog = ref(false);

// 新车辆信息
const newVehicle = ref({
  vin: '',
  vehicleColor: '',
  maxMass: 0,
  topSpeed: 0,
  passengerCapacity: 0,
  refueled: 0,
  charged: 0,
  testContents: []
});

// 新实验内容
const newTestContent = ref({
  provingGroundId: '3',
  provingGroundNm: '三期',
  groundId: '1',
  groundNm: '直线性能路',
  testTypeId: '7',
  billingTypeId: '1',
  testItemName: '',
  plannedQuantity: 0,
  nightTesting: 0,
  remark: ''
});

// 当前编辑的车辆索引
const currentVehicleIndex = ref(-1);

// testTaskStore
const testTaskStore = useTestTaskStore();

// 生成任务单号
const generateTaskNo = async () => {
  if (taskNo.value) return taskNo.value;
  
  try {
    generatingTaskNo.value = true;
    console.log('开始生成任务单号...');
    
    // 检查网络连接状态
    if (!navigator.onLine) {
      throw new Error('网络连接不可用');
    }
    
    // 如果有委托单编号，使用委托单编号生成任务单号
    if (delegationNo.value) {
      const response = await getTaskManagementNoByContract(delegationNo.value);
      taskNo.value = response.data;
    } else {
      // 否则生成普通任务单号
      const response = await getTaskManagementNo();
      taskNo.value = response.data;
    }
    
    console.log('任务单号生成成功:', taskNo.value);
    showToast({ type: 'success', message: '任务单号生成成功' });
    return taskNo.value;
  } catch (error) {
    console.error('获取任务单号失败:', error);
    
    // 根据错误类型显示不同的提示
    let errorMessage = '获取任务单号失败，已生成本地编号';
    if (error.message.includes('网络连接不可用')) {
      errorMessage = '网络连接不可用，已生成本地编号';
    } else if (error.message.includes('Failed to fetch')) {
      errorMessage = '网络请求失败，已生成本地编号';
    }
    
    showToast({ 
      type: 'warning', 
      message: errorMessage,
      duration: 3000
    });
    
    // 生成本地任务单号
    const localTaskNo = `DQ-GT-LOCAL-${Date.now()}`;
    taskNo.value = localTaskNo;
    console.log('使用本地生成的任务单号:', localTaskNo);
    return localTaskNo;
  } finally {
    generatingTaskNo.value = false;
  }
};

// 步骤导航逻辑
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 0: return !!username.value && !!userPhone.value;
    case 1: return !!delegatingEntityNm.value && !!delegationNo.value;
    case 2: return !!plannedStartDate.value && !!plannedEndDate.value;
    case 3: return testVehicles.value.length > 0 && !!testVehicleCount.value && !!participantCount.value;
    case 4: return testVehicles.some(v => v.testContents.length > 0);
    case 5: return true;
    default: return false;
  }
});

// 提交按钮的验证逻辑
const canSubmit = computed(() => {
  // 检查所有必填字段是否完整
  const allFieldsValid = 
    !!taskNo.value &&
    !!delegatingEntityNm.value &&
    !!delegationNo.value &&
    !!username.value &&
    !!userPhone.value &&
    !!plannedStartDate.value &&
    !!plannedEndDate.value &&
    !!testVehicleCount.value &&
    !!participantCount.value &&
    testVehicles.value.length > 0 &&
    testVehicles.some(v => v.testContents.length > 0);

  return allFieldsValid && !generatingTaskNo.value;
});

const nextStep = async () => {
  if (currentStep.value < 5 && canProceed.value) {
    currentStep.value++;
    
    // 如果进入步骤6（确认提交）且不是编辑模式，则生成任务单号
    if (currentStep.value === 5 && !isEditMode.value) {
      await generateTaskNo();
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 处理开始日期选择
const onStartDateSelect = (date) => {
  let dateArray = date;
  if (date && typeof date === 'object' && date.selectedValues) {
    dateArray = date.selectedValues;
  }
  
  if (Array.isArray(dateArray) && dateArray.length === 3) {
    const [year, month, day] = dateArray;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    plannedStartDate.value = formattedDate;
    currentStartDate.value = dateArray;
  }
  showStartDatePicker.value = false;
};

// 处理结束日期选择
const onEndDateSelect = (date) => {
  let dateArray = date;
  if (date && typeof date === 'object' && date.selectedValues) {
    dateArray = date.selectedValues;
  }
  
  if (Array.isArray(dateArray) && dateArray.length === 3) {
    const [year, month, day] = dateArray;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    plannedEndDate.value = formattedDate;
    currentEndDate.value = dateArray;
  }
  showEndDatePicker.value = false;
};

// 添加车辆
const addVehicle = () => {
  if (!newVehicle.value.vin) {
    showToast({ type: 'fail', message: '请输入车辆VIN' });
    return;
  }
  
  testVehicles.value.push({
    ...newVehicle.value,
    testContents: []
  });
  
  // 重置新车辆信息
  newVehicle.value = {
    vin: '',
    vehicleColor: '',
    maxMass: 0,
    topSpeed: 0,
    passengerCapacity: 0,
    refueled: 0,
    charged: 0,
    testContents: []
  };
  
  showToast({ type: 'success', message: '车辆添加成功' });
};

// 编辑车辆
const editVehicle = (index) => {
  currentVehicleIndex.value = index;
  newVehicle.value = { ...testVehicles.value[index] };
  // 这里可以添加编辑逻辑
};

// 删除车辆
const removeVehicle = (index) => {
  testVehicles.value.splice(index, 1);
  showToast({ type: 'success', message: '车辆删除成功' });
};

// 添加实验内容
const addTestContent = (vehicleIndex) => {
  currentVehicleIndex.value = vehicleIndex;
  showAddTestContentDialog.value = true;
};

// 确认添加实验内容
const confirmAddTestContent = () => {
  if (!newTestContent.value.provingGroundId || !newTestContent.value.provingGroundNm || 
      !newTestContent.value.groundId || !newTestContent.value.groundNm || !newTestContent.value.testTypeId || 
      !newTestContent.value.billingTypeId || !newTestContent.value.testItemName) {
    showToast({ type: 'fail', message: '请填写所有必填字段' });
    return;
  }
  
  if (currentVehicleIndex.value >= 0 && currentVehicleIndex.value < testVehicles.value.length) {
    testVehicles.value[currentVehicleIndex.value].testContents.push({ ...newTestContent.value });
    showToast({ type: 'success', message: '实验内容添加成功' });
    showAddTestContentDialog.value = false;
    
    // 重置新实验内容
    newTestContent.value = {
      provingGroundId: '3',
      provingGroundNm: '三期',
      groundId: '1',
      groundNm: '直线性能路',
      testTypeId: '7',
      billingTypeId: '1',
      testItemName: '',
      plannedQuantity: 0,
      nightTesting: 0,
      remark: ''
    };
  }
};

// 删除实验内容
const removeTestContent = (vehicleIndex, contentIndex) => {
  if (vehicleIndex >= 0 && vehicleIndex < testVehicles.value.length &&
      contentIndex >= 0 && contentIndex < testVehicles.value[vehicleIndex].testContents.length) {
    testVehicles.value[vehicleIndex].testContents.splice(contentIndex, 1);
    showToast({ type: 'success', message: '实验内容删除成功' });
  }
};

// 表单提交
const onSubmit = async () => {
  try {
    submitting.value = true;

    // 从用户信息获取用户ID
    const userInfo = getItem('user', {});
    const userIdValue = userInfo?.userId || userInfo?.id || '1';

    const taskData = {
      taskNo: taskNo.value,
      delegatingEntityId: delegatingEntityId.value,
      delegatingEntityNm: delegatingEntityNm.value,
      productionUnitId: productionUnitId.value,
      productionUnitNm: productionUnitNm.value,
      delegationNo: delegationNo.value,
      username: username.value,
      userId: userIdValue,
      userPhone: userPhone.value,
      plannedStartDate: plannedStartDate.value,
      plannedEndDate: plannedEndDate.value,
      testVehicleCount: parseInt(testVehicleCount.value) || 0,
      participantCount: parseInt(participantCount.value) || 0,
      accommodationStatus: accommodationStatus.value,
      status: status.value,
      diningStatus: diningStatus.value,
      driverRental: driverRental.value,
      laborEmployment: laborEmployment.value,
      equipmentRental: equipmentRental.value,
      confidentialWorkshopRental: confidentialWorkshopRental.value,
      imagingRequirement: imagingRequirement.value,
      remark: remark.value,
      testVehicles: testVehicles.value
    };

    console.log('提交的任务数据:', JSON.stringify(taskData, null, 2));

    let result;
    if (isEditMode.value) {
      // 编辑模式，调用更新API
      const res = await updateTask(taskData);
      result = res.data;
    } else {
      // 创建模式，调用创建API
      const res = await createTask(taskData);
      result = res.data;
    }

    if (result && (result.code === 200 || result.status === 200 || result.code === '0')) {
      showToast({ type: 'success', message: isEditMode.value ? '任务更新成功' : '任务提交成功' });
      router.push('/test-tasks');
    } else {
      throw new Error(result?.msg || (isEditMode.value ? '任务更新失败' : '任务提交失败'));
    }
  } catch (error) {
    showToast({ type: 'fail', message: error.message || (isEditMode.value ? '任务更新失败' : '任务提交失败') });
  } finally {
    submitting.value = false;
  }
};

// 填充表单数据
const fillFormData = (taskData) => {
  if (!taskData) return;
  
  isEditMode.value = true;
  taskNo.value = taskData.taskNo || '';
  delegatingEntityId.value = taskData.delegatingEntityId || '1';
  delegatingEntityNm.value = taskData.delegatingEntityNm || '';
  productionUnitId.value = taskData.productionUnitId || '0';
  productionUnitNm.value = taskData.productionUnitNm || '';
  delegationNo.value = taskData.delegationNo || '';
  username.value = taskData.username || '';
  userId.value = taskData.userId || '';
  userPhone.value = taskData.userPhone || '';
  plannedStartDate.value = taskData.plannedStartDate || '';
  plannedEndDate.value = taskData.plannedEndDate || '';
  testVehicleCount.value = taskData.testVehicleCount?.toString() || '0';
  participantCount.value = taskData.participantCount?.toString() || '0';
  accommodationStatus.value = taskData.accommodationStatus?.toString() || '0';
  status.value = taskData.status?.toString() || '1';
  diningStatus.value = taskData.diningStatus?.toString() || '0';
  driverRental.value = taskData.driverRental?.toString() || '0';
  laborEmployment.value = taskData.laborEmployment?.toString() || '0';
  equipmentRental.value = taskData.equipmentRental?.toString() || '0';
  confidentialWorkshopRental.value = taskData.confidentialWorkshopRental?.toString() || '0';
  imagingRequirement.value = taskData.imagingRequirement?.toString() || '0';
  remark.value = taskData.remark || '';
  
  // 处理测试车辆数据
  if (taskData.testVehicles && Array.isArray(taskData.testVehicles)) {
    testVehicles.value = taskData.testVehicles.map(vehicle => ({
      vin: vehicle.vin || '',
      vehicleColor: vehicle.vehicleColor || '',
      maxMass: vehicle.maxMass || 0,
      topSpeed: vehicle.topSpeed || 0,
      passengerCapacity: vehicle.passengerCapacity || 0,
      refueled: vehicle.refueled || 0,
      charged: vehicle.charged || 0,
      testContents: (vehicle.testContents || []).map(content => ({
        provingGroundId: content.provingGroundId || '',
        provingGroundNm: content.provingGroundNm || '',
        groundId: content.groundId || '',
        groundNm: content.groundNm || '',
        testTypeId: content.testTypeId || '',
        billingTypeId: content.billingTypeId || 1,
        testItemName: content.testItemName || '',
        plannedQuantity: content.plannedQuantity || 0,
        nightTesting: content.nightTesting || 0,
        remark: content.remark || ''
      }))
    }));
  }
};

// 初始化
onMounted(async () => {
  try {
    showToast({
      type: 'loading',
      message: '正在加载数据...',
      duration: 0,
      forbidClick: true
    });

    // 获取当前用户信息
    const userInfo = getItem('user', {});
    const userIdValue = userInfo?.userId || userInfo?.id;
    const userName = userInfo?.userName || userInfo?.name;
    if (userIdValue) {
      userId.value = userIdValue;
      username.value = userName || 'admin';
    }

    // 检查是否是编辑模式
    if (route.params?.taskData) {
      // 从路由参数获取任务数据
      try {
        const taskData = JSON.parse(decodeURIComponent(route.params.taskData));
        fillFormData(taskData);
      } catch (e) {
        console.error('解析任务数据失败:', e);
      }
    }

    showToast({
      type: 'success',
      message: '数据加载完成',
      duration: 2000
    });
  } catch (error) {
    console.error('加载数据失败:', error);
    showToast({ 
      type: 'fail', 
      message: '获取数据失败', 
      duration: 3000 
    });
  }
});
</script>

<style lang="less" scoped>
.new-task {
  padding-bottom: 20px;
  
  .step-indicator {
    margin: 16px;
  }

  .step-content {
    min-height: 400px;
  }

  .step-section {
    animation: fadeIn 0.3s ease-in-out;
  }

  .step-navigation {
    display: flex;
    justify-content: center;
    padding: 16px;
    gap: 10px;
  }

  .van-cell-group {
    margin: 12px 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dialog-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .dialog-body {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
}

.vehicle-list {
  margin-top: 20px;
  
  .vehicle-item {
    padding: 12px;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
    margin-bottom: 10px;
    
    .vehicle-info {
      margin-bottom: 10px;
    }
    
    .vehicle-actions {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }
}

.vehicle-section {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
  
  h4 {
    margin: 0 0 10px 0;
  }
  
  .test-content-item {
    padding: 10px;
    border: 1px solid #e8f4ff;
    border-radius: 8px;
    margin-bottom: 10px;
    
    .content-info {
      margin-bottom: 10px;
    }
  }
}
</style>
