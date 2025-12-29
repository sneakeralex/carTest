<template>
  <div class="new-booking">
    <van-nav-bar
      title="新增预约"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 步骤指示器 -->
    <van-steps :active="currentStep" class="step-indicator">
      <van-step>选择时间</van-step>
      <van-step>选择车辆VIN</van-step>
      <van-step>选择项目场地</van-step>
      <van-step>实验类型内容</van-step>
      <van-step>选择人员计费</van-step>
      <van-step>确认提交</van-step>
    </van-steps>

    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 选择时间 -->
      <div v-if="currentStep === 0" class="step-section">
        <van-cell-group inset title="选择预约时间">
          <van-field
            v-model="bookingDate"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="日期"
            placeholder="请选择日期"
            is-link
            @click="showDatePicker = true"
          />
          
          <van-field
            v-if="bookingDate"
            v-model="selectedPeriodText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="开始时间"
            placeholder="请选择开始时间"
            is-link
            @click="showPeriodPicker = true"
          />
          
          <van-field
            v-if="bookingDate && selectedPeriod"
            v-model="selectedEndTimeText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="结束时间"
            placeholder="请选择结束时间（可选）"
            is-link
            @click="showEndTimePicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 步骤2: 选择车辆VIN -->
      <div v-if="currentStep === 1" class="step-section">
        <van-cell-group inset title="选择车辆信息">
          <!-- VIN选择 -->
          <van-field
            v-model="selectedVinText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="车辆VIN"
            placeholder="请选择车辆VIN"
            is-link
            @click="showVinPicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 步骤3: 选择项目和场地 -->
      <div v-if="currentStep === 2" class="step-section">
        <van-cell-group inset title="选择项目和场地">
          <!-- 项目选择 -->
          <van-field
            v-model="selectedProjectText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="测试项目"
            placeholder="由车辆VIN确定"
          />

          <!-- 场地选择 -->
          <van-field
            v-model="selectedGroundText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="测试场地"
            placeholder="请选择测试场地"
            is-link
            @click="showGroundPicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 步骤4: 实验类型内容 -->
      <div v-if="currentStep === 3" class="step-section">
        <van-cell-group inset title="实验类型与内容">
          <!-- 试验类型选择 -->
          <van-field
            v-model="selectedTestTypeText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="实验类型"
            placeholder="请选择实验类型"
            is-link
            @click="showTestTypePicker = true"
          />

          <!-- 试验内容选择（从接口获取的 testItemName） -->
          <van-field
            v-model="selectedTestContentText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="实验内容"
            placeholder="请选择实验内容"
            is-link
            @click="showTestContentPicker = true"
          />
        </van-cell-group>
      </div>

      <!-- 步骤5: 选择人员和计费信息 -->
      <div v-if="currentStep === 4" class="step-section">
        <van-cell-group inset title="选择人员和计费信息">
          <!-- 驾驶员选择 -->
          <van-field
            v-model="selectedDriverText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="驾驶员"
            placeholder="请选择驾驶员"
            is-link
            @click="showDriverPicker = true"
          />

          <!-- 参与人数 -->
          <van-field
            v-model="participantCount"
            autocomplete="off"
            data-no-ext="true"
            label="参与人数"
            type="number"
            placeholder="请输入参与人数"
          />

          <!-- 辅助车辆数 -->
          <van-field
            v-model="auxiliaryVehicleCount"
            autocomplete="off"
            data-no-ext="true"
            label="辅助车辆数"
            type="number"
            placeholder="请输入辅助车辆数"
          />

          <!-- 计费类型 -->
          <van-field
            v-model="selectedBillingTypeText"
            autocomplete="off"
            data-no-ext="true"
            readonly
            label="计费类型"
            placeholder="请选择计费类型"
            is-link
            @click="showBillingTypePicker = true"
          />

          <!-- 是否包场 -->
          <van-cell title="是否包场">
            <template #right-icon>
              <van-switch v-model="isExclusive" />
            </template>
          </van-cell>

          <!-- 影像需求 -->
          <van-cell title="影像需求">
            <template #right-icon>
              <van-switch v-model="imagingRequirement" />
            </template>
          </van-cell>
        </van-cell-group>
      </div>

      <!-- 步骤6: 确认提交 -->
      <div v-if="currentStep === 5" class="step-section">
        <!-- 预约编号显示 -->
        <van-cell-group inset title="预约编号">
          <van-cell v-if="generatingBookingNo" title="预约编号" value="正在生成..." />
          <van-cell v-else-if="bookingNo" title="预约编号" :value="bookingNo" />
          <van-cell v-else title="预约编号" value="点击生成预约编号" @click="generateBookingNo" />
        </van-cell-group>

        <van-cell-group inset title="预约信息确认">
          <van-cell title="车辆VIN" :value="selectedVinText" />
          <van-cell title="测试项目" :value="selectedProjectText" />
          <van-cell title="测试场地" :value="selectedGroundText" />
          <van-cell title="驾驶员" :value="selectedDriverText" />
          <van-cell title="参与人数" :value="participantCount" />
          <van-cell title="辅助车辆数" :value="auxiliaryVehicleCount || '0'" />
          <van-cell title="计费类型" :value="selectedBillingTypeText" />
          <van-cell title="是否包场" :value="isExclusive ? '是' : '否'" />
          <van-cell title="影像需求" :value="imagingRequirement ? '是' : '否'" />
          <van-cell title="预约日期" :value="bookingDate" />
          <van-cell title="开始时间" :value="selectedPeriodText" />
          <van-cell title="结束时间" :value="selectedEndTimeText || '未设置'" />
        </van-cell-group>

        <!-- 备注信息 -->
        <van-cell-group inset title="备注信息">
          <van-field
            v-model="notes"
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
        提交预约
      </van-button>
    </div>

    <!-- VIN选择器 -->
    <van-popup
      v-model:show="showVinPicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择车辆VIN"
        :columns="vinColumns"
        @confirm="(value) => onVinSelect(value)"
        @cancel="showVinPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 项目选择器 -->
    <!-- removed: project picker -->

    <!-- 场地选择器 -->
    <van-popup
      v-model:show="showGroundPicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择测试场地"
        :columns="groundColumns"
        @confirm="(value) => onGroundSelect(value)"
        @cancel="showGroundPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 驾驶员选择器 -->
    <van-popup
      v-model:show="showDriverPicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择驾驶员"
        :columns="driverColumns"
        @confirm="(value) => onDriverSelect(value)"
        @cancel="showDriverPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 计费类型选择器 -->
    <van-popup
      v-model:show="showBillingTypePicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择计费类型"
        :columns="billingTypeColumns"
        @confirm="(value) => onBillingTypeSelect(value)"
        @cancel="showBillingTypePicker = false"
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
        :model-value="currentDate"
        type="date"
        title="选择预约日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateSelect"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 开始时间选择器 -->
    <van-popup
      v-model:show="showPeriodPicker"
      position="bottom"
      round
    >
      <van-time-picker
        v-model="currentTime"
        title="选择开始时间"
        :min-hour="isToday ? minTime[0] : 8"
        :min-minute="isToday ? minTime[1] : 0"
        :max-hour="18"
        @confirm="onTimeSelect"
        @cancel="showPeriodPicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 结束时间选择器 -->
    <van-popup
      v-model:show="showEndTimePicker"
      position="bottom"
      round
    >
      <van-time-picker
        v-model="endTimeArray"
        title="选择结束时间（可选）"
        :min-hour="startTime ? parseInt(startTime.split(':')[0]) + 1 : 9"
        :min-minute="startTime && startTime.split(':')[0] === endTimeArray[0] ? parseInt(startTime.split(':')[1]) : 0"
        :max-hour="20"
        @confirm="onEndTimeSelect"
        @cancel="showEndTimePicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 试验类型选择器 -->
    <van-popup
      v-model:show="showTestTypePicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择实验类型"
        :columns="testTypeColumns"
        @confirm="(value) => onTestTypeSelect(value)"
        @cancel="showTestTypePicker = false"
        show-toolbar
      />
    </van-popup>

    <!-- 实验内容选择器 -->
    <van-popup
      v-model:show="showTestContentPicker"
      position="bottom"
      round
    >
      <van-picker
        title="选择实验内容"
        :columns="testContentColumns"
        @confirm="(value) => onTestContentSelect(value)"
        @cancel="showTestContentPicker = false"
        show-toolbar
      />
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { useBookingStore } from '../stores/booking';
import { getStaffList } from '../api/staff';
import { getTestSites } from '../api/testSite';
import { getVinList, getBookingNo } from '../api/booking';
import { getUserInfo } from '../utils/auth.js';
import { artemisRequest } from '../api/request';

