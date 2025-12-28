<template>
  <div class="new-test-task">
    <van-nav-bar
      title="创建测试任务"
      left-arrow
      @click-left="$router.back()"
    />

    <van-form @submit="onSubmit">
      <!-- 基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-field
          v-model="formData.taskName"
          name="taskName"
          label="任务名称"
          placeholder="请输入任务名称"
          :rules="[{ required: true, message: '请输入任务名称' }]"
        />
        <van-field
          v-model="formData.description"
          name="description"
          label="任务描述"
          type="textarea"
          rows="3"
          placeholder="请输入任务描述"
        />
        <van-field
          v-model="formData.department"
          name="department"
          label="任务单位"
          placeholder="请输入任务单位"
          :rules="[{ required: true, message: '请输入任务单位' }]"
        />
        <van-field
          v-model="formData.testType"
          name="testType"
          label="测试类型"
          :placeholder="formData.testType || '请选择测试类型'"
          readonly
          is-link
          @click="showTestTypePopup = true"
          :rules="[{ required: true, message: '请选择测试类型' }]"
        >
          <template #input>
            <span>{{ formData.testType ? getTestTypeText(formData.testType) : '请选择测试类型' }}</span>
          </template>
        </van-field>
        <van-field
          v-model="formData.experimentType"
          name="experimentType"
          label="试验类型"
          :placeholder="formData.experimentType || '请选择试验类型'"
          readonly
          is-link
          @click="showExperimentTypePopup = true"
          :rules="[{ required: true, message: '请选择试验类型' }]"
        >
          <template #input>
            <span>{{ formData.experimentType ? getTestTypeText(formData.experimentType) : '请选择试验类型' }}</span>
          </template>
        </van-field>
        <van-field
          v-model="formData.difficulty"
          name="difficulty"
          label="难度等级"
          :placeholder="formData.difficulty || '请选择难度等级'"
          readonly
          is-link
          @click="showDifficultyPopup = true"
          :rules="[{ required: true, message: '请选择难度等级' }]"
        >
          <template #input>
            <span>{{ formData.difficulty ? getDifficultyText(formData.difficulty) : '请选择难度等级' }}</span>
          </template>
        </van-field>
      </van-cell-group>

      <!-- 时间信息 -->
      <van-cell-group inset title="时间信息">
        <van-cell title="测试时间" is-link @click="showDatePicker = true">
          <template #value>
            <span v-if="formData.startDate && formData.endDate">
              {{ formData.startDate }} 至 {{ formData.endDate }}
            </span>
            <span v-else>请选择测试时间</span>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 车辆信息 -->
      <van-cell-group inset title="车辆信息">
        <van-field
          v-model="selectedVehiclesText"
          name="vehicles"
          label="测试车辆"
          placeholder="请选择测试车辆"
          readonly
          is-link
          @click="showVehicleSelector = true"
          :rules="[{ required: true, message: '请至少选择一辆测试车辆' }]"
        />
      </van-cell-group>

      <!-- 试验内容 -->
      <van-cell-group inset title="试验内容">
        <template v-for="(vehicle, index) in selectedVehicles" :key="vehicle.id">
          <div class="vehicle-test-content">
            <van-cell :title="vehicle.name" />
            <van-field
              v-model="vehicleTestContents[vehicle.id]"
              type="textarea"
              rows="3"
              :placeholder="'请输入' + vehicle.name + '的试验内容'"
              :rules="[{ required: true, message: '请输入试验内容' }]"
            />
          </div>
        </template>
      </van-cell-group>

      <!-- 基础配置 -->
      <van-cell-group inset title="基础配置">
        <van-field
          v-model="formData.testSite"
          name="testSite"
          label="测试地点"
          placeholder="请选择测试地点"
          readonly
          is-link
          :rules="[{ required: true, message: '请选择测试地点' }]"
          @click="showTestSitePopup = true"
        />
        <van-field
          v-model="formData.maxParticipants"
          name="maxParticipants"
          label="最大参与人数"
          type="digit"
          placeholder="请输入最大参与人数"
          :rules="[{ required: true, message: '请输入最大参与人数' }]"
        />
        <van-field
          v-model="formData.estimatedDuration"
          name="estimatedDuration"
          label="预计时长"
          type="digit"
          placeholder="请输入预计时长（小时）"
          :rules="[{ required: true, message: '请输入预计时长' }]"
        />
      </van-cell-group>

      <!-- 合同信息 -->
      <van-cell-group inset title="合同信息">
        <van-field
          v-model="formData.contractInfo.contractNumber"
          name="contractNumber"
          label="合同编号"
          placeholder="请输入合同编号"
        />
        <van-field
          v-model="formData.contractInfo.client"
          name="client"
          label="委托方"
          placeholder="请输入委托方"
        />
        <van-field
          v-model="formData.fee"
          name="fee"
          label="费用"
          type="digit"
          placeholder="请输入费用（元）"
        />
      </van-cell-group>

      <!-- 设备要求 -->
      <van-cell-group inset title="设备要求">
        <template v-for="(equipment, index) in formData.equipment" :key="index">
          <van-field
            v-model="formData.equipment[index]"
            :label="'设备' + (index + 1)"
            placeholder="请输入设备要求"
            :rules="[{ required: true, message: '请输入设备要求' }]"
          >
            <template #right-icon>
              <van-icon 
                name="cross" 
                @click="removeEquipment(index)"
                style="cursor: pointer;"
              />
            </template>
          </van-field>
        </template>
        <div style="padding: 10px 16px;">
          <van-button 
            size="small" 
            type="primary" 
            plain 
            block 
            @click="addEquipment"
          >
            添加设备要求
          </van-button>
        </div>
      </van-cell-group>

      <!-- 任务要求 -->
      <van-cell-group inset title="任务要求">
        <template v-for="(requirement, index) in formData.requirements" :key="index">
          <van-field
            v-model="formData.requirements[index]"
            :label="'要求' + (index + 1)"
            type="textarea"
            rows="2"
            placeholder="请输入任务要求"
            :rules="[{ required: true, message: '请输入任务要求' }]"
          >
            <template #right-icon>
              <van-icon 
                name="cross" 
                @click="removeRequirement(index)"
                style="cursor: pointer;"
              />
            </template>
          </van-field>
        </template>
        <div style="padding: 10px 16px;">
          <van-button 
            size="small" 
            type="primary" 
            plain 
            block 
            @click="addRequirement"
          >
            添加任务要求
          </van-button>
        </div>
      </van-cell-group>

      <!-- 备注说明 -->
      <van-cell-group inset title="备注说明">
        <template v-for="(note, index) in formData.notes" :key="index">
          <van-field
            v-model="formData.notes[index]"
            :label="'备注' + (index + 1)"
            type="textarea"
            rows="2"
            placeholder="请输入备注说明"
          >
            <template #right-icon>
              <van-icon 
                name="cross" 
                @click="removeNote(index)"
                style="cursor: pointer;"
              />
            </template>
          </van-field>
        </template>
        <div style="padding: 10px 16px;">
          <van-button 
            size="small" 
            type="primary" 
            plain 
            block 
            @click="addNote"
          >
            添加备注说明
          </van-button>
        </div>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" :loading="submitting">
          提交
        </van-button>
      </div>
    </van-form>

    <!-- 测试类型选择弹窗 -->
    <van-popup v-model:show="showTestTypePopup" position="bottom">
      <van-picker
        :columns="testTypeOptions"
        @confirm="onTestTypeConfirm"
        @cancel="showTestTypePopup = false"
        show-toolbar
        title="选择测试类型"
      />
    </van-popup>

    <!-- 试验类型选择弹窗 -->
    <van-popup v-model:show="showExperimentTypePopup" position="bottom">
      <van-picker
        :columns="experimentTypeOptions"
        @confirm="onExperimentTypeConfirm"
        @cancel="showExperimentTypePopup = false"
        show-toolbar
        title="选择试验类型"
      />
    </van-popup>

    <!-- 难度等级选择弹窗 -->
    <van-popup v-model:show="showDifficultyPopup" position="bottom">
      <van-picker
        :columns="difficultyOptions"
        @confirm="onDifficultyConfirm"
        @cancel="showDifficultyPopup = false"
        show-toolbar
        title="选择难度等级"
      />
    </van-popup>

    <!-- 日期选择弹窗 -->
    <van-popup v-model:show="showDatePicker" position="bottom" style="height: 70%">
      <van-calendar
        type="range"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @close="showDatePicker = false"
        title="选择测试时间"
        :show-confirm="true"
      />
    </van-popup>

    <!-- 车辆选择弹窗 -->
    <van-popup v-model:show="showVehicleSelector" position="bottom" style="height: 70%">
      <van-nav-bar
        title="选择测试车辆"
        left-text="取消"
        right-text="确定"
        @click-left="showVehicleSelector = false"
        @click-right="onVehicleConfirm"
      />
      <div class="vehicle-selector">
        <van-checkbox-group v-model="selectedVehicleIds">
          <van-cell-group>
            <van-cell
              v-for="vehicle in availableVehicles"
              :key="vehicle.id"
              :title="vehicle.name"
              clickable
              @click="toggleVehicle(vehicle.id)"
            >
              <template #right-icon>
                <van-checkbox
                  :name="vehicle.id"
                  @click.stop
                />
              </template>
            </van-cell>
          </van-cell-group>
        </van-checkbox-group>
      </div>
    </van-popup>

    <!-- 测试场地选择弹窗 -->
    <van-popup v-model:show="showTestSitePopup" position="bottom">
      <van-picker
        :columns="availableTestSites"
        @confirm="onTestSiteConfirm"
        @cancel="showTestSitePopup = false"
        show-toolbar
        title="选择测试场地"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useVehicleStore } from '@/stores/vehicle';
