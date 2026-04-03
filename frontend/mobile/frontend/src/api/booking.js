// 可配置的预约服务地址
import { artemisRequest } from './request';
// Use environment variable only. Do NOT default to an absolute Artemis host in frontend code.
export const test_management_base_url = (globalThis?.import?.meta?.env?.VITE_TEST_MANAGEMENT_BASE_URL) || '';

/**
 * 生成带认证头的fetch选项
 * @param {string} method - HTTP方法
 * @param {string} url - 请求URL
 * @param {Object} options - 其他选项
 * @param {string} token - 访问token
 * @returns {Object} - fetch选项
 */

/**
 * 获取预约列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export async function getBookings(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append('userId', params.userId);
    if (params.status) queryParams.append('status', params.status);
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);
    if (params.pageNum) queryParams.append('pageNum', params.pageNum);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const queryString = queryParams.toString();
    const url = `${test_management_base_url}/api/v1/booking/list${queryString ? '?' + queryString : ''}`;
    console.log('获取预约列表请求URL:', url);

    // Use artemisRequest via proxy
    const proxiedPath = `/artemis/api/v1/booking/list${queryString ? '?' + queryString : ''}`;
    const res = await artemisRequest(proxiedPath, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data;
    console.log('预约列表原始API响应:', JSON.stringify(result, null, 2));
    console.log('API响应码:', result.code);
    console.log('响应码类型:', typeof result.code);

    if (result.code !== '0' && result.code !== 200 && result.code !== '200') {
      console.error('API响应码检查失败:', { 
        actualCode: result.code, 
        actualType: typeof result.code,
        expectedCodes: ['0', 200, '200']
      });
      throw new Error(result.msg || '获取预约列表失败');
    }

    // 找到实际的预约数据
    let rawBookings = [];
    if (result?.rows && Array.isArray(result.rows)) {
      rawBookings = result.rows;
    } else if (result?.result?.rows && Array.isArray(result.result.rows)) {
      rawBookings = result.result.rows;
    } else if (result?.data?.list && Array.isArray(result.data.list)) {
      rawBookings = result.data.list;
    } else if (result?.data && Array.isArray(result.data)) {
      rawBookings = result.data;
    } else if (Array.isArray(result)) {
      rawBookings = result;
    } else {
      console.warn('没有找到有效的预约数据数组');
      rawBookings = [];
    }

    // Transform the response to match the expected format
    const bookings = rawBookings.map(booking => ({
      id: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName || booking.vehicle?.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes || booking.remark,
      userId: booking.userId,
      userName: booking.userName || booking.user?.name,
      createdAt: booking.createdAt || booking.createTime,
      updatedAt: booking.updatedAt || booking.updateTime,
      // Keep original fields for compatibility
      ...booking
    }));

    return bookings;
  } catch (error) {
    console.error('获取预约列表失败:', error);
    throw error;
  }
}

/**
 * 创建预约
 * @param {Object} bookingData - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createBooking(bookingData) {
  try {
    const requestData = {
      userId: bookingData.userId,
      vin: bookingData.vin,
      bookingNo: bookingData.bookingNo,
      projectNo: bookingData.projectNo,
      provingGroundId: bookingData.provingGroundId,
      groundId: bookingData.groundId,
      testTypeId: bookingData.testTypeId,
      testContent: bookingData.testContent,
      bookingDate: bookingData.bookingDate,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      driverId: bookingData.driverId,
      isExclusive: bookingData.isExclusive,
      billingType: bookingData.billingType,
      auxiliaryVehicleCount: bookingData.auxiliaryVehicleCount,
      participantCount: bookingData.participantCount,
      imagingRequirement: bookingData.imagingRequirement,
      remark: bookingData.remark
    };

    const url = `${test_management_base_url}/api/v1/booking/add`;
    console.log('创建预约请求URL:', url, '数据:', JSON.stringify(requestData, null, 2));

    const res = await artemisRequest('/artemis/api/v1/booking/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const result = res?.data;
    console.log('创建预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '创建预约失败');
    }

    // Transform the response to match the expected format
    const booking = result?.data || result;
    const transformedBooking = {
      id: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName || booking.vehicle?.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes || booking.remark,
      userId: booking.userId,
      userName: booking.userName || booking.user?.name,
      createdAt: booking.createdAt || booking.createTime,
      updatedAt: booking.updatedAt || booking.updateTime,
      // Keep original fields for compatibility
      ...booking
    };

    return transformedBooking;
  } catch (error) {
    console.error('创建预约失败:', error);
    throw error;
  }
}

/**
 * 根据ID获取预约详情
 * @param {string} id - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getBookingById(id) {
  try {
    const url = `${test_management_base_url}/api/v1/booking/detail/${id}`;
    console.log('获取预约详情请求URL:', url);

    const res = await artemisRequest(`/artemis/api/v1/booking/detail/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data;
    console.log('预约详情原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取预约详情失败');
    }

    // Transform the response to match the expected format
    const booking = result?.data || result;
    const transformedBooking = {
      id: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName || booking.vehicle?.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes || booking.remark,
      userId: booking.userId,
      userName: booking.userName || booking.user?.name,
      createdAt: booking.createdAt || booking.createTime,
      updatedAt: booking.updatedAt || booking.updateTime,
      // Keep original fields for compatibility
      ...booking
    };

    return transformedBooking;
  } catch (error) {
    console.error('获取预约详情失败:', error);
    throw error;
  }
}

/**
 * 更新预约信息
 * @param {Object} bookingData - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateBooking(bookingData) {
  try {
    const requestData = {
      id: bookingData.id,
      vehicleId: bookingData.vehicleId,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      notes: bookingData.notes,
      userId: bookingData.userId,
      status: bookingData.status,
      // Add any other required fields
      ...bookingData
    };

    const url = `${test_management_base_url}/api/v1/booking/update`;
    console.log('更新预约请求URL:', url, '数据:', JSON.stringify(requestData, null, 2));

    const res = await artemisRequest('/artemis/api/v1/booking/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    const result = res?.data;
    console.log('更新预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '更新预约失败');
    }

    // Transform the response to match the expected format
    const booking = result?.data || result;
    const transformedBooking = {
      id: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName || booking.vehicle?.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes || booking.remark,
      userId: booking.userId,
      userName: booking.userName || booking.user?.name,
      createdAt: booking.createdAt || booking.createTime,
      updatedAt: booking.updatedAt || booking.updateTime,
      // Keep original fields for compatibility
      ...booking
    };

    return transformedBooking;
  } catch (error) {
    console.error('更新预约信息失败:', error);
    throw error;
  }
}

/**
 * 取消预约
 * @param {string} id - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelBooking(id) {
  try {
    const url = `${test_management_base_url}/api/v1/booking/cancel/${id}`;
    console.log('取消预约请求URL:', url);

    const res = await artemisRequest(`/artemis/api/v1/booking/cancel/${id}`, { method: 'PUT', body: JSON.stringify({}) });
    const result = res?.data;
    console.log('取消预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '取消预约失败');
    }

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('取消预约失败:', error);
    throw error;
  }
}

/**
 * 获取可用时间段
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export async function getAvailableTimeSlots(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.vehicleId) queryParams.append('vehicleId', params.vehicleId);
    if (params.date) queryParams.append('date', params.date);
    if (params.startTime) queryParams.append('startTime', params.startTime);
    if (params.endTime) queryParams.append('endTime', params.endTime);

    const queryString = queryParams.toString();
    const url = `${test_management_base_url}/api/v1/booking/available-slots${queryString ? '?' + queryString : ''}`;
    console.log('获取可用时间段请求URL:', url);

    const res = await artemisRequest(`/artemis/api/v1/booking/available-slots${queryString ? '?' + queryString : ''}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data;
    console.log('可用时间段原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取可用时间段失败');
    }

    // Transform the response to match the expected format
    const slots = result?.data || result || [];

    return slots;
  } catch (error) {
    console.error('获取可用时间段失败:', error);
    throw error;
  }
}

/**
 * 批准预约
 * @param {string} id - 预约ID
 * @param {Object} data - 审批数据
 * @returns {Promise} - 返回Promise对象
 */