// 状态
const selectedDriver = ref(null);
const selectedDriverText = ref('');
const selectedGround = ref(null);
const selectedGroundText = ref('');
const selectedBillingType = ref(null);
const selectedBillingTypeText = ref('');
const participantCount = ref('');
const auxiliaryVehicleCount = ref('');
const isExclusive = ref(false);
const imagingRequirement = ref(false);
const bookingDate = ref('');
const selectedPeriod = ref(null);
const selectedPeriodText = ref('');
const selectedEndTime = ref(null);
const selectedEndTimeText = ref('');
const notes = ref('');
const submitting = ref(false);

// 新增状态变量
const selectedVin = ref(null);
const selectedVinText = ref('');

const selectedProject = ref(null);
const selectedProjectText = ref('');
const selectedProjectNo = ref('');
// 实验类型相关
const testTypes = ref([]);
const selectedTestTypeId = ref('');
const selectedTestTypeText = ref('');


const showTestTypePicker = ref(false);
const testContents = ref([]);
const selectedTestContentText = ref('');
const showTestContentPicker = ref(false);
const vinList = ref([]);
const currentUser = ref(null);
const currentStep = ref(0);

// 预约编号相关
const bookingNo = ref('');
const generatingBookingNo = ref(false);

// 数据列表
const drivers = ref([]);
const grounds = ref([]);