import { useTestTaskStore } from '@/stores/testTask';
import { useTestSiteStore } from '@/stores/testSite';
import { showToast } from 'vant';
import { formatDate } from '../utils/dateFormatter';
import { getTestTypeText, getDifficultyText } from '../utils/typeFormatter';

const router = useRouter();
const vehicleStore = useVehicleStore();
const testTaskStore = useTestTaskStore();
const testSiteStore = useTestSiteStore();

// 表单数据
const formData = ref({
  taskName: '',
  description: '',
  department: '',
  testType: '',
  experimentType: '',
  difficulty: '',
  startDate: '',
  endDate: '',
  testSite: '',  // 存储选中的测试场地名称
  testSiteId: '', // 存储选中的测试场地ID
  maxParticipants: '',
  requirements: [], // 改为数组以存储多个要求
  fee: 0,
  estimatedDuration: '',
  equipment: [], // 设备要求列表
  notes: [], // 备注说明列表
  contractInfo: {
    contractNumber: '', // 合同编号
    client: '' // 委托方
  }
});

// 状态变量
const submitting = ref(false);
const showTestTypePopup = ref(false);
const showExperimentTypePopup = ref(false);
const showDifficultyPopup = ref(false);
const showDatePicker = ref(false);
const showVehicleSelector = ref(false);
const showTestSitePopup = ref(false);
const selectedVehicleIds = ref([]);
const vehicleTestContents = ref({}); // 存储每个车辆的试验内容

