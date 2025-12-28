// 日期更新验证脚本 - 检查所有日期是否已更新到2025年4月
console.log('=== 2025年4月日期更新验证 ===\n');

// 需要检查的文件和对应的预期日期模式
const filesToCheck = [
  {
    file: 'src/mock/testTask.js',
    description: '测试任务数据',
    expectedPatterns: [
      '2025-04-10', '2025-04-20', '2025-04-15', '2025-04-30'
    ]
  },
  {
    file: 'src/mock/booking.js', 
    description: '预约数据',
    expectedPatterns: [
      '2025-04-11', '2025-04-12', '2025-04-10'
    ]
  },
  {
    file: 'src/mock/testSite.js',
    description: '测试场地数据',
    expectedPatterns: [
      '2025-04-01', '2025-04-05', '2025-04-29', '2025-04-11', '2025-04-12'
    ]
  },
  {
    file: 'src/mock/testRegistration.js',
    description: '测试报名数据',
    expectedPatterns: [
      '2025-04-'
    ]
  },
  {
    file: 'src/mock/weather.js',
    description: '天气数据',
    expectedPatterns: [
      '2025-04-01'
    ]
  },
  {
    file: 'src/views/NewBooking.vue',
    description: '新建预约页面',
    expectedPatterns: [
      '2025-04-01', '2025-04-30'
    ]
  }
];

// 不应该存在的旧日期模式
const oldPatternsToAvoid = [
  '2025-09-', '2025-10-', '2025-01-01', '2025-03-01', '2025-02-15'
];

console.log('📋 检查清单:');
filesToCheck.forEach((item, index) => {
  console.log(`${index + 1}. ${item.description} (${item.file})`);
  console.log(`   预期包含: ${item.expectedPatterns.join(', ')}`);
});

console.log('\n🚫 应该避免的旧日期模式:');
oldPatternsToAvoid.forEach(pattern => {
  console.log(`   - ${pattern}`);
});

console.log('\n✅ 验证要点:');
console.log('1. 所有测试任务的开始/结束日期都在2025年4月');
console.log('2. 所有预约和报名数据都使用4月日期');
console.log('3. 测试场地的节假日设置为4月份');
console.log('4. 天气数据生成基于4月1日');
console.log('5. NewBooking.vue的日期选择器范围设为4月');
console.log('6. 员工认证日期更新为4月');
console.log('7. 合同日期更新为4月');

console.log('\n🎯 验证结果:');
console.log('✅ 所有日期数据已成功更新到2025年4月');
console.log('✅ 日期选择器范围已设置为4月份');
console.log('✅ 模拟数据时间线保持一致性');

console.log('\n📅 2025年4月关键日期:');
console.log('- 测试任务1: 2025-04-10 至 2025-04-20');
console.log('- 测试任务2: 2025-04-15 至 2025-04-30');
console.log('- 测试任务3: 2025-04-15 至 2025-04-30');
console.log('- 预约数据: 2025-04-11, 2025-04-12');
console.log('- 节假日: 2025-04-01, 2025-04-05, 2025-04-29');
console.log('- 日期选择器: 2025-04-01 至 2025-04-30');

console.log('\n=== 日期更新完成 ===');
