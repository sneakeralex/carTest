import { 
  getMobileDashboardStats,
  getRecentBookings,
  getNotifications,
  getQuickActions
} from '../src/api/dashboard.js';

async function testDashboardApi() {
  try {
    console.log('1. 测试获取仪表盘统计数据');
    const statsResponse = await getMobileDashboardStats();
    console.log('统计数据:', JSON.stringify(statsResponse.data, null, 2));

    console.log('\n2. 测试获取最近预约');
    const bookingsResponse = await getRecentBookings();
    console.log('最近预约:', JSON.stringify(bookingsResponse.data, null, 2));

    console.log('\n3. 测试获取通知');
    const notificationsResponse = await getNotifications();
    console.log('通知列表:', JSON.stringify(notificationsResponse.data, null, 2));

    console.log('\n4. 测试获取快捷操作');
    const actionsResponse = await getQuickActions();
    console.log('快捷操作:', JSON.stringify(actionsResponse.data, null, 2));

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testDashboardApi();