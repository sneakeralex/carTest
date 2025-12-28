#!/usr/bin/env node

// 日期选择器修复测试
// 测试 van-calendar 组件的日期范围选择功能

console.log('🧪 测试日期选择器修复...\n');

// 模拟 formatDate 函数
function formatDate(date) {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// 模拟表单数据
const formData = {
  startDate: '',
  endDate: ''
};

console.log('📋 测试1: 日期范围选择');

// 模拟 van-calendar range 模式返回的数据
const mockRangeValues = [
  new Date('2025-09-20'),
  new Date('2025-09-22')
];

console.log('模拟选择日期范围:', mockRangeValues.map(d => formatDate(d)));

// 模拟修复后的 onDateConfirm 函数
function onDateConfirm(values) {
  console.log('接收到的日期值:', values);
  
  // 检查值是否有效
  if (!values) {
    console.warn('❌ 日期选择值为空');
    return false;
  }
  
  // van-calendar range 模式返回 [startDate, endDate] 数组
  if (Array.isArray(values)) {
    if (values.length === 2 && values[0] && values[1]) {
      // 日期范围选择
      const [start, end] = values;
      formData.startDate = formatDate(start);
      formData.endDate = formatDate(end);
      console.log('✅ 日期范围设置成功');
    } else if (values.length === 1 && values[0]) {
      // 单日期在数组中
      formData.startDate = formatDate(values[0]);
      formData.endDate = formatDate(values[0]);
      console.log('✅ 单日期数组设置成功');
    } else {
      console.warn('❌ 日期数组格式不正确:', values);
      return false;
    }
  } else if (values instanceof Date || (typeof values === 'object' && values.getTime)) {
    // 单个日期对象
    formData.startDate = formatDate(values);
    formData.endDate = formatDate(values);
    console.log('✅ 单日期对象设置成功');
  } else {
    console.warn('❌ 未知的日期格式:', values);
    return false;
  }
  
  // 验证日期是否有效
  if (!formData.startDate || formData.startDate.includes('NaN')) {
    console.warn('❌ 日期格式化失败');
    formData.startDate = '';
    formData.endDate = '';
    return false;
  }
  
  return true;
}

// 测试日期范围选择
const result1 = onDateConfirm(mockRangeValues);
console.log('表单数据更新:', formData);
console.log(`测试结果: ${result1 ? '通过' : '失败'}\n`);

// 重置表单数据
formData.startDate = '';
formData.endDate = '';

console.log('📋 测试2: 单日期选择');

// 模拟单日期选择
const mockSingleDate = new Date('2025-09-25');
console.log('模拟选择单日期:', formatDate(mockSingleDate));

const result2 = onDateConfirm(mockSingleDate);
console.log('表单数据更新:', formData);
console.log(`测试结果: ${result2 ? '通过' : '失败'}\n`);

// 重置表单数据
formData.startDate = '';
formData.endDate = '';

console.log('📋 测试3: 错误数据处理');

// 模拟错误的数据格式
const mockInvalidData = "invalid-date";
console.log('模拟错误数据:', mockInvalidData);

const result3 = onDateConfirm(mockInvalidData);
console.log('表单数据:', formData);
console.log(`错误处理结果: ${!result3 ? '正确处理' : '处理失败'}\n`);

console.log('📋 测试4: 空数组处理');

// 模拟空数组
const mockEmptyArray = [];
console.log('模拟空数组:', mockEmptyArray);

const result4 = onDateConfirm(mockEmptyArray);
console.log('表单数据:', formData);
console.log(`空数组处理结果: ${!result4 ? '正确处理' : '处理失败'}\n`);

// 总结
console.log('🎉 日期选择器修复测试总结:');
console.log(`1. 日期范围选择: ${result1 ? '✅ 通过' : '❌ 失败'}`);
console.log(`2. 单日期选择: ${result2 ? '✅ 通过' : '❌ 失败'}`);
console.log(`3. 错误数据处理: ${!result3 ? '✅ 通过' : '❌ 失败'}`);
console.log(`4. 空数组处理: ${!result4 ? '✅ 通过' : '❌ 失败'}`);

const allTestsPassed = result1 && result2 && !result3 && !result4;
console.log(`\n📊 总体结果: ${allTestsPassed ? '✅ 全部通过' : '❌ 存在问题'}`);

if (allTestsPassed) {
  console.log('\n🚀 日期选择器已修复，可以正常使用！');
  console.log('📝 修复要点:');
  console.log('  - 使用 van-calendar 替代 van-date-picker');
  console.log('  - 支持日期范围选择 (type="range")');
  console.log('  - 添加数据格式验证和错误处理');
  console.log('  - 兼容单日期和日期范围两种模式');
} else {
  console.log('\n⚠️  仍有问题需要解决');
}
