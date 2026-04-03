import { mockAppointments, SERVICE_TYPES, APPOINTMENT_STATUS } from '../mock/appointment.js';
import { artemisRequest } from './request';

// 判断是否使用mock数据
const useMock = false; // Changed to false to prefer real API

// 模拟API响应延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response format
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

/**
 * 获取维修保养预约列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 预约状态
 * @param {string} params.serviceType - 服务类型
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getAppointments(params = {}) {
  if (useMock) {
    await delay(500);
    let filteredAppointments = [...mockAppointments];
    
    if (params.status) {
      filteredAppointments = filteredAppointments.filter(a => a.status === params.status);
    }
    if (params.serviceType) {
      filteredAppointments = filteredAppointments.filter(a => a.serviceType === params.serviceType);
    }
    if (params.startDate) {
      filteredAppointments = filteredAppointments.filter(a => 
        new Date(a.appointmentTime) >= new Date(params.startDate)
      );
    }
    if (params.endDate) {
      filteredAppointments = filteredAppointments.filter(a => 
        new Date(a.appointmentTime) <= new Date(params.endDate)
      );
    }
    
    return mockResponse({
      content: filteredAppointments,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10,
        total: filteredAppointments.length
      }
    });
  }

  try {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.serviceType) queryParams.append('serviceType', params.serviceType);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.page !== undefined) queryParams.append('page', params.page);
    if (params.size) queryParams.append('size', params.size);

    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments?${queryParams}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取预约列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取预约列表失败');
    }

    // Transform response to expected format
    const appointments = (result.data?.list || result.data?.appointments || result.data || []).map(appointment => ({
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    }));

    return mockResponse({
      content: appointments,
      pageable: {
        pageNumber: result.data?.pageNo || params.page || 0,
        pageSize: result.data?.pageSize || params.size || 10,
        total: result.data?.total || appointments.length
      }
    });
  } catch (error) {
    console.error('获取预约列表失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    let filteredAppointments = [...mockAppointments];
    
    if (params.status) {
      filteredAppointments = filteredAppointments.filter(a => a.status === params.status);
    }
    if (params.serviceType) {
      filteredAppointments = filteredAppointments.filter(a => a.serviceType === params.serviceType);
    }
    if (params.startDate) {
      filteredAppointments = filteredAppointments.filter(a => 
        new Date(a.appointmentTime) >= new Date(params.startDate)
      );
    }
    if (params.endDate) {
      filteredAppointments = filteredAppointments.filter(a => 
        new Date(a.appointmentTime) <= new Date(params.endDate)
      );
    }
    
    return mockResponse({
      content: filteredAppointments,
      pageable: {
        pageNumber: params.page || 0,
        pageSize: params.size || 10,
        total: filteredAppointments.length
      }
    });
  }
}

/**
 * 根据ID获取维修保养预约详情
 * @param {string} appointmentId - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getAppointmentById(appointmentId) {
  if (useMock) {
    await delay(300);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }
    return mockResponse(appointment);
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/${appointmentId}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取预约详情原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取预约详情失败');
    }

    // Transform response
    const appointment = result.data;
    const transformedAppointment = {
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };

    return mockResponse(transformedAppointment);
  } catch (error) {
    console.error('获取预约详情失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }
    return mockResponse(appointment);
  }
}

/**
 * 创建维修保养预约
 * @param {Object} appointmentData - 预约数据
 * @param {string} appointmentData.serviceType - 服务类型
 * @param {string} appointmentData.appointmentTime - 预约时间 (ISO 格式)
 * @param {string} appointmentData.vehicleId - 车辆ID
 * @param {string} [appointmentData.description] - 服务描述
 * @param {string} [appointmentData.notes] - 备注信息
 * @param {string} [appointmentData.status='PENDING'] - 预约状态
 * @returns {Promise} - 返回Promise对象
 */
export async function createAppointment(appointmentData) {
  if (useMock) {
    await delay(800);
    const newAppointment = {
      appointmentId: String(mockAppointments.length + 1),
      ...appointmentData,
      status: appointmentData.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 添加车辆信息（在实际应用中应该从车辆服务获取）
    newAppointment.vehicle = {
      licensePlate: '测试车牌',
      brand: '测试品牌',
      model: '测试型号'
    };
    
    mockAppointments.push(newAppointment);
    return mockResponse(newAppointment);
  }

  try {
    const res = await artemisRequest('/artemis/api/appointment/v1/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    const result = res?.data;
    console.log('创建预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '创建预约失败');
    }

    // Transform response
    const appointment = result.data;
    const transformedAppointment = {
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };

    return mockResponse(transformedAppointment);
  } catch (error) {
    console.error('创建预约失败，使用mock数据:', error);
    // Fallback to mock
    await delay(800);
    const newAppointment = {
      appointmentId: String(mockAppointments.length + 1),
      ...appointmentData,
      status: appointmentData.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 添加车辆信息（在实际应用中应该从车辆服务获取）
    newAppointment.vehicle = {
      licensePlate: '测试车牌',
      brand: '测试品牌',
      model: '测试型号'
    };
    
    mockAppointments.push(newAppointment);
    return mockResponse(newAppointment);
  }
}

/**
 * 更新维修保养预约
 * @param {string} appointmentId - 预约ID
 * @param {Object} appointmentData - 预约数据
 * @param {string} [appointmentData.serviceType] - 服务类型
 * @param {string} [appointmentData.appointmentTime] - 预约时间
 * @param {string} [appointmentData.vehicleId] - 车辆ID
 * @param {string} [appointmentData.description] - 服务描述
 * @param {string} [appointmentData.notes] - 备注信息
 * @param {string} [appointmentData.status] - 预约状态
 * @returns {Promise} - 返回Promise对象
 */
export async function updateAppointment(appointmentId, appointmentData) {
  if (useMock) {
    await delay(500);
    const index = mockAppointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      throw new Error('预约不存在');
    }
    
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...appointmentData,
      updatedAt: new Date().toISOString()
    };
    
    return mockResponse(mockAppointments[index]);
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData)
    });
    const result = res?.data;
    console.log('更新预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '更新预约失败');
    }

    // Transform response
    const appointment = result.data;
    const transformedAppointment = {
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };

    return mockResponse(transformedAppointment);
  } catch (error) {
    console.error('更新预约失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    const index = mockAppointments.findIndex(a => a.appointmentId === appointmentId);
    if (index === -1) {
      throw new Error('预约不存在');
    }
    
    mockAppointments[index] = {
      ...mockAppointments[index],
      ...appointmentData,
      updatedAt: new Date().toISOString()
    };
    
    return mockResponse(mockAppointments[index]);
  }
}

