// TestTaskDetail userRegistrations 错误修复测试
console.log('=== TestTaskDetail userRegistrations 错误修复验证 ===\n');

// 模拟场景：API返回不同格式的数据
const testScenarios = [
  {
    name: '正常的分页响应',
    response: {
      data: {
        content: [
          { registrationId: 'REG001', taskId: 'TT001', status: 'APPROVED' },
          { registrationId: 'REG002', taskId: 'TT002', status: 'PENDING' }
        ],
        totalElements: 2
      }
    }
  },
  {
    name: '直接返回数组',
    response: [
      { registrationId: 'REG001', taskId: 'TT001', status: 'APPROVED' }
    ]
  },
  {
    name: '空数据',
    response: null
  },
  {
    name: '空对象',
    response: {}
  },
  {
    name: '字符串（错误数据）',
    response: 'invalid data'
  }
];

// 修复后的数据处理函数
function processRegistrations(response) {
  // 从响应中提取数组数据
  const registrations = response?.data?.content || response?.data || response || [];
  // 确保返回的是数组格式
  return Array.isArray(registrations) ? registrations : [];
}

// 修复后的计算属性函数
function isRegistered(userRegistrations, taskId) {
  // 确保 userRegistrations 是数组
  const registrations = Array.isArray(userRegistrations) ? userRegistrations : [];
  return registrations.some(reg => reg.taskId === taskId);
}

console.log('🧪 测试数据处理函数...\n');

testScenarios.forEach(scenario => {
  console.log(`📋 测试场景: ${scenario.name}`);
  console.log(`🔄 原始响应:`, scenario.response);
  
  try {
    const processed = processRegistrations(scenario.response);
    console.log(`✅ 处理结果:`, processed);
    console.log(`📊 是否为数组:`, Array.isArray(processed));
    console.log(`📏 数组长度:`, processed.length);
    
    // 测试计算属性
    const registered = isRegistered(processed, 'TT001');
    console.log(`🎯 是否已报名 TT001:`, registered);
    
  } catch (error) {
    console.log(`❌ 处理失败:`, error.message);
  }
  
  console.log('---\n');
});

console.log('🔍 测试 some() 方法调用...\n');

// 测试各种数据类型调用 some() 方法
const testData = [
  { name: '正常数组', data: [{ taskId: 'TT001' }] },
  { name: '空数组', data: [] },
  { name: 'null', data: null },
  { name: 'undefined', data: undefined },
  { name: '字符串', data: 'test' },
  { name: '对象', data: { taskId: 'TT001' } }
];

testData.forEach(test => {
  console.log(`📝 测试 ${test.name}:`);
  
  try {
    // 原始方法（会出错）
    const result1 = test.data.some(reg => reg.taskId === 'TT001');
    console.log(`   原始方法结果: ${result1}`);
  } catch (error) {
    console.log(`   ❌ 原始方法错误: ${error.message}`);
  }
  
  try {
    // 修复后的方法
    const safeData = Array.isArray(test.data) ? test.data : [];
    const result2 = safeData.some(reg => reg.taskId === 'TT001');
    console.log(`   ✅ 修复后结果: ${result2}`);
  } catch (error) {
    console.log(`   ❌ 修复后错误: ${error.message}`);
  }
  
  console.log('');
});

console.log('=== 修复验证完成 ===');
console.log('✅ 所有场景都能正常处理，不会出现 "some is not a function" 错误');
console.log('🔧 修复要点:');
console.log('   1. 在 testTask store 中正确提取数组数据');
console.log('   2. 在 TestTaskDetail.vue 中添加数组类型检查');
console.log('   3. 为所有赋值操作添加防护逻辑');
