/**
 * 获取测试场列表
 * @param {Object} params - 查询参数
 * @param {string} params.city - 城市
 * @param {string} params.district - 区域
 * @returns {Promise} - 返回Promise对象，结构 { data: { content, pageable, totalElements, ... }, status, statusText, headers, config }
 */
export async function getTestSites(params = {}) {
  try {
    // Use booking groundList API
    const url = `https://cartest.douwifi.cn/artemis/api/v1/booking/groundList`;
    const queryParams = new URLSearchParams();

    if (params.provingGroundId) queryParams.append('provingGroundId', params.provingGroundId);
    if (params.provingGroundNm) queryParams.append('provingGroundNm', params.provingGroundNm);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('获取测试场列表原始API响应:', JSON.stringify(result, null, 2));

    // result.data is expected to be an array of ground objects
    const rawList = Array.isArray(result.data) ? result.data : (result.data || []);

    const sites = rawList.map(g => ({
      // keep original id fields and provide aliases used elsewhere in the app
      id: g.id || g.groundId,
      groundId: g.id || g.groundId,
      groundNo: g.groundNo,
      name: g.fullName || g.shortName || g.name || g.groundNo,
      fullName: g.fullName,
      shortName: g.shortName,
      provingGroundId: g.provingGroundId,
      provingGroundNm: g.provingGroundNm,
      maxCapacity: g.maxCapacity,
      weightLimit: g.weightLimit,
      speedLimit: g.speedLimit,
      isDivideLanes: g.isDivideLanes,
      testType: g.testType,
      vehicleTypeIds: g.vehicleTypeIds,
      rentalTypes: g.rentalTypes,
      status: g.status,
      description: g.description,
      remark: g.remark,
      sortNo: g.sortNo,
      terminalmanageId: g.terminalmanageId,
      child: g.child
    }));

    // Normalize pageable info if any
    const pageable = Array.isArray(result.data) ? {
      pageNumber: params.page || 0,
      pageSize: params.size || sites.length,
      total: sites.length
    } : (result.pageable || result.data?.pageable || { pageNumber: params.page || 0, pageSize: params.size || 10, total: sites.length });

    return {
      data: {
        content: sites,
        pageable,
        totalElements: sites.length,
        totalPages: Math.ceil(sites.length / (params.size || sites.length || 1)),
        last: true,
        first: (params.page || 0) === 0,
        numberOfElements: sites.length
      },
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取测试场列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取测试场详情
 * @param {string} siteId - 测试场ID
 * @returns {Promise}
 */
export async function getTestSiteById(siteId) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/${siteId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取测试场详情原始API响应:', JSON.stringify(result, null, 2));

    const site = result.data || {};
    const transformedSite = {
      siteId: site.id || site.siteId,
      name: site.name,
      location: site.location,
      facilities: site.facilities,
      status: site.status,
      description: site.description,
      capacity: site.capacity,
      contactInfo: site.contactInfo,
      images: site.images,
      createdAt: site.createdAt,
      updatedAt: site.updatedAt
    };

    return {
      data: transformedSite,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取测试场详情失败:', error);
    throw error;
  }
}

/**
 * 获取测试场可用时间段
 */
export async function getAvailableTimeSlots(params) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/available-slots`;
    const queryParams = new URLSearchParams();
    if (params.testSiteId) queryParams.append('testSiteId', params.testSiteId);
    if (params.date) queryParams.append('date', params.date);

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取可用时间段原始API响应:', JSON.stringify(result, null, 2));

    const timeSlots = result.data || result;
    return {
      data: timeSlots,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取可用时间段失败:', error);
    throw error;
  }
}

/**
 * 创建测试场预约
 */
export async function createBooking(bookingData) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/booking`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('创建测试场预约原始API响应:', JSON.stringify(result, null, 2));

    const booking = result.data || result;
    const transformedBooking = {
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status || 'PENDING',
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return {
      data: transformedBooking,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('创建测试场预约失败:', error);
    throw error;
  }
}

/**
 * 获取预约列表
 */
export async function getBookings(params = {}) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/bookings`;
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const response = await fetch(`${url}?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取预约列表原始API响应:', JSON.stringify(result, null, 2));

    const rawList = result.data?.content || result.data?.bookings || result.data || [];
    const bookings = (Array.isArray(rawList) ? rawList : []).map(booking => ({
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    return {
      data: {
        content: bookings,
        pageable: result.data?.pageable || {
          pageNumber: params.page || 0,
          pageSize: params.size || 10,
          total: result.data?.totalElements || bookings.length
        }
      },
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取预约列表失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取预约详情
 */
export async function getBookingById(bookingId) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/booking/${bookingId}`;

    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取预约详情原始API响应:', JSON.stringify(result, null, 2));

    const booking = result.data || {};
    const transformedBooking = {
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return {
      data: transformedBooking,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取预约详情失败:', error);
    throw error;
  }
}

/**
 * 更新预约信息
 */
export async function updateBooking(bookingId, bookingData) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/booking/${bookingId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('更新预约原始API响应:', JSON.stringify(result, null, 2));

    const booking = result.data || {};
    const transformedBooking = {
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return {
      data: transformedBooking,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('更新预约失败:', error);
    throw error;
  }
}

/**
 * 取消预约
 */
export async function cancelBooking(bookingId, data) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/booking/${bookingId}/cancel`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('取消预约原始API响应:', JSON.stringify(result, null, 2));

    const booking = result.data || {};
    const transformedBooking = {
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status || 'CANCELLED',
      cancelReason: booking.cancelReason || data.reason,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };

    return {
      data: transformedBooking,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('取消预约失败:', error);
    throw error;
  }
}

/**
 * 获取用户预约列表
 */
export async function getUserBookings(userId) {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/user/${userId}/bookings`;

    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取用户预约列表原始API响应:', JSON.stringify(result, null, 2));

    const bookings = (result.data || []).map(booking => ({
      bookingId: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      testSiteId: booking.testSiteId,
      bookingDate: booking.bookingDate,
      timeSlot: booking.timeSlot,
      serviceType: booking.serviceType,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));

    return {
      data: bookings,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取用户预约列表失败:', error);
    throw error;
  }
}

/**
 * 获取预约统计信息
 */
export async function getBookingStats() {
  try {
    const url = `http://${test_management_server}:${test_management_port}/api/test-site/booking/stats`;

    const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('获取预约统计原始API响应:', JSON.stringify(result, null, 2));

    const stats = result.data || {};
    return {
      data: stats,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response
    };
  } catch (error) {
    console.error('获取预约统计失败:', error);
    throw error;
  }
}