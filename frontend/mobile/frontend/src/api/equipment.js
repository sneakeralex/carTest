// 模拟API响应延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Inline mock data to avoid import issues
const mockEquipments = [
  {
    equipmentId: '1',
    equipmentNo: 'EQAB1234',
    equipmentName: '压力测试仪',
    equipmentType: '压力测试仪',
    specification: 'AB100',
    manufacturer: '测试科技公司',
    purchaseDate: '2024-01-01',
    status: 'IDLE',
    location: '一号实验室',
    departmentName: '测试部',
    description: '用于压力测试的专业设备',
    maintenanceCycle: 90,
    lastMaintenanceDate: '2024-10-01',
    responsiblePerson: '张三',
    contactInfo: '13800138000',
    purchasePrice: 50000
  },
  {
    equipmentId: '2',
    equipmentNo: 'EQCD5678',
    equipmentName: '温度检测仪',
    equipmentType: '温度检测仪',
    specification: 'CD200',
    manufacturer: '检测仪器公司',
    purchaseDate: '2024-02-01',
    status: 'IN_USE',
    location: '二号实验室',
    departmentName: '检测部',
    description: '高精度温度检测设备',
    maintenanceCycle: 60,
    lastMaintenanceDate: '2024-11-01',
    responsiblePerson: '李四',
    contactInfo: '13900139000',
    purchasePrice: 30000
  }
];

// Mock equipment applications data
const mockEquipmentApplications = [
  {
    applicationId: 1,
    equipmentId: 1,
    equipmentName: '压力测试仪',
    equipmentNo: 'EQAB1234',
    applicantId: 1,
    applicantName: '张三',
    applyType: 'BORROW',
    status: 'PENDING',
    applyTime: '2024-12-01 10:00:00',
    expectedStartTime: '2024-12-02 09:00:00',
    expectedEndTime: '2024-12-02 17:00:00',
    purpose: '进行压力测试实验',
    approveTime: '2024-12-01 11:00:00',
    approveRemarks: '同意申请，请按时归还'
  },
  {
    applicationId: 2,
    equipmentId: 2,
    equipmentName: '温度检测仪',
    equipmentNo: 'EQCD5678',
    applicantId: 2,
    applicantName: '李四',
    applyType: 'USE',
    status: 'APPROVED',
    applyTime: '2024-12-01 14:00:00',
    expectedStartTime: '2024-12-03 10:00:00',
    expectedEndTime: '2024-12-03 16:00:00',
    purpose: '温度检测项目',
    approveTime: '2024-12-01 15:00:00',
    approveRemarks: '批准使用，注意安全操作'
  }
];

// 模拟API响应格式
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

import { artemisRequest } from './request.js';
import { EQUIPMENT_API } from './config.js';