// 选择器状态
const showDriverPicker = ref(false);
const showGroundPicker = ref(false);
const showBillingTypePicker = ref(false);
const showDatePicker = ref(false);
const showPeriodPicker = ref(false);
const showEndTimePicker = ref(false);
const showVinPicker = ref(false);

// 日期选择器状态
const currentDate = ref(['2025', '04', '01']); // 使用数组格式兼容 van-date-picker

// 日期范围 - 今天到30天后
const today = new Date();
const minDate = today;
const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000); // 30天后

// 判断选择的日期是否是今天
const isToday = computed(() => {
  if (!bookingDate.value) return false;
  const selectedDate = new Date(bookingDate.value);
  const todayDate = new Date();
  return selectedDate.toDateString() === todayDate.toDateString();
});

// 计算最小可选时间（当前时间+1小时）
const minTime = computed(() => {
  const now = new Date();
  const minTimeDate = new Date(now.getTime() + 60 * 60 * 1000); // 当前时间+1小时
  const hours = minTimeDate.getHours();
  const minutes = minTimeDate.getMinutes();
  return [hours.toString().padStart(2, '0'), minutes.toString().padStart(2, '0')];
});

// 时间选择器状态
const currentTime = ref(['09', '00']); // 默认上午9点
const endTimeArray = ref(['10', '00']); // 结束时间默认10点
const startTime = computed(() => selectedPeriod.value); // 当前选择的开始时间

// router 和 bookingStore
const router = useRouter();
const bookingStore = useBookingStore();

// 获取 VIN 列表
async function fetchVinList() {
  try {
    const userInfo = getUserInfo();
    const corpId = userInfo?.enterpriseId || userInfo?.corpId;
    if (!corpId) {
      console.warn('未找到企业ID，无法获取VIN列表');
      vinList.value = [];
      return;
    }
    const res = await getVinList(corpId);
    vinList.value = res?.data || res?.data?.content || [];
    console.log('VIN列表获取成功:', vinList.value);
  } catch (e) {
    console.error('获取VIN列表失败:', e);
    vinList.value = [];
    showToast({ type: 'fail', message: '获取VIN列表失败' });
  }
}