export async function approveBooking(id, data) {
  try {
    const url = `${test_management_base_url}/api/v1/booking/approve/${id}`;
    console.log('批准预约请求URL:', url, '数据:', JSON.stringify(data, null, 2));

    const res = await artemisRequest(`/artemis/api/v1/booking/approve/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = res?.data;
    console.log('批准预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '批准预约失败');
    }

    return {
      data: result.data || { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('批准预约失败:', error);
    throw error;
  }
}

/**
 * 重新安排预约
 * @param {Object} rescheduleData - 重新安排数据
 * @returns {Promise} - 返回Promise对象
 */
export async function rescheduleBooking(rescheduleData) {
  try {
    const requestData = {
      id: rescheduleData.id,
      status: rescheduleData.status,
      suggestedTime: rescheduleData.suggestedTime,
      reason: rescheduleData.reason,
      approverId: rescheduleData.approverId,
      approverName: rescheduleData.approverName,
      // Add any other required fields
      ...rescheduleData
    };

    const url = `${test_management_base_url}/api/v1/booking/reschedule/${rescheduleData.id}`;
    console.log('重新安排预约请求URL:', url, '数据:', JSON.stringify(requestData, null, 2));

    const res = await artemisRequest(`/artemis/api/v1/booking/reschedule/${rescheduleData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });
    const result = res?.data;
    console.log('重新安排预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '重新安排预约失败');
    }

    // Transform the response to match the expected format
    const booking = result?.data || result;
    const transformedBooking = {
      id: booking.id || booking.bookingId,
      vehicleId: booking.vehicleId,
      vehicleName: booking.vehicleName || booking.vehicle?.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      notes: booking.notes || booking.remark,
      userId: booking.userId,
      userName: booking.userName || booking.user?.name,
      createdAt: booking.createdAt || booking.createTime,
      updatedAt: booking.updatedAt || booking.updateTime,
      // Keep original fields for compatibility
      ...booking
    };

    return transformedBooking;
  } catch (error) {
    console.error('重新安排预约失败:', error);
    throw error;
  }
}