/**
 * 获取设备列表
 * @param {Object} params - 查询参数
 * @param {string} params.status - 设备状态
 * @param {string} params.type - 设备类型
 * @param {string} params.keyword - 搜索关键词
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export async function getEquipments(params = {}) {
  try {
    // Build the request body according to the API specification
    const bodyObj = {
      pageSize: params.size || 20,
      pageNo: params.page || 1,
      array: [],
      containChildOrg: false
    };

    // Add filters based on params
    if (params.status) {
      bodyObj.array.push({ key: 'status', option: 'eq', value: params.status });
    }

    if (params.type) {
      bodyObj.array.push({ key: 'deviceType', option: 'eq', value: params.type });
    }

    if (params.keyword) {
      bodyObj.array.push({ key: 'name', option: 'like', value: params.keyword });
    }

    const bodyStr = JSON.stringify(bodyObj);

    const res = await artemisRequest(EQUIPMENT_API.PAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: bodyStr
    });
    const result = res?.data || {};

    // Transform the response to match the expected format
    const list = result.data?.list || result.data?.records || [];
    const transformedEquipments = (list || []).map(device => ({
      equipmentId: device.deviceId || device.id,
      equipmentNo: device.deviceCode || device.code || device.indexCode,
      equipmentName: device.name || device.deviceName,
      equipmentType: device.deviceType || device.type,
      specification: device.specification || device.model || '',
      manufacturer: device.manufacturer || device.brand || '',
      purchaseDate: device.purchaseDate || device.installDate || '',
      status: device.status || 'IDLE',
      location: device.location || device.installLocation || '',
      departmentName: device.departmentName || device.orgName || '',
      description: device.description || device.remark || '',
      maintenanceCycle: device.maintenanceCycle || 0,
      lastMaintenanceDate: device.lastMaintenanceDate || '',
      responsiblePerson: device.responsiblePerson || device.manager || '',
      contactInfo: device.contactInfo || device.phone || '',
      purchasePrice: device.purchasePrice || 0,
      ...device
    }));

    return {
      data: {
        content: transformedEquipments,
        pageable: {
          pageNumber: result.data?.pageNo || params.page || 0,
          pageSize: result.data?.pageSize || params.size || 20,
          total: result.data?.total || 0
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    // Fallback to mock data if API fails
    await delay(500);
    let filteredEquipments = [...mockEquipments];

    if (params.status) filteredEquipments = filteredEquipments.filter(e => e.status === params.status);
    if (params.type) filteredEquipments = filteredEquipments.filter(e => e.equipmentType === params.type);
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredEquipments = filteredEquipments.filter(e =>
        e.equipmentName.toLowerCase().includes(keyword) ||
        e.equipmentNo.toLowerCase().includes(keyword) ||
        e.equipmentType.toLowerCase().includes(keyword)
      );
    }

    const page = params.page || 1;
    const size = params.size || 20;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedEquipments = filteredEquipments.slice(startIndex, endIndex);

    return {
      data: {
        content: paginatedEquipments,
        pageable: {
          pageNumber: page - 1,
          pageSize: size,
          total: filteredEquipments.length
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  }
}

/**
 * 获取设备详情
 * @param {string|number} id - 设备ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getEquipmentById(id) {
  try {
    const bodyObj = { pageNo: 1, pageSize: 1000, array: [], containChildOrg: false };
    const bodyStr = JSON.stringify(bodyObj);

    const res = await artemisRequest(EQUIPMENT_API.PAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: bodyStr
    });
    const result = res?.data || {};

    // handle case where API returns a paginated list or a single object
    const list = result.data?.list || result.data?.records || (Array.isArray(result.data) ? result.data : []);
    let device = null;

    if (Array.isArray(list) && list.length > 0) {
      device = list.find(item => item.id == id || item.deviceId == id || item.deviceId == String(id));
    }

    // If not found in list, check if result.data itself is an object representing a single device
    if (!device && result.data && typeof result.data === 'object' && !Array.isArray(result.data)) {
      const obj = result.data;
      if (obj.id == id || obj.deviceId == id || obj.deviceId == String(id)) device = obj;
    }

    if (!device) throw new Error('设备不存在');

    const transformedEquipment = {
      equipmentId: device.deviceId || device.id,
      equipmentNo: device.deviceCode || device.code || device.indexCode,
      equipmentName: device.name || device.deviceName,
      equipmentType: device.deviceType || device.type,
      specification: device.specification || device.model || '',
      manufacturer: device.manufacturer || device.brand || '',
      purchaseDate: device.purchaseDate || device.installDate || '',
      status: device.status || 'IDLE',
      location: device.location || device.installLocation || device.addr || '',
      departmentName: device.departmentName || device.orgName || device.deviceOrgName || '',
      description: device.description || device.remark || '',
      maintenanceCycle: device.maintenanceCycle || 0,
      lastMaintenanceDate: device.lastMaintenanceDate || '',
      responsiblePerson: device.responsiblePerson || device.manager || '',
      contactInfo: device.contactInfo || device.phone || '',
      purchasePrice: device.purchasePrice || 0,
      ...device
    };

    return { data: transformedEquipment, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    throw error;
  }
}

/**
 * 创建设备
 * @param {Object} data - 设备数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createEquipment(data) {
  try {
    const apiData = {
      name: data.equipmentName,
      deviceCode: data.equipmentNo,
      deviceType: data.equipmentType,
      specification: data.specification,
      manufacturer: data.manufacturer,
      purchaseDate: data.purchaseDate,
      status: data.status || 'IDLE',
      location: data.location,
      departmentName: data.departmentName,
      description: data.description,
      maintenanceCycle: data.maintenanceCycle,
      lastMaintenanceDate: data.lastMaintenanceDate,
      responsiblePerson: data.responsiblePerson,
      contactInfo: data.contactInfo,
      purchasePrice: data.purchasePrice
    };

    const res = await artemisRequest(EQUIPMENT_API.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify(apiData)
    });
    const result = res?.data || {};

    if (result.code && result.code !== '0' && result.code !== 200 && result.code !== 0) {
      throw new Error(result.msg || '创建设备失败');
    }

    const createdEquipment = {
      equipmentId: result.data?.deviceId || result.data?.id,
      equipmentNo: result.data?.deviceCode || data.equipmentNo,
      equipmentName: result.data?.name || data.equipmentName,
      equipmentType: result.data?.deviceType || data.equipmentType,
      specification: result.data?.specification || data.specification,
      manufacturer: result.data?.manufacturer || data.manufacturer,
      purchaseDate: result.data?.purchaseDate || data.purchaseDate,
      status: result.data?.status || data.status,
      location: result.data?.location || data.location,
      departmentName: result.data?.departmentName || data.departmentName,
      description: result.data?.description || data.description,
      maintenanceCycle: result.data?.maintenanceCycle || data.maintenanceCycle,
      lastMaintenanceDate: result.data?.lastMaintenanceDate || data.lastMaintenanceDate,
      responsiblePerson: result.data?.responsiblePerson || data.responsiblePerson,
      contactInfo: result.data?.contactInfo || data.contactInfo,
      purchasePrice: result.data?.purchasePrice || data.purchasePrice
    };

    return { data: createdEquipment, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    // Fallback to mock data if API fails
    await delay(800);
    const newEquipment = { ...data, equipmentId: mockEquipments.length + 1, createTime: new Date().toISOString(), updateTime: new Date().toISOString() };
    mockEquipments.push(newEquipment);
    return mockResponse(newEquipment);
  }
}

/**
 * 更新设备
 * @param {string|number} id - 设备ID
 * @param {Object} data - 更新数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateEquipment(id, data) {
  try {
    const apiData = {
      deviceId: id,
      name: data.equipmentName,
      deviceCode: data.equipmentNo,
      deviceType: data.equipmentType,
      specification: data.specification,
      manufacturer: data.manufacturer,
      purchaseDate: data.purchaseDate,
      status: data.status,
      location: data.location,
      departmentName: data.departmentName,
      description: data.description,
      maintenanceCycle: data.maintenanceCycle,
      lastMaintenanceDate: data.lastMaintenanceDate,
      responsiblePerson: data.responsiblePerson,
      contactInfo: data.contactInfo,
      purchasePrice: data.purchasePrice
    };

    const res = await artemisRequest(EQUIPMENT_API.UPDATE, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify(apiData)
    });
    const result = res?.data || {};

    if (result.code && result.code !== '0' && result.code !== 200 && result.code !== 0) {
      throw new Error(result.msg || '更新设备失败');
    }

    const updatedEquipment = {
      equipmentId: id,
      equipmentNo: result.data?.deviceCode || data.equipmentNo,
      equipmentName: result.data?.name || data.equipmentName,
      equipmentType: result.data?.deviceType || data.equipmentType,
      specification: result.data?.specification || data.specification,
      manufacturer: result.data?.manufacturer || data.manufacturer,
      purchaseDate: result.data?.purchaseDate || data.purchaseDate,
      status: result.data?.status || data.status,
      location: result.data?.location || data.location,
      departmentName: result.data?.departmentName || data.departmentName,
      description: result.data?.description || data.description,
      maintenanceCycle: result.data?.maintenanceCycle || data.maintenanceCycle,
      lastMaintenanceDate: result.data?.lastMaintenanceDate || data.lastMaintenanceDate,
      responsiblePerson: result.data?.responsiblePerson || data.responsiblePerson,
      contactInfo: result.data?.contactInfo || data.contactInfo,
      purchasePrice: result.data?.purchasePrice || data.purchasePrice
    };

    return { data: updatedEquipment, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    // Fallback to mock data if API fails
    await delay(600);
    const index = mockEquipments.findIndex(eq => eq.equipmentId === id || eq.equipmentId === parseInt(id));
    if (index === -1) throw new Error('设备不存在');

    mockEquipments[index] = { ...mockEquipments[index], ...data, updateTime: new Date().toISOString() };
    return mockResponse(mockEquipments[index]);
  }
}

/**
 * 删除设备
 * @param {string|number} id - 设备ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteEquipment(id) {
  try {
    await artemisRequest(`${EQUIPMENT_API.DELETE}/${id}`, { method: 'DELETE', headers: { 'Accept': '*/*' } });
    return { data: { message: '删除成功' }, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    // Fallback to mock data if API fails
    await delay(400);
    const index = mockEquipments.findIndex(eq => eq.equipmentId === id || eq.equipmentId === parseInt(id));
    if (index === -1) throw new Error('设备不存在');
    mockEquipments.splice(index, 1);
    return mockResponse({ message: '删除成功' });
  }
}