// 获取驾驶员列表（如果传入 groundId 则按场地从 booking driverList API 拉取）
async function fetchDrivers(groundId = null) {
  try {
    if (groundId) {
      const body = JSON.stringify({ groundId: groundId?.toString?.() || groundId });
      const res = await artemisRequest('/artemis/api/v1/booking/driverList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const json = res?.data;
      if (json && (json.code === 200 || json.status === 200 || json.code === '0')) {
        const list = Array.isArray(json.data) ? json.data : (json.data?.content || []);
        drivers.value = list.map(d => ({ id: d.id, name: d.driverName || d.name, driverId: d.id, phone: d.driverPhone }));
        return;
      }
      console.warn('获取驾驶员列表失败，返回:', json);
      drivers.value = [];
      return;
    }

    // fallback: no groundId provided, try existing staff API
    const res = await getStaffList();
    const list = res?.data || [];
    drivers.value = Array.isArray(list) ? list.filter(s => s.type === 'DRIVER' || s.role === 'DRIVER').map(s => ({ id: s.id || s.driverId, name: s.name || s.driverName, driverId: s.id || s.driverId })) : [];
  } catch (e) {
    console.error('获取驾驶员列表失败:', e);
    drivers.value = [];
  }
}

// 获取场地列表
async function fetchGrounds(params = {}) {
  try {
    const res = await getTestSites(params);
    const list = res?.data?.content ?? res?.data ?? [];
    console.log('获取场地列表原始响应处理后:', list);
    grounds.value = Array.isArray(list) ? list : [];
  } catch (e) {
    console.error('获取场地列表失败:', e);
    grounds.value = [];
  }
}

// VIN选择器
const vinColumns = computed(() => {
  console.log('计算vinColumns，当前vinList:', vinList.value);
  if (!vinList.value.length) {
    return [{ text: '暂无VIN数据', value: '', disabled: true }];
  }
  const columns = vinList.value.map(vin => ({
    text: vin.vin || vin.licensePlate,
    value: vin.vin || vin.licensePlate,
    vin
  }));
  console.log('生成的vinColumns:', columns);
  return columns;
});

// 驾驶员选择器
const driverColumns = computed(() => {
  if (!drivers.value.length) return [{ text: '暂无驾驶员数据', value: '', disabled: true }];
  return drivers.value.map(driver => ({
    text: driver.name,
    // normalize to string to match picker emitted values
    value: String(driver.driverId || driver.id),
    driver
  }));
});

// 场地选择器
const groundColumns = computed(() => {
  if (!grounds.value.length) return [{ text: '暂无场地数据', value: '', disabled: true }];
  return grounds.value.map(ground => ({
    // show fullName in picker when available
    text: ground.fullName || ground.name || ground.shortName || ground.groundNo || '未知场地',
    // use canonical id as the value so selection returns the id
    value: ground.id || ground.groundId || ground.siteId || ground.groundNo,
    ground
  }));
});

// 处理场地选择
const onGroundSelect = (value) => {
  // 支持 Vant picker 的多种返回形式：{ selectedValues: [...] } / { selectedOptions: [...] } / raw value
  console.log('场地选择器返回的值:', value);
  const selectedValue = value?.selectedValues?.[0] || value?.selectedOptions?.[0]?.value || value;
  console.log('提取到的选中场地值:', selectedValue);
  const selectedOption = groundColumns.value.find(col => col.value === selectedValue) || groundColumns.value[0];
  if (selectedOption) {
    selectedGround.value = selectedOption.ground;
    selectedGroundText.value = selectedOption.ground?.fullName || selectedOption.text;
    console.log('设置selectedGround为:', selectedGround.value);
    // 当场地选择后，基于场地加载驾驶员列表（按场地过滤）
    const groundIdForApi = selectedGround.value?.id || selectedGround.value?.groundId || selectedGround.value?.siteId || selectedValue;
    if (groundIdForApi) fetchDrivers(groundIdForApi);
  } else {
    selectedGround.value = null;
    selectedGroundText.value = '';
  }
  showGroundPicker.value = false;
};

// 计费类型选择器
const billingTypeColumns = computed(() => {
  return [
    { text: '按小时计费', value: 'hourly' },
    { text: '按天计费', value: 'daily' }
  ];
});



// 试验类型选择器 columns
const testTypeColumns = computed(() => {
  if (!testTypes.value.length) return [{ text: '暂无类型', value: '', disabled: true }];
  // API 返回格式: { testTypeId, testType }
  return testTypes.value.map(t => ({ text: t.testType || t.name || t.label || '', value: t.testTypeId ?? t.id ?? t.value, raw: t }));
});

// 根据 projectNo 和 vin 获取试验类型（testTypeId/testType）
const fetchTestTypes = async (projectNo, vin) => {
  if (!projectNo || !vin) return;
  try {
    const res = await artemisRequest(`/artemis/api/v1/booking/getTestType/${encodeURIComponent(projectNo)}/${encodeURIComponent(vin)}`, { method: 'GET' });
    const json = res?.data;
    if (json && (json.code === 200 || json.status === 200 || json.code === '0')) {
      testTypes.value = Array.isArray(json.data) ? json.data : (json.data?.content || []);
    } else {
      console.warn('获取试验类型失败，返回:', json);
      testTypes.value = [];
    }
  } catch (err) {
    console.error('fetchTestTypes 出错:', err);
    testTypes.value = [];
  }
};

// 试验内容模板选择器 columns (使用 testItemName 作为显示和值)
const testContentColumns = computed(() => {
  if (!testContents.value || !testContents.value.length) return [{ text: '暂无试验内容', value: '', disabled: true }];
  return testContents.value.map(item => ({ text: item.testItemName || '', value: item.testItemName || '', raw: item }));
});

// 根据 vin/projectNo/provingGroundId/groundId/testTypeId 获取试验内容列表（POST）
const fetchTestContents = async ({ vin, projectNo, provingGroundId, groundId, testTypeId }) => {
  if (!vin || !projectNo || !testTypeId) return;
  try {
    const body = JSON.stringify({ vin, projectNo, provingGroundId: provingGroundId ?? '', groundId: groundId ?? '', testTypeId: testTypeId?.toString?.() || testTypeId });
    const res = await artemisRequest('/artemis/api/v1/booking/getTestContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body
    });
    const json = res?.data;
    if (json && (json.code === 200 || json.status === 200 || json.code === '0')) {
      testContents.value = Array.isArray(json.data) ? json.data : (json.data?.content || []);
    } else {
      console.warn('获取试验内容失败，返回:', json);
      testContents.value = [];
    }
  } catch (err) {
    console.error('fetchTestContents 出错:', err);
    testContents.value = [];
  }
};