// 添加/删除设备要求
const addEquipment = () => {
  formData.value.equipment.push('');
};

const removeEquipment = (index) => {
  formData.value.equipment.splice(index, 1);
};

// 添加/删除任务要求
const addRequirement = () => {
  formData.value.requirements.push('');
};

const removeRequirement = (index) => {
  formData.value.requirements.splice(index, 1);
};

// 添加/删除备注说明
const addNote = () => {
  formData.value.notes.push('');
};

const removeNote = (index) => {
  formData.value.notes.splice(index, 1);
};

// 测试场地列表
const availableTestSites = ref([]);

// 测试类型选项 - 修正为Vant4.x格式
const testTypes = ['CRASH_TEST', 'DURABILITY_TEST', 'PERFORMANCE_TEST', 'NOISE_TEST', 'BRAKE_TEST'];
const testTypeOptions = testTypes.map(type => ({
  text: getTestTypeText(type),
  value: type
}));

// 试验类型选项
const experimentTypes = [...testTypes]; // 目前使用相同的类型列表
const experimentTypeOptions = experimentTypes.map(type => ({
  text: getTestTypeText(type),
  value: type
}));

// 难度等级选项
const difficultyLevels = ['EASY', 'MEDIUM', 'HARD'];
const difficultyOptions = difficultyLevels.map(level => ({
  text: getDifficultyText(level),
  value: level
}));