/**
 * 获取设备申请记录列表
 * @param {Object} params - 查询参数
 * @returns {Promise} - 返回Promise对象
 */
export async function getEquipmentApplications(params = {}) {
  try {
    const bodyObj = { pageSize: params.size || 20, pageNo: params.page || 1, array: [], containChildOrg: false };

    if (params.status) bodyObj.array.push({ key: 'status', option: 'eq', value: params.status });
    if (params.applicantId) bodyObj.array.push({ key: 'applicantId', option: 'eq', value: params.applicantId });

    const bodyStr = JSON.stringify(bodyObj);

    const res = await artemisRequest(EQUIPMENT_API.APPLICATION_PAGE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: bodyStr
    });
    const result = res?.data || {};

    const list = result.data?.list || result.data?.records || [];
    const transformedApplications = (list || []).map(app => ({
      applicationId: app.applicationId || app.id,
      equipmentId: app.equipmentId || app.deviceId,
      equipmentName: app.equipmentName || app.deviceName,
      equipmentNo: app.equipmentNo || app.deviceCode,
      applicantId: app.applicantId || app.userId,
      applicantName: app.applicantName || app.userName,
      applyType: app.applyType || app.type,
      status: app.status,
      applyTime: app.applyTime || app.createTime,
      expectedStartTime: app.expectedStartTime || app.startTime,
      expectedEndTime: app.expectedEndTime || app.endTime,
      purpose: app.purpose || app.description,
      approveTime: app.approveTime,
      approveRemarks: app.approveRemarks || app.approveRemark,
      ...app
    }));

    return { data: { content: transformedApplications, pageable: { pageNumber: result.data?.pageNo || params.page || 0, pageSize: result.data?.pageSize || params.size || 20, total: result.data?.total || 0 } }, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(400);
    let filteredApplications = [...mockEquipmentApplications];
    if (params.status) filteredApplications = filteredApplications.filter(app => app.status === params.status);
    if (params.applicantId) filteredApplications = filteredApplications.filter(app => app.applicantId === params.applicantId);
    const page = params.page || 1;
    const size = params.size || 20;
    const start = (page - 1) * size;
    const end = start + size;
    const records = filteredApplications.slice(start, end);
    return mockResponse({ content: records, pageable: { pageNumber: page, pageSize: size, total: filteredApplications.length } });
  }
}