// 处理试验内容选择
const onTestContentSelect = (value) => {
  const selectedValue = value?.selectedValues?.[0] || value?.selectedOptions?.[0]?.value || value;
  const selectedOption = testContentColumns.value.find(col => col.value === selectedValue);
  if (selectedOption) {
    selectedTestContentText.value = selectedOption.text;
    // 实验内容直接使用选择的模板内容
  }
  showTestContentPicker.value = false;
};

// 处理试验类型选择
const onTestTypeSelect = (value) => {
  console.log('试验类型选择器返回的值:', value);
  const selectedValue = value?.selectedValues?.[0] || value?.selectedOptions?.[0]?.value || value;
  const selectedOption = testTypeColumns.value.find(col => col.value === selectedValue);
  if (selectedOption) {
    selectedTestTypeId.value = selectedOption.value;
    selectedTestTypeText.value = selectedOption.text;
    // 移除自动填充 testContent 的逻辑，因为现在实验内容直接从模板选择
    // 当试验类型选择后，如果已有 VIN、projectNo 与场地信息，则请求试验内容模板
    const vinForApi = selectedVin.value?.vin || selectedVin.value || selectedVinText.value;
    const provingGroundId = selectedGround.value?.provingGroundId || selectedGround.value?.provingGroundId || selectedGround.value?.provingGroundId;
    const groundId = selectedGround.value?.id || selectedGround.value?.groundId || selectedGround.value?.siteId;
    if (selectedProjectNo.value && vinForApi && selectedTestTypeId.value) {
      fetchTestContents({ vin: vinForApi, projectNo: selectedProjectNo.value, provingGroundId, groundId, testTypeId: selectedTestTypeId.value });
    }
  }
  showTestTypePicker.value = false;
};

// 处理VIN选择
const onVinSelect = (value) => {
  console.log('VIN选择器返回的值:', value);
  const selectedValue = value.selectedValues?.[0] || value.selectedOptions?.[0]?.value || value;
  console.log('提取到的选中值:', selectedValue);
  const selectedOption = vinColumns.value.find(col => col.value === selectedValue);
  console.log('匹配到的选项:', selectedOption);
  if (selectedOption) {
    selectedVin.value = selectedOption.vin;
    selectedVinText.value = selectedOption.text;
    // set project from VIN object if available
    const projNo = selectedOption.vin?.projectNo || selectedOption.vin?.testProjectNo || selectedOption.vin?.test_project_no || '';
    selectedProjectNo.value = projNo;
    selectedProjectText.value = projNo || '';
    console.log('设置selectedVin为:', selectedOption.vin);
    console.log('设置selectedVinText为:', selectedOption.text);
    console.log('设置selectedProjectNo为:', selectedProjectNo.value);
    // 当 VIN 和 projectNo 已确定时，获取该车的试验类型列表
    const vinForApi = selectedOption.vin?.vin || selectedOption.vin || selectedOption.value || selectedValue;
    if (selectedProjectNo.value && vinForApi) {
      fetchTestTypes(selectedProjectNo.value, vinForApi);
    }
  }
  showVinPicker.value = false;
};

// 处理驾驶员选择
const onDriverSelect = (value) => {
  // 支持 Vant picker 的多种返回形式：{ selectedValues: [...] } / { selectedOptions: [...] } / raw value
  const selectedValue = value?.selectedValues?.[0] || value?.selectedOptions?.[0]?.value || value;
  const normalized = selectedValue != null ? String(selectedValue) : selectedValue;
  const selectedOption = driverColumns.value.find(col => col.value === normalized);
  if (selectedOption) {
    selectedDriver.value = selectedOption.driver;
    selectedDriverText.value = selectedOption.text;
  }
  showDriverPicker.value = false;
};

// 处理计费类型选择
const onBillingTypeSelect = (value) => {
  const selectedValue = value?.selectedValues?.[0] || value?.selectedOptions?.[0]?.value || value;
  const selectedOption = billingTypeColumns.value.find(col => col.value === selectedValue);
  if (selectedOption) {
    selectedBillingType.value = selectedOption.value;
    selectedBillingTypeText.value = selectedOption.text;
  }
  showBillingTypePicker.value = false;
};

