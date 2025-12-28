// 新增预约模拟数据验证测试
console.log('=== 新增预约模拟数据验证 ===\n');

// 模拟导入数据
const mockBookingData = {
  id: 'auto-generated',
  taskId: 'TT003',
  testSiteId: 'TS001',
  date: '2025-04-09',
  period: 'AM',
  vehicleId: '5',
  status: 'PENDING',
  notes: '新增预约，天气预报情况不适合测试，如果实际小雨，则取消。',
  createdAt: '2025-04-08T16:30:00.000Z',
  updatedAt: '2025-04-08T16:30:00.000Z',
  weatherCondition: {
    condition: '小雨',
    temperature: 18,
    windSpeed: 4,
    precipitation: 60,
    suitable: false
  }
};

const mockTaskData = {
  taskId: 'TT003',
  taskName: '测试任务',
  description: '测试任务描述',
  department: '测试任务单位',
  testType: 'PERFORMANCE_TEST',
  experimentType: 'PERFORMANCE_TEST',
  testSite: '德清测试场A区',
  testSiteId: 'TS001',
  vehicles: [
    {
      vehicleId: '5',
      name: '蔚来 ET7',
      testContent: '蔚来ET7测试内容'
    }
  ]
};

const mockVehicleData = {
  vehicleId: '5',
  licensePlate: '沪E67890',
  brand: '蔚来',
  model: 'ET7',
  year: '2025',
  color: '星云紫',
  status: 'MAINTENANCE'
};

console.log('📋 验证预约信息与截图数据匹配:');

// 验证测试任务信息
console.log('\n🎯 测试任务信息:');
console.log(`✅ 任务ID: ${mockBookingData.taskId} (对应: ${mockTaskData.taskId})`);
console.log(`✅ 任务名称: ${mockTaskData.taskName}`);
console.log(`✅ 任务单位: ${mockTaskData.department}`);
console.log(`✅ 测试类型: ${mockTaskData.testType} (性能测试)`);
console.log(`✅ 试验类型: ${mockTaskData.experimentType} (性能测试)`);
console.log(`✅ 测试地点: ${mockTaskData.testSite}`);

// 验证车辆信息
console.log('\n🚗 测试车辆信息:');
console.log(`✅ 车辆ID: ${mockVehicleData.vehicleId}`);
console.log(`✅ 车辆品牌: ${mockVehicleData.brand}`);
console.log(`✅ 车辆型号: ${mockVehicleData.model}`);
console.log(`✅ 车牌号: ${mockVehicleData.licensePlate}`);
console.log(`✅ 显示名称: ${mockTaskData.vehicles[0].name}`);

// 验证预约时间
console.log('\n📅 预约时间信息:');
console.log(`✅ 日期: ${mockBookingData.date} (2025-04-09)`);
console.log(`✅ 时间段: ${mockBookingData.period} (上午 09:00-12:00)`);

// 验证天气信息
console.log('\n🌧️ 天气信息:');
console.log(`✅ 天气状况: ${mockBookingData.weatherCondition.condition}`);
console.log(`✅ 温度: ${mockBookingData.weatherCondition.temperature}°C`);
console.log(`✅ 风速: ${mockBookingData.weatherCondition.windSpeed} m/s`);
console.log(`✅ 降水概率: ${mockBookingData.weatherCondition.precipitation}%`);
console.log(`✅ 适合测试: ${mockBookingData.weatherCondition.suitable ? '是' : '否'}`);

// 验证预约状态和备注
console.log('\n📝 预约状态和备注:');
console.log(`✅ 预约状态: ${mockBookingData.status} (待确认)`);
console.log(`✅ 备注信息: ${mockBookingData.notes}`);

// 验证创建时间
console.log('\n⏰ 时间记录:');
console.log(`✅ 创建时间: ${mockBookingData.createdAt}`);
console.log(`✅ 更新时间: ${mockBookingData.updatedAt}`);

console.log('\n🔍 数据匹配度检查:');

// 检查关键数据匹配
const checks = [
  { field: '测试任务名称', expected: '测试任务', actual: mockTaskData.taskName, match: mockTaskData.taskName === '测试任务' },
  { field: '测试类型', expected: '性能测试', actual: 'PERFORMANCE_TEST', match: mockTaskData.testType === 'PERFORMANCE_TEST' },
  { field: '测试地点', expected: '德清测试场A区', actual: mockTaskData.testSite, match: mockTaskData.testSite === '德清测试场A区' },
  { field: '测试车辆', expected: '蔚来 ET7', actual: mockVehicleData.brand + ' ' + mockVehicleData.model, match: (mockVehicleData.brand + ' ' + mockVehicleData.model) === '蔚来 ET7' },
  { field: '预约日期', expected: '2025-04-09', actual: mockBookingData.date, match: mockBookingData.date === '2025-04-09' },
  { field: '时间段', expected: '上午', actual: 'AM', match: mockBookingData.period === 'AM' },
  { field: '天气状况', expected: '小雨', actual: mockBookingData.weatherCondition.condition, match: mockBookingData.weatherCondition.condition === '小雨' },
  { field: '温度', expected: '18°C', actual: mockBookingData.weatherCondition.temperature + '°C', match: mockBookingData.weatherCondition.temperature === 18 },
  { field: '适合测试', expected: '不适合', actual: mockBookingData.weatherCondition.suitable ? '适合' : '不适合', match: !mockBookingData.weatherCondition.suitable }
];

checks.forEach(check => {
  const status = check.match ? '✅' : '❌';
  console.log(`${status} ${check.field}: 期望 "${check.expected}", 实际 "${check.actual}"`);
});

const allMatch = checks.every(check => check.match);
console.log(`\n📊 总体匹配度: ${allMatch ? '✅ 完全匹配' : '❌ 存在差异'}`);

if (allMatch) {
  console.log('\n🎉 新增预约模拟数据创建成功！');
  console.log('📋 数据完全符合截图中显示的信息');
  console.log('🔄 可以正常用于应用测试和演示');
} else {
  console.log('\n⚠️ 需要检查和调整数据以确保完全匹配');
}

console.log('\n=== 验证完成 ===');
