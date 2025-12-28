import {
  getTestTasks,
  createTestRegistration,
  getTestRegistrationById
} from '../src/api/testTask.js';

import {
  getTestSites,
  createBooking,
  getBookingById
} from '../src/api/testSite.js';

import {
  login,
  register,
  getUserInfo
} from '../src/api/auth.js';

import {
  getMobileVehicles,
  addUserVehicle
} from '../src/api/vehicle.js';

import {
  getAppointments,
  createAppointment
} from '../src/api/appointment.js';

import {
  getMobileDashboardStats,
  getRecentBookings,
  getNotifications
} from '../src/api/dashboard.js';

async function runTests() {
  try {
    console.log('1. 测试认证相关 API');
    console.log('\n1.1 用户登录');
    const loginResult = await login('test_user', '123456');
    console.log('登录结果:', JSON.stringify(loginResult.data, null, 2));

    console.log('\n1.2 获取用户信息');
    const userInfo = await getUserInfo();
    console.log('用户信息:', JSON.stringify(userInfo.data, null, 2));

    console.log('\n2. 测试车辆相关 API');
    console.log('\n2.1 获取车辆列表');
    const vehicles = await getMobileVehicles();
    console.log('车辆列表:', JSON.stringify(vehicles.data, null, 2));

    console.log('\n2.2 添加新车辆');
    const newVehicle = await addUserVehicle('1', {
      licensePlate: '沪C12345',
      brand: '特斯拉',
      model: 'Model Y',
      year: '2025',
      color: '白色'
    });
    console.log('新增车辆:', JSON.stringify(newVehicle.data, null, 2));

    console.log('\n3. 测试预约相关 API');
    console.log('\n3.1 获取测试场地列表');
    const sites = await getTestSites();
    console.log('测试场地:', JSON.stringify(sites.data, null, 2));

    console.log('\n3.2 创建测试报名');
    const newRegistration = await createTestRegistration({
      taskId: '1',
      userId: '1',
      notes: '测试报名'
    });
    console.log('新建报名:', JSON.stringify(newRegistration.data, null, 2));

    console.log('\n4. 测试仪表盘相关 API');
    console.log('\n4.1 获取仪表盘统计信息');
    const dashboardStats = await getMobileDashboardStats();
    console.log('仪表盘统计:', JSON.stringify(dashboardStats.data, null, 2));

    console.log('\n4.2 获取最近预约');
    const recentBookings = await getRecentBookings();
    console.log('最近预约:', JSON.stringify(recentBookings.data, null, 2));

    console.log('\n4.3 获取通知');
    const notifications = await getNotifications();
    console.log('通知列表:', JSON.stringify(notifications.data, null, 2));

  } catch (error) {
    console.error('测试出错:', error);
  }
}

// 运行测试
runTests();