// 处理日期选择
const onDateSelect = async (date) => {
  console.log('日期选择器返回的值:', date);
  
  // 提取实际的日期数组
  let dateArray = date;
  if (date && typeof date === 'object' && date.selectedValues) {
    dateArray = date.selectedValues;
  }
  
  console.log('提取到的日期数组:', dateArray);
  
  // dateArray 是数组格式 [year, month, day]
  if (Array.isArray(dateArray) && dateArray.length === 3) {
    const [year, month, day] = dateArray;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    console.log('格式化后的日期:', formattedDate);
    
    // 检查是否是今天
    const selectedDate = new Date(formattedDate);
    const todayDate = new Date();
    const isTodaySelected = selectedDate.toDateString() === todayDate.toDateString();
    
    // 如果是今天，检查是否还有有效的时间段（当前时间+1小时必须在18:00之前）
    if (isTodaySelected) {
      const now = new Date();
      const minSelectableTime = new Date(now.getTime() + 60 * 60 * 1000); // 当前时间+1小时
      const maxSelectableTime = new Date();
      maxSelectableTime.setHours(18, 0, 0, 0); // 18:00
      
      if (minSelectableTime >= maxSelectableTime) {
        showToast({ type: 'fail', message: '今天已超过可预约时间，请选择明天' });
        showDatePicker.value = false;
        return;
      }
    }
    
    // 强制更新 bookingDate
    console.log('更新前 bookingDate.value:', bookingDate.value);
    bookingDate.value = formattedDate;
    currentDate.value = dateArray; // 更新currentDate为选中值
    console.log('更新后 bookingDate.value:', bookingDate.value);
    
    // 如果是今天，清空之前选择的时间（因为可能不再有效）
    if (isTodaySelected) {
      selectedPeriod.value = null;
      selectedPeriodText.value = '';
      selectedEndTime.value = null;
      selectedEndTimeText.value = '';
      currentTime.value = [minTime.value[0], minTime.value[1]]; // 重置为最小可选时间
    }
    
    // 强制触发响应式更新
    await nextTick();
    
    // 强制重新计算 canProceed
    const temp = canProceed.value;
    console.log('canProceed.value 重新计算:', temp);
  }
  showDatePicker.value = false;
  // 不清空时间字段，保留之前的选择
  // selectedPeriod.value = null;
  // selectedPeriodText.value = '';
  
  // 如果还没有选择时间，立即显示时间选择器
  if (!selectedPeriod.value) {
    setTimeout(() => {
      showPeriodPicker.value = true;
    }, 300);
  }
};

// 处理开始时间选择
const onTimeSelect = (time) => {
  console.log('开始时间选择器返回的值:', time);
  
  // 提取实际的时间数组
  let timeArray = time;
  if (time && typeof time === 'object' && time.selectedValues) {
    timeArray = time.selectedValues;
  }
  
  console.log('提取到的时间数组:', timeArray);
  
  // timeArray 是数组格式 [hour, minute]
  if (Array.isArray(timeArray) && timeArray.length === 2) {
    const [hour, minute] = timeArray;
    const formattedTime = `${hour}:${minute}`;
    selectedPeriod.value = formattedTime;
    selectedPeriodText.value = formattedTime;
    currentTime.value = timeArray; // 更新currentTime为选中值
    console.log('设置开始时间为:', formattedTime);
    
    // 清空之前选择的结束时间
    selectedEndTime.value = null;
    selectedEndTimeText.value = '';
    
    // 设置结束时间选择器的最小时间为开始时间+1小时
    const endHour = (parseInt(hour) + 1) % 24;
    endTimeArray.value = [endHour.toString().padStart(2, '0'), minute.toString().padStart(2, '0')];
  }
  showPeriodPicker.value = false;
};

// 处理结束时间选择
const onEndTimeSelect = (time) => {
  console.log('结束时间选择器返回的值:', time);
  
  // 提取实际的时间数组
  let timeArray = time;
  if (time && typeof time === 'object' && time.selectedValues) {
    timeArray = time.selectedValues;
  }
  
  console.log('提取到的结束时间数组:', timeArray);
  
  // timeArray 是数组格式 [hour, minute]
  if (Array.isArray(timeArray) && timeArray.length === 2) {
    const [hour, minute] = timeArray;
    const formattedTime = `${hour}:${minute}`;
    selectedEndTime.value = formattedTime;
    selectedEndTimeText.value = formattedTime;
    endTimeArray.value = timeArray; // 更新endTimeArray为选中值
    console.log('设置结束时间为:', formattedTime);
  }
  showEndTimePicker.value = false;
};

