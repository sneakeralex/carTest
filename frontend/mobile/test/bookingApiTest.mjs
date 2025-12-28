import { mockResponse, delay } from '../src/mock/utils.js';
import { mockTestTasks } from '../src/mock/testTask.js';
import { mockWeatherData } from '../src/mock/weather.js';
import { getWeatherInfo } from '../src/api/weather.js';
import { mockBookings, checkTimeSlotAvailability } from '../src/mock/booking.js';

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

// 测试天气信息获取
const testWeatherInfo = async () => {
  const siteId = mockTestTasks.content[0].testSiteId;
  const date = '2025-09-11';
  
  const weather = await getWeatherInfo(siteId, date);
  console.log('天气信息:', weather.data);
  
  if (!weather.data) {
    throw new Error('天气数据为空');
  }
  if (typeof weather.data.suitable !== 'boolean') {
    throw new Error('天气适宜性判断数据无效');
  }
};

// 测试时间段可用性检查
const testTimeSlotAvailability = () => {
  const testSiteId = mockTestTasks.content[0].testSiteId;
  const date = '2025-09-11';
  const period = 'AM';
  
  const isAvailable = checkTimeSlotAvailability(testSiteId, date, period);
  console.log('时间段可用性:', isAvailable);
  
  if (typeof isAvailable !== 'boolean') {
    throw new Error('时间段可用性检查结果无效');
  }
};

// 测试预约系统数据一致性
const testBookingSystem = () => {
  // 检查已有预约数据
  console.log('当前预约列表:', mockBookings);
  
  // 检查预约数据结构
  const booking = mockBookings[0];
  if (!booking.taskId || !booking.testSiteId || !booking.period) {
    throw new Error('预约数据结构不完整');
  }
  
  // 检查与任务的关联
  const relatedTask = mockTestTasks.content.find(t => t.taskId === booking.taskId);
  if (!relatedTask) {
    throw new Error('预约任务关联丢失');
  }
  
  console.log('数据一致性检查通过');
};

// 运行所有测试
const runAllTests = async () => {
  try {
    await runTest('天气信息获取', testWeatherInfo);
    await runTest('时间段可用性检查', testTimeSlotAvailability);
    await runTest('预约创建', testBookingCreation);
    
    console.log('\n🎉 所有测试完成');
  } catch (error) {
    console.error('\n💥 测试过程中出现错误:', error);
    process.exit(1);
  }
};

// 执行测试
runAllTests();