/**
 * 取消维修保养预约
 * @param {string} appointmentId - 预约ID
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelAppointment(appointmentId) {
  if (useMock) {
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }
    
    appointment.status = 'CANCELLED';
    appointment.updatedAt = new Date().toISOString();
    return mockResponse({ success: true });
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/${appointmentId}/cancel`, { method: 'PUT' });
    const result = res?.data;
    console.log('取消预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '取消预约失败');
    }

    return mockResponse({ success: true });
  } catch (error) {
    console.error('取消预约失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }
    
    appointment.status = 'CANCELLED';
    appointment.updatedAt = new Date().toISOString();
    return mockResponse({ success: true });
  }
}

/**
 * 获取用户的维修保养预约列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getUserAppointments(userId) {
  if (useMock) {
    await delay(500);
    const userAppointments = mockAppointments.filter(a => a.userId === userId);
    return mockResponse(userAppointments);
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/user/${userId}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取用户预约列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取用户预约列表失败');
    }

    // Transform response
    const appointments = (result.data?.list || result.data?.appointments || result.data || []).map(appointment => ({
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    }));

    return mockResponse(appointments);
  } catch (error) {
    console.error('获取用户预约列表失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    const userAppointments = mockAppointments.filter(a => a.userId === userId);
    return mockResponse(userAppointments);
  }
}

/**
 * 获取可用的预约时间段
 * @param {string} date - 日期，格式：YYYY-MM-DD
 * @param {string} [serviceType] - 服务类型
 * @returns {Promise<Array<string>>} - 返回可用时间段列表，格式为 ISO 字符串
 */
export async function getAvailableTimeSlots(date, serviceType) {
  if (useMock) {
    await delay(300);
    // 生成模拟的可用时间段
    const timeSlots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots.push({
        time,
        available: Math.random() > 0.3 // 随机设置是否可用
      });
    }
    
    return mockResponse(timeSlots);
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('date', date);
    if (serviceType) queryParams.append('serviceType', serviceType);

    const res = await artemisRequest(`/artemis/api/appointment/v1/available-slots?${queryParams}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取可用时间段原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取可用时间段失败');
    }

    // Transform response
    const timeSlots = (result.data?.slots || result.data || []).map(slot => ({
      time: slot.time,
      available: slot.available
    }));

    return mockResponse(timeSlots);
  } catch (error) {
    console.error('获取可用时间段失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    // 生成模拟的可用时间段
    const timeSlots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots.push({
        time,
        available: Math.random() > 0.3 // 随机设置是否可用
      });
    }
    
    return mockResponse(timeSlots);
  }
}

/**
 * 审批预约
 * @param {string} appointmentId - 预约ID
 * @param {Object} data - 审批数据
 * @returns {Promise} - 返回Promise对象
 */
export async function approveAppointment(appointmentId, data) {
  if (useMock) {
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    appointment.status = 'APPROVED';
    appointment.updatedAt = new Date().toISOString();
    return mockResponse(appointment);
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/${appointmentId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = res?.data;
    console.log('审批预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '审批预约失败');
    }

    // Transform response
    const appointment = result.data;
    const transformedAppointment = {
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };

    return mockResponse(transformedAppointment);
  } catch (error) {
    console.error('审批预约失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    appointment.status = 'APPROVED';
    appointment.updatedAt = new Date().toISOString();
    return mockResponse(appointment);
  }
}

/**
 * 改期预约
 * @param {string} appointmentId - 预约ID
 * @param {Object} data - 改期数据
 * @returns {Promise} - 返回Promise对象
 */
export async function rescheduleAppointment(appointmentId, data) {
  if (useMock) {
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    appointment.appointmentTime = data.newAppointmentTime;
    appointment.updatedAt = new Date().toISOString();
    return mockResponse(appointment);
  }

  try {
    const res = await artemisRequest(`/artemis/api/appointment/v1/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = res?.data;
    console.log('改期预约原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '改期预约失败');
    }

    // Transform response
    const appointment = result.data;
    const transformedAppointment = {
      appointmentId: appointment.id || appointment.appointmentId,
      userId: appointment.userId,
      vehicleId: appointment.vehicleId,
      serviceType: appointment.serviceType,
      appointmentTime: appointment.appointmentTime,
      description: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
      vehicle: appointment.vehicle || {
        licensePlate: appointment.licensePlate,
        brand: appointment.brand,
        model: appointment.model
      },
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt
    };

    return mockResponse(transformedAppointment);
  } catch (error) {
    console.error('改期预约失败，使用mock数据:', error);
    // Fallback to mock
    await delay(500);
    const appointment = mockAppointments.find(a => a.appointmentId === appointmentId);
    if (!appointment) {
      throw new Error('预约不存在');
    }

    appointment.appointmentTime = data.newAppointmentTime;
    appointment.updatedAt = new Date().toISOString();
    return mockResponse(appointment);
  }
}