// 生成预约编号
const generateBookingNo = async () => {
  if (bookingNo.value) return bookingNo.value; // 如果已存在则直接返回
  
  try {
    generatingBookingNo.value = true;
    console.log('开始生成预约编号...');
    
    // 检查网络连接状态
    if (!navigator.onLine) {
      throw new Error('网络连接不可用');
    }
    
    const prefix = `BK-${Date.now()}`;
    const response = await getBookingNo(prefix);
    bookingNo.value = response.data;
    console.log('预约编号生成成功:', bookingNo.value);
    showToast({ type: 'success', message: '预约编号生成成功' });
    return bookingNo.value;
  } catch (error) {
    console.error('获取预约编号失败:', error);
    
    // 根据错误类型显示不同的提示
    let errorMessage = '获取预约编号失败，已生成本地编号';
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
    
    // 生成本地预约编号
    const localBookingNo = `BK-LOCAL-${Date.now()}`;
    bookingNo.value = localBookingNo;
    console.log('使用本地生成的预约编号:', localBookingNo);
    return localBookingNo;
  } finally {
    generatingBookingNo.value = false;
  }
};

// 步骤导航逻辑
const canProceed = computed(() => {
  const step0Valid = !!bookingDate.value && !!selectedPeriod.value; // 结束时间是可选的
  console.log('canProceed计算详情:');
  console.log('- currentStep:', currentStep.value);
  console.log('- bookingDate:', bookingDate.value);
  console.log('- selectedPeriod:', selectedPeriod.value);
  console.log('- selectedPeriodText:', selectedPeriodText.value);
  console.log('- step0Valid:', step0Valid);
  
  switch (currentStep.value) {
    case 0: return step0Valid; // 选择时间
    case 1: return !!selectedVin.value; // 选择车辆VIN
    case 2: return (!!selectedProjectNo.value || !!selectedProjectText.value || !!selectedProject.value) && !!selectedGround.value; // 选择项目场地
    // 新增：step3 实验类型内容需要选择 testTypeId 且选择实验内容
    case 3: return !!selectedTestTypeId.value && !!selectedTestContentText.value; // 实验类型内容
    case 4: return !!selectedDriver.value && !!selectedBillingType.value && !!participantCount.value; // 选择人员计费
    case 5: return true; // 确认提交页面的"下一步"（应该不会有，因为这是最后一步）
    default: return false;
  }
});

// 提交按钮的验证逻辑
const canSubmit = computed(() => {
  // 检查所有必填字段是否完整
  const allFieldsValid = 
    !!bookingNo.value && // 预约编号
    !!bookingDate.value && // 预约日期
    !!selectedPeriod.value && // 预约时间
    !!selectedVin.value && // 车辆VIN
    !!selectedProjectNo.value && // 项目编号
    !!selectedGround.value && // 场地
    !!selectedTestTypeId.value && // 试验类型
    !!selectedTestContentText.value && // 实验内容
    !!selectedDriver.value && // 驾驶员
    !!selectedBillingType.value && // 计费类型
    !!participantCount.value; // 参与人数

  console.log('canSubmit计算详情:');
  console.log('- bookingNo:', bookingNo.value);
  console.log('- bookingDate:', bookingDate.value);
  console.log('- selectedPeriod:', selectedPeriod.value);
  console.log('- selectedVin:', !!selectedVin.value);
  console.log('- selectedProjectNo:', selectedProjectNo.value);
  console.log('- selectedGround:', !!selectedGround.value);
  console.log('- selectedTestTypeId:', selectedTestTypeId.value);
  console.log('- selectedTestContentText:', selectedTestContentText.value);
  console.log('- selectedDriver:', !!selectedDriver.value);
  console.log('- selectedBillingType:', selectedBillingType.value);
  console.log('- participantCount:', participantCount.value);
  console.log('- allFieldsValid:', allFieldsValid);
  
  return allFieldsValid && !generatingBookingNo.value; // 所有字段完整且预约编号生成完成
});

