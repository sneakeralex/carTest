import { 
  getTestSites,
  getTestSiteById,
  createBooking,
  getBookings,
  getAvailableTimeSlots
} from '../src/api/testSite.js';

async function testTestSiteApi() {
  try {
    console.log('1. 测试获取测试场地列表');
    const sitesResponse = await getTestSites();
    console.log('测试场地列表:', JSON.stringify(sitesResponse.data, null, 2));

    console.log('\n2. 测试获取测试场地详情');
    const siteId = sitesResponse.data[0].siteId;
    const siteDetailsResponse = await getTestSiteById(siteId);
    console.log('测试场地详情:', JSON.stringify(siteDetailsResponse.data, null, 2));

    console.log('\n3. 测试获取预约时间段');
    const timeSlotsResponse = await getAvailableTimeSlots({
      testSiteId: siteId,
      date: '2025-09-15'
    });
    console.log('预约时间段:', JSON.stringify(timeSlotsResponse.data, null, 2));

    console.log('\n4. 测试创建预约');
    const bookingData = {
      testSiteId: siteId,
      bookingDate: '2025-09-15',
      timeSlot: '09:00-10:00',
      vehicleId: '1',
      serviceType: '碰撞测试',
      notes: '测试预约'
    };
    const bookingResponse = await createBooking(bookingData);
    console.log('创建预约响应:', JSON.stringify(bookingResponse.data, null, 2));

    console.log('\n5. 测试获取预约列表');
    const bookingsResponse = await getBookings({ status: 'PENDING' });
    console.log('预约列表:', JSON.stringify(bookingsResponse.data, null, 2));

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testTestSiteApi();