/**
 * 获取场地列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export async function getGroundList(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    if (params.pageNum) queryParams.append('pageNum', params.pageNum);
    if (params.pageSize) queryParams.append('pageSize', params.pageSize);

    const queryString = queryParams.toString();
    const url = `${test_management_base_url}/ground/list${queryString ? '?' + queryString : ''}`;
    console.log('获取场地列表请求URL:', url);

    const res = await artemisRequest(`/artemis/ground/list${queryString ? '?' + queryString : ''}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data;
    console.log('场地列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取场地列表失败');
    }

    // Transform the response to match the expected format
    const grounds = (result?.data || []).map(ground => ({
      id: ground.id,
      name: ground.fullName || ground.shortName || ground.name,
      groundNo: ground.groundNo,
      provingGroundId: ground.provingGroundId,
      maxCapacity: ground.maxCapacity,
      weightLimit: ground.weightLimit,
      speedLimit: ground.speedLimit,
      status: ground.status,
      description: ground.description,
      remark: ground.remark,
      sortNo: ground.sortNo,
      // Keep original fields for compatibility
      ...ground
    }));

    return grounds;
  } catch (error) {
    console.error('获取场地列表失败:', error);
    throw error;
  }
}

/**
 * 获取VIN列表
 * @param {string} corpId - 企业ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getVinList(corpId) {
  try {
    const url = `${test_management_base_url}/api/v1/booking/getVinList/${corpId}`;
    console.log('获取VIN列表请求URL:', url);

    const res = await artemisRequest(`/artemis/api/v1/booking/getVinList/${corpId}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data;
    console.log('VIN列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取VIN列表失败');
    }

    // Transform the response to match the expected format
    const vins = result?.data || result || [];

    return {
      data: vins,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取VIN列表失败:', error);
    throw error;
  }
}

/**
 * 获取预约编号
 * @param {string} prefix - 前缀
 * @returns {Promise} - 返回Promise对象
 */
export async function getBookingNo(prefix) {
  const maxRetries = 3;
  const retryDelay = 1000; // 1秒延迟
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const url = `${test_management_base_url}/api/v1/booking/getBookingNo/${prefix}`;
      console.log(`获取预约编号请求URL: ${url} (尝试 ${attempt}/${maxRetries})`);

      // Use artemisRequest with a timeout via Promise.race
      const timeoutMs = 10000;
      const requestPromise = artemisRequest(`/artemis/api/v1/booking/getBookingNo/${prefix}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('请求超时')), timeoutMs));

      const res = await Promise.race([requestPromise, timeoutPromise]);
      const result = res?.data;

      console.log('预约编号原始API响应:', JSON.stringify(result, null, 2));

      if (result.code !== '0' && result.code !== 200) {
        throw new Error(result.msg || '获取预约编号失败');
      }

      // Return the booking number directly
      const bookingNo = result?.data || result;

      return {
        data: bookingNo,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    } catch (error) {
      console.error(`获取预约编号失败 (尝试 ${attempt}/${maxRetries}):`, error);
      
      // 如果是最后一次尝试，直接抛出错误
      if (attempt === maxRetries) {
        // 增强错误信息
        if (error.message && error.message.includes('请求超时')) {
          throw new Error('请求超时');
        } else if (error.message && error.message.includes('Failed to fetch')) {
          throw new Error('网络连接失败');
        } else {
          throw error;
        }
      }
      
      // 如果不是最后一次尝试，等待后重试
      if (attempt < maxRetries) {
        console.log(`等待 ${retryDelay}ms 后重试...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  }
}

/**
 * 获取项目列表
 * @returns {Promise} - 返回Promise对象
 */
export async function getTestItems() {
  const url = `${test_management_base_url}/api/v1/ground/testItem`;
  console.log('获取项目列表请求URL:', url);

  const res = await artemisRequest(`/artemis/api/v1/ground/testItem`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
  const result = res?.data;
  console.log('项目列表原始API响应:', JSON.stringify(result, null, 2));

  if (result.code !== '0' && result.code !== 200) {
    throw new Error(result.msg || '获取项目列表失败');
  }

  // Transform the response to match the expected format
  const testItems = result?.data || result || [];

  return {
    data: testItems,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };
}