/**
 * 获取设备申请记录详情
 * @param {string|number} id - 申请ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getEquipmentApplicationById(id) {
  try {
    const res = await artemisRequest(`${EQUIPMENT_API.APPLICATION_DETAIL}/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' } });
    const result = res?.data || {};
    const app = result.data || result;
    const transformedApplication = {
      applicationId: app.applicationId || app.id,
      equipmentId: app.equipmentId || app.deviceId,
      equipmentName: app.equipmentName || app.deviceName,
      equipmentNo: app.equipmentNo || app.deviceCode,
      applicantId: app.applicantId || app.userId,
      applicantName: app.applicantName || app.userName,
      applyType: app.applyType || app.type,
      status: app.status,
      applyTime: app.applyTime || app.createTime,
      expectedStartTime: app.expectedStartTime || app.startTime,
      expectedEndTime: app.expectedEndTime || app.endTime,
      purpose: app.purpose || app.description,
      approveTime: app.approveTime,
      approveRemarks: app.approveRemarks || app.approveRemark,
      ...app
    };
    return { data: transformedApplication, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(300);
    const application = mockEquipmentApplications.find(app => app.applicationId === id || app.applicationId === parseInt(id));
    if (!application) throw new Error('申请记录不存在');
    return mockResponse(application);
  }
}

/**
 * 提交设备申请
 * @param {Object} data - 申请数据
 * @returns {Promise} - 返回Promise对象
 */