// 日期选择器配置
const currentDate = new Date();
const minDate = new Date();
const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

// 加载可用车辆列表
const availableVehicles = ref([]);
const loadVehicles = async () => {
  try {
    await vehicleStore.fetchVehicles();
    availableVehicles.value = vehicleStore.vehicles.map(v => ({
      id: v.vehicleId,
      name: `${v.brand} ${v.model}`,
      type: v.type
    }));
  } catch (error) {
    console.error('加载车辆列表失败:', error);
    showToast('加载车辆列表失败');
  }
};

// 已选择的车辆列表
const selectedVehicles = computed(() => {
  return availableVehicles.value.filter(v => selectedVehicleIds.value.includes(v.id))
    .map(v => ({
      ...v,
      testContent: vehicleTestContents.value[v.id] || ''
    }));
});

// 已选择的车辆文本显示
const selectedVehiclesText = computed(() => {
  if (selectedVehicles.value.length === 0) return '';
  return selectedVehicles.value.map(v => v.name).join('、');
});

// 测试类型选择确认
const onTestTypeConfirm = ({ selectedValues, selectedOptions }) => {
  console.log('测试类型选择的值:', { selectedValues, selectedOptions });
  // 获取选中的值
  const selectedValue = selectedValues[0];
  formData.value.testType = selectedValue;
  showTestTypePopup.value = false;
};

// 试验类型选择确认
const onExperimentTypeConfirm = ({ selectedValues, selectedOptions }) => {
  console.log('试验类型选择的值:', { selectedValues, selectedOptions });
  const selectedValue = selectedValues[0];
  formData.value.experimentType = selectedValue;
  showExperimentTypePopup.value = false;
};

// 难度等级选择确认
const onDifficultyConfirm = ({ selectedValues, selectedOptions }) => {
  console.log('难度等级选择的值:', { selectedValues, selectedOptions });
  const selectedValue = selectedValues[0];
  formData.value.difficulty = selectedValue;
  showDifficultyPopup.value = false;
};

// 日期选择确认
const onDateConfirm = ({ selectedValues }) => {
  console.log('日期选择的值:', selectedValues);
  
  // 检查值是否有效
  if (!selectedValues) {
    console.warn('日期选择值为空');
    showToast('请选择有效日期');
    return;
  }
  
  // van-calendar range 模式返回 [startDate, endDate] 数组
  if (Array.isArray(selectedValues)) {
    if (selectedValues.length === 2 && selectedValues[0] && selectedValues[1]) {
      // 日期范围选择
      const [start, end] = selectedValues;
      formData.value.startDate = formatDate(start);
      formData.value.endDate = formatDate(end);
    } else if (selectedValues.length === 1 && selectedValues[0]) {
      // 单日期在数组中
      formData.value.startDate = formatDate(selectedValues[0]);
      formData.value.endDate = formatDate(selectedValues[0]);
    } else {
      console.warn('日期数组格式不正确:', selectedValues);
      showToast('日期选择格式错误');
      return;
    }
  } else if (selectedValues instanceof Date || (typeof selectedValues === 'object' && selectedValues.getTime)) {
    // 单个日期对象
    formData.value.startDate = formatDate(selectedValues);
    formData.value.endDate = formatDate(selectedValues);
  } else {
    console.warn('未知的日期格式:', selectedValues);
    showToast('日期格式不支持');
    return;
  }
  
  // 验证日期是否有效
  if (!formData.value.startDate || formData.value.startDate.includes('NaN')) {
    console.warn('日期格式化失败');
    showToast('日期格式无效');
    formData.value.startDate = '';
    formData.value.endDate = '';
    return;
  }
  
  showDatePicker.value = false;
};

