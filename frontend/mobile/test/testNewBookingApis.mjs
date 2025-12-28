import { getVinList, getBookingNo, getTestItems } from '../src/api/booking.js';

// 测试辅助函数
const runTest = async (testName, testFn) => {
  console.log(`\n🧪 开始测试: ${testName}`);
  try {
    await testFn();
    console.log('✅ 测试通过');
  } catch (error) {
    console.error('❌ 测试失败:', error);
    throw error;
  }
};

// 测试获取VIN列表
const testGetVinList = async () => {
  // 模拟企业ID
  const corpId = 'test-corp-123';

  console.log('测试获取VIN列表，corpId:', corpId);
  const response = await getVinList(corpId);

  console.log('VIN列表响应:', response);

  if (!response || !response.data) {
    throw new Error('VIN列表响应无效');
  }

  console.log('VIN列表数据:', response.data);
};

// 测试获取预约编号
const testGetBookingNo = async () => {
  const prefix = `BK-${Date.now()}`;

  console.log('测试获取预约编号，prefix:', prefix);
  const response = await getBookingNo(prefix);

  console.log('预约编号响应:', response);

  if (!response || !response.data) {
    throw new Error('预约编号响应无效');
  }

  console.log('生成的预约编号:', response.data);
};

// 测试获取项目列表
const testGetTestItems = async () => {
  console.log('测试获取项目列表');
  const response = await getTestItems();

  console.log('项目列表响应:', response);

  if (!response || !response.data) {
    throw new Error('项目列表响应无效');
  }

  console.log('项目列表数据:', response.data);
};

// 主测试函数
const runAllTests = async () => {
  console.log('🚀 开始测试新的预约API函数');

  try {
    await runTest('获取VIN列表', testGetVinList);
    await runTest('获取预约编号', testGetBookingNo);
    await runTest('获取项目列表', testGetTestItems);

    console.log('\n🎉 所有测试通过！');
  } catch (error) {
    console.error('\n💥 测试失败:', error);
    process.exit(1);
  }
};

// 运行测试
runAllTests();