export async function applyEquipment(data) {
  try {
    const requestData = { equipmentId: data.equipmentId, equipmentName: data.equipmentName, equipmentNo: data.equipmentNo, applicantId: data.applicantId, applicantName: data.applicantName, applyType: data.applyType, expectedStartTime: data.expectedStartTime, expectedEndTime: data.expectedEndTime, purpose: data.purpose, ...data };
    const res = await artemisRequest(EQUIPMENT_API.APPLICATION_CREATE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, body: JSON.stringify(requestData) });
    const result = res?.data || {};
    const app = result.data || result;
    const transformedApplication = { applicationId: app.applicationId || app.id, equipmentId: app.equipmentId || app.deviceId, equipmentName: app.equipmentName || app.deviceName, equipmentNo: app.equipmentNo || app.deviceCode, applicantId: app.applicantId || app.userId, applicantName: app.applicantName || app.userName, applyType: app.applyType || app.type, status: app.status || 'PENDING', applyTime: app.applyTime || app.createTime || new Date().toISOString(), expectedStartTime: app.expectedStartTime || app.startTime, expectedEndTime: app.expectedEndTime || app.endTime, purpose: app.purpose || app.description, ...app };
    return { data: transformedApplication, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(800);
    const newApplication = { ...data, applicationId: mockEquipmentApplications.length + 1, status: 'PENDING', createTime: new Date().toISOString(), updateTime: new Date().toISOString() };
    mockEquipmentApplications.push(newApplication);
    return mockResponse(newApplication);
  }
}

/**
 * 更新申请状态
 * @param {string|number} id - 申请ID
 * @param {Object} data - 状态数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateApplicationStatus(id, data) {
  try {
    const requestData = { status: data.status, updateTime: new Date().toISOString(), ...data };
    const res = await artemisRequest(`${EQUIPMENT_API.APPLICATION_UPDATE}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, body: JSON.stringify(requestData) });
    const result = res?.data || {};
    const app = result.data || result;
    const transformedApplication = { applicationId: app.applicationId || app.id, equipmentId: app.equipmentId || app.deviceId, equipmentName: app.equipmentName || app.deviceName, equipmentNo: app.equipmentNo || app.deviceCode, applicantId: app.applicantId || app.userId, applicantName: app.applicantName || app.userName, applyType: app.applyType || app.type, status: app.status, applyTime: app.applyTime || app.createTime, expectedStartTime: app.expectedStartTime || app.startTime, expectedEndTime: app.expectedEndTime || app.endTime, purpose: app.purpose || app.description, approveTime: app.approveTime, approveRemarks: app.approveRemarks || app.approveRemark, updateTime: app.updateTime || new Date().toISOString(), ...app };
    return { data: transformedApplication, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(600);
    const index = mockEquipmentApplications.findIndex(app => app.applicationId === id || app.applicationId === parseInt(id));
    if (index === -1) throw new Error('申请记录不存在');
    mockEquipmentApplications[index] = { ...mockEquipmentApplications[index], ...data, updateTime: new Date().toISOString() };
    return mockResponse(mockEquipmentApplications[index]);
  }
}

/**
 * 审批设备申请
 * @param {string|number} id - 申请ID
 * @param {Object} data - 审批数据
 * @returns {Promise} - 返回Promise对象
 */