// 车辆选择确认
const onVehicleConfirm = () => {
  showVehicleSelector.value = false;
};

// 切换车辆选择
const toggleVehicle = (vehicleId) => {
  const index = selectedVehicleIds.value.indexOf(vehicleId);
  if (index > -1) {
    // 移除车辆时也清理其试验内容
    selectedVehicleIds.value.splice(index, 1);
    delete vehicleTestContents.value[vehicleId];
  } else {
    selectedVehicleIds.value.push(vehicleId);
    // 添加车辆时初始化试验内容
    vehicleTestContents.value[vehicleId] = '';
  }
};

// 表单提交
const onSubmit = async () => {
  // 检查所有选中的车辆是否都填写了试验内容
  const missingContent = selectedVehicleIds.value.some(vehicleId => {
    const content = vehicleTestContents.value[vehicleId];
    return !content || !content.trim();
  });
  
  if (missingContent) {
    showToast('请填写所有车辆的试验内容');
    return;
  }

  try {
    submitting.value = true;
    
    const taskData = {
      title: formData.value.taskName,
      taskName: formData.value.taskName,
      description: formData.value.description,
      department: formData.value.department,
      testType: formData.value.testType,
      experimentType: formData.value.experimentType,
      difficulty: formData.value.difficulty,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      testSite: formData.value.testSite,
      testSiteId: formData.value.testSiteId,
      maxParticipants: formData.value.maxParticipants,
      requirements: formData.value.requirements.filter(r => r.trim()),
      fee: formData.value.fee,
      estimatedDuration: formData.value.estimatedDuration,
      location: formData.value.testSite,
      vehicles: selectedVehicleIds.value.map(vehicleId => {
        const vehicle = availableVehicles.value.find(v => v.id === vehicleId);
        return {
          vehicleId: vehicle.id,
          name: vehicle.name,
          testContent: vehicleTestContents.value[vehicleId] || ''
        };
      }),
      status: 'PENDING',
      equipment: formData.value.equipment.filter(e => e.trim()),
      notes: formData.value.notes.filter(n => n.trim()),
      contractInfo: {
        contractNumber: formData.value.contractInfo.contractNumber,
        client: formData.value.contractInfo.client
      }
    };

    await testTaskStore.createTestTask(taskData);
    showToast('创建成功');
    router.push('/test-tasks');
  } catch (error) {
    console.error('创建测试任务失败:', error);
    showToast('创建失败：' + error);
  } finally {
    submitting.value = false;
  }
};

// 加载测试场地列表
const loadTestSites = async () => {
  try {
    await testSiteStore.fetchTestSites();
    // 为 Vant 4.x Picker 生成正确的数据格式
    availableTestSites.value = testSiteStore.testSites
      .filter(site => site.status === 'AVAILABLE')
      .map(site => ({
        text: site.siteName,
        value: site.siteId
      }));
  } catch (error) {
    console.error('加载测试场地列表失败:', error);
    showToast('加载测试场地列表失败');
  }
};

// 测试场地选择确认
const onTestSiteConfirm = ({ selectedValues, selectedOptions }) => {
  console.log('测试场地选择的值:', { selectedValues, selectedOptions });
  
  // selectedValues[0] 是用户选择的值（siteId）
  const selectedValue = selectedValues[0];
  
  // 在 availableTestSites 中找到对应的站点
  const site = availableTestSites.value.find(site => site.value === selectedValue);
  
  if (site) {
    formData.value.testSite = site.text;     // 站点名称
    formData.value.testSiteId = site.value;  // 站点ID
  } else {
    console.warn('未找到选中的测试场地:', selectedValue);
    showToast('选择的测试场地无效');
  }
  
  showTestSitePopup.value = false;
};

// 初始化
onMounted(() => {
  loadVehicles();
  loadTestSites();
});
</script>

<style lang="less" scoped>
.new-test-task {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;

  .vehicle-selector {
    height: calc(100% - 46px);
    overflow-y: auto;
  }

  .vehicle-test-content {
    margin: 8px 0;
    
    .van-field {
      margin-top: 8px;
    }
  }

  :deep(.van-field__label) {
    width: 6em;
  }
}
</style>