const nextStep = async () => {
  if (currentStep.value < 5 && canProceed.value) {
    currentStep.value++;
    
    // 如果进入步骤6（确认提交），则生成预约编号
    if (currentStep.value === 5) {
      await generateBookingNo();
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

// 验证预约时间是否满足后端要求
const validateBookingTime = () => {
  if (!bookingDate.value || !selectedPeriod.value) {
    return { valid: false, message: '请选择预约日期和时间' };
  }

  const selectedDateTime = new Date(`${bookingDate.value} ${selectedPeriod.value}:00`);
  const currentDateTime = new Date();
  const minRequiredDateTime = new Date(selectedDateTime.getTime() + 60 * 60 * 1000); // 提交时间+1小时

  console.log('时间验证详情:');
  console.log('- 选择的日期时间:', selectedDateTime);
  console.log('- 当前时间:', currentDateTime);
  console.log('- 要求最小时间:', minRequiredDateTime);
  console.log('- 时间差（小时）:', (selectedDateTime - currentDateTime) / (1000 * 60 * 60));

  if (selectedDateTime < minRequiredDateTime) {
    const timeDifference = Math.round((minRequiredDateTime - selectedDateTime) / (1000 * 60 * 60));
    if (timeDifference < 1 && timeDifference > 0) {
      return { 
        valid: false, 
        message: `预约时间必须至少比当前时间提前1小时，请选择${timeDifference}小时后的时间` 
      };
    } 
  }
  return { valid: true };
};

// 表单提交
const onSubmit = async () => {
  try {
    submitting.value = true;

    // 前端时间验证
    const timeValidation = validateBookingTime();
    if (!timeValidation.valid) {
      showToast({ type: 'fail', message: timeValidation.message });
      return;
    }

    // 从用户信息获取用户ID
    const userInfo = getUserInfo();
    const userId = userInfo?.userId || userInfo?.id;
    if (!userId) {
      showToast({ type: 'fail', message: '用户登录信息已过期，请重新登录' });
      return;
    }

    // 获取开始时间和结束时间
    let startTime, endTime;
    if (selectedPeriod.value) {
      // 使用选择的时间作为开始时间
      startTime = selectedPeriod.value;
      
      // 使用用户选择的结束时间，如果没有选择则不设置
      endTime = selectedEndTime.value || ''; // 如果用户没有选择结束时间，则发送空字符串
    } else {
      // 默认值
      startTime = '09:00';
      endTime = '';
    }

    console.log('计算的时间段:', { startTime, endTime, selectedPeriod: selectedPeriod.value });

    const bookingData = {
      userId: userId, // 从 localStorage 获取的用户ID
      vin: selectedVin.value.vin || selectedVin.value.licensePlate || selectedVinText.value, // 选定的VIN
      bookingNo: bookingNo.value, // 已生成的预约编号
      // 强制使用 selectedProjectNo，如果为空则回退到显示文本
      projectNo: selectedProjectNo.value || selectedProjectText.value,
      provingGroundId: selectedGround.value?.provingGroundId || "3", // 试验场ID
      groundId: selectedGround.value?.id || selectedGround.value?.groundId || selectedGround.value?.siteId, // 场地ID (使用 id 优先)
      testTypeId: selectedTestTypeId.value || "1", // 试验类型ID（优先使用ID）
      testContent: selectedTestContentText.value || "", // 试验内容
      bookingDate: bookingDate.value, // 预约日期
      startTime: startTime, // 开始时间
      endTime: endTime, // 结束时间（用户可选）
      driverId: selectedDriver.value.driverId || selectedDriver.value.userId, // 驾驶员ID
      isExclusive: isExclusive.value ? 1 : 0, // 是否包场
      billingType: selectedBillingType.value === 'hourly' ? "1" : "2", // 计费类型ID
      auxiliaryVehicleCount: parseInt(auxiliaryVehicleCount.value) || 0, // 辅助车辆数量
      participantCount: parseInt(participantCount.value) || 1, // 实验人数
      imagingRequirement: imagingRequirement.value ? "1" : "0", // 影像需求
      remark: notes.value || '' // 备注
    };

    console.log('提交的预约数据:', JSON.stringify(bookingData, null, 2));

    await bookingStore.addBooking(bookingData);
    
    showToast({ type: 'success', message: '预约提交成功' });
    router.push('/bookings');
  } catch (error) {
    showToast({ type: 'fail', message: error.message || '预约提交失败' });
  } finally {
    submitting.value = false;
  }
};

// 网络状态监听和处理
const handleNetworkChange = () => {
  if (navigator.onLine) {
    console.log('网络连接已恢复');
    showToast({ type: 'success', message: '网络连接已恢复', duration: 2000 });
    
    // 如果在确认页面且还没有预约编号，尝试重新生成
    if (currentStep.value === 5 && !bookingNo.value && !generatingBookingNo.value) {
      generateBookingNo();
    }
  } else {
    console.log('网络连接已断开');
    showToast({ type: 'warning', message: '网络连接已断开', duration: 3000 });
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

    // 添加网络状态监听
    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // 获取VIN、驾驶员和场地列表
    await Promise.all([
      fetchVinList(),
      fetchDrivers(),
      // ensure we query grounds with a provingGroundId so booking groundList returns results
      fetchGrounds({ provingGroundId: '3' })
    ]);

    // 获取当前用户信息
    const userInfo = getUserInfo();
    const userId = userInfo?.userId || userInfo?.id;
    const userName = userInfo?.userName || userInfo?.name;
    if (userId) {
      currentUser.value = {
        id: userId,
        name: userName
      };
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

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('online', handleNetworkChange);
  window.removeEventListener('offline', handleNetworkChange);
});
</script>

<style lang="less" scoped>
.new-booking {
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

  .weekend {
    color: #ee0a24;
  }

  .test-content {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
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
</style>