export async function approveEquipmentRequest(id, data) {
  try {
    const requestData = { status: 'APPROVED', approveTime: new Date().toISOString(), approveRemarks: data.approveRemark || data.approveRemarks, ...data };
    const res = await artemisRequest(`${EQUIPMENT_API.APPLICATION_APPROVE}/${id}/approve`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, body: JSON.stringify(requestData) });
    const result = res?.data || {};
    const app = result.data || result;
    const transformedApplication = { applicationId: app.applicationId || app.id, equipmentId: app.equipmentId || app.deviceId, equipmentName: app.equipmentName || app.deviceName, equipmentNo: app.equipmentNo || app.deviceCode, applicantId: app.applicantId || app.userId, applicantName: app.applicantName || app.userName, applyType: app.applyType || app.type, status: app.status || 'APPROVED', applyTime: app.applyTime || app.createTime, expectedStartTime: app.expectedStartTime || app.startTime, expectedEndTime: app.expectedEndTime || app.endTime, purpose: app.purpose || app.description, approveTime: app.approveTime || new Date().toISOString(), approveRemarks: app.approveRemarks || app.approveRemark || data.approveRemark, ...app };
    return { data: transformedApplication, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(600);
    const index = mockEquipmentApplications.findIndex(app => app.applicationId === id || app.applicationId === parseInt(id));
    if (index === -1) throw new Error('申请记录不存在');
    mockEquipmentApplications[index] = { ...mockEquipmentApplications[index], status: 'APPROVED', approveTime: new Date().toISOString(), approveRemark: data.approveRemark || '', updateTime: new Date().toISOString() };
    return mockResponse(mockEquipmentApplications[index]);
  }
}

/**
 * 取消设备申请
 * @param {string|number} id - 申请ID
 * @param {Object} data - 取消数据
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelEquipmentRequest(id, data) {
  try {
    const requestData = { status: 'CANCELLED', cancelRemark: data.cancelRemark, ...data };
    const res = await artemisRequest(`${EQUIPMENT_API.APPLICATION_CANCEL}/${id}/cancel`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, body: JSON.stringify(requestData) });
    const result = res?.data || {};
    const app = result.data || result;
    const transformedApplication = { applicationId: app.applicationId || app.id, equipmentId: app.equipmentId || app.deviceId, equipmentName: app.equipmentName || app.deviceName, equipmentNo: app.equipmentNo || app.deviceCode, applicantId: app.applicantId || app.userId, applicantName: app.applicantName || app.userName, applyType: app.applyType || app.type, status: app.status || 'CANCELLED', applyTime: app.applyTime || app.createTime, expectedStartTime: app.expectedStartTime || app.startTime, expectedEndTime: app.expectedEndTime || app.endTime, purpose: app.purpose || app.description, cancelRemark: app.cancelRemark || data.cancelRemark, ...app };
    return { data: transformedApplication, status: 200, statusText: 'OK', headers: {}, config: {} };
  } catch (error) {
    await delay(400);
    const index = mockEquipmentApplications.findIndex(app => app.applicationId === id || app.applicationId === parseInt(id));
    if (index === -1) throw new Error('申请记录不存在');
    mockEquipmentApplications[index] = { ...mockEquipmentApplications[index], status: 'CANCELLED', cancelRemark: data.cancelRemark || '', updateTime: new Date().toISOString() };
    return mockResponse(mockEquipmentApplications[index]);
  }
}

/**
 * 获取可租用设备清单
 * @param {Object} params - 查询参数
 * @param {string} params.pageSize - 页长
 * @param {string} params.pageNum - 页码
 * @param {string} [params.deviceNo] - 设备编号
 * @param {string} [params.deviceName] - 设备名称
 * @returns {Promise} - 返回Promise对象
 */
export async function getRentableEquipmentList(params = {}) {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', params.pageSize || '20');
    queryParams.append('pageNum', params.pageNum || '1');
    
    if (params.deviceNo) {
      queryParams.append('deviceNo', params.deviceNo);
    }
    
    if (params.deviceName) {
      queryParams.append('deviceName', params.deviceName);
    }
    
    const url = `${EQUIPMENT_API.RENTABLE_LIST}?${queryParams.toString()}`;
    
    const res = await artemisRequest(url, {
      method: 'GET',
      headers: { 'Accept': '*/*' }
    });
    
    const result = res?.data || {};
    
    // 转换响应格式以匹配项目的标准格式
    const transformedEquipments = (result.data || []).map(device => ({
      equipmentId: device.id || device.deviceId,
      equipmentNo: device.deviceNo || device.deviceCode,
      equipmentName: device.deviceName || device.name,
      ...device
    }));
    
    return {
      data: {
        content: transformedEquipments,
        pageable: {
          pageNumber: parseInt(params.pageNum || '1') - 1,
          pageSize: parseInt(params.pageSize || '20'),
          total: result.total || 0
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    // 异常处理
    console.error('获取可租用设备清单失败:', error);
    throw error;
  }
}
