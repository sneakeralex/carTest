import { artemisRequest } from './request';
import { STAFF_API, DRIVER_API } from './config.js';

/**
 * 获取人员列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码，默认为1
 * @param {number} params.pageSize - 每页数量，默认为20
 * @returns {Promise} - 返回Promise对象
 */
export async function getStaffList(params = {}) {
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 20;

  try {
    const res = await artemisRequest(STAFF_API.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({ pageSize, pageNum })
    });

    const result = res?.data;

    console.log('人员列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0') {
      throw new Error(result.msg || '获取人员列表失败');
    }

    // Transform the response to match the expected format
    const transformedStaff = result.data.list.map(staff => ({
      userId: staff.id,
      name: staff.staffName,
      type: staff.identityType,
      phone: staff.phone,
      gender: staff.gender,
      genderText: staff.genderName,
      position: staff.identityTypeName,
      department: staff.enterpriseName,
      employeeId: staff.id,
      remarks: '',
      status: 'ACTIVE',
      address: staff.address,
      createdAt: '',
      updatedAt: '',
      // Keep original fields for compatibility
      ...staff
    }));

    return {
      data: transformedStaff,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取人员列表失败:', error);
    throw error; // Remove mock fallback, throw error directly
  }
}

/**
 * 根据ID获取人员详情
 * @param {string} staffId - 人员ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getStaffById(staffId) {
  try {
    const res = await artemisRequest(`${STAFF_API.GET_BY_ID}/${staffId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });

    const result = res?.data;

    console.log('人员详情原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const user = result.data || result;
    const transformedStaff = {
      userId: user.userId || user.id,
      name: user.name || user.displayName || user.username,
      type: user.type || user.role || 'STAFF',
      phone: user.phone || user.mobile,
      gender: user.gender,
      genderText: user.gender === 'MALE' ? '男' : user.gender === 'FEMALE' ? '女' : '',
      authStartDate: user.authStartDate || user.createTime,
      authEndDate: user.authEndDate,
      position: user.position || user.jobTitle,
      department: user.department || user.orgName,
      employeeId: user.employeeId || user.staffId,
      remarks: user.remarks || user.description,
      status: user.status || 'ACTIVE',
      createdAt: user.createdAt || user.createTime,
      updatedAt: user.updatedAt || user.updateTime,
      // Keep original fields for compatibility
      ...user
    };

    return {
      data: transformedStaff,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取人员详情失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 创建人员
 * @param {Object} staffData - 人员数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createStaff(staffData) {
  try {
    // Transform data to match API expectations
    const requestData = {
      name: staffData.name,
      username: staffData.username || staffData.name,
      phone: staffData.phone,
      gender: staffData.gender,
      position: staffData.position,
      department: staffData.department,
      employeeId: staffData.employeeId,
      type: staffData.type,
      authStartDate: staffData.authStartDate,
      authEndDate: staffData.authEndDate,
      remarks: staffData.remarks,
      // Add any other required fields
      ...staffData
    };

    const res = await artemisRequest(STAFF_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(requestData)
    });

    const result = res?.data;

    console.log('创建人员原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const user = result.data || result;
    const transformedStaff = {
      userId: user.userId || user.id,
      name: user.name || user.displayName || user.username,
      type: user.type || user.role || 'STAFF',
      phone: user.phone || user.mobile,
      gender: user.gender,
      genderText: user.gender === 'MALE' ? '男' : user.gender === 'FEMALE' ? '女' : '',
      authStartDate: user.authStartDate || user.createTime,
      authEndDate: user.authEndDate,
      position: user.position || user.jobTitle,
      department: user.department || user.orgName,
      employeeId: user.employeeId || user.staffId,
      remarks: user.remarks || user.description,
      status: user.status || 'ACTIVE',
      createdAt: user.createdAt || user.createTime,
      updatedAt: user.updatedAt || user.updateTime,
      // Keep original fields for compatibility
      ...user
    };

    return {
      data: transformedStaff,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建人员失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 更新人员信息
 * @param {Object} staffData - 人员数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateStaff(staffData) {
  try {
    // Transform data to match API expectations
    const requestData = {
      userId: staffData.userId,
      name: staffData.name,
      username: staffData.username || staffData.name,
      phone: staffData.phone,
      gender: staffData.gender,
      position: staffData.position,
      department: staffData.department,
      employeeId: staffData.employeeId,
      type: staffData.type,
      authStartDate: staffData.authStartDate,
      authEndDate: staffData.authEndDate,
      remarks: staffData.remarks,
      // Add any other required fields
      ...staffData
    };

    const res = await artemisRequest(STAFF_API.UPDATE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(requestData)
    });

    const result = res?.data;

    console.log('更新人员原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const user = result.data || result;
    const transformedStaff = {
      userId: user.userId || user.id,
      name: user.name || user.displayName || user.username,
      type: user.type || user.role || 'STAFF',
      phone: user.phone || user.mobile,
      gender: user.gender,
      genderText: user.gender === 'MALE' ? '男' : user.gender === 'FEMALE' ? '女' : '',
      authStartDate: user.authStartDate || user.createTime,
      authEndDate: user.authEndDate,
      position: user.position || user.jobTitle,
      department: user.department || user.orgName,
      employeeId: user.employeeId || user.staffId,
      remarks: user.remarks || user.description,
      status: user.status || 'ACTIVE',
      createdAt: user.createdAt || user.createTime,
      updatedAt: user.updatedAt || user.updateTime,
      // Keep original fields for compatibility
      ...user
    };

    return {
      data: transformedStaff,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('更新人员信息失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 删除人员
 * @param {string} staffId - 人员ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteStaff(staffId) {
  try {
    const res = await artemisRequest(`${STAFF_API.DELETE}/${staffId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      }
    });

    const result = res?.data;

    console.log('删除人员原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('删除人员失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 上传人员证件
 * @param {FormData} formData - 包含文件和元数据的FormData对象
 * @returns {Promise} - 返回Promise对象，包含上传结果
 */
export async function uploadStaffDocument(formData) {
  try {
    const res = await artemisRequest(STAFF_API.UPLOAD_DOCUMENT, {
      method: 'POST',
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
        // Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: formData
    });

    const result = res?.data;

    console.log('上传证件原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const uploadResult = result.data || result;
    const transformedResult = {
      url: uploadResult.url,
      type: uploadResult.type,
      fileName: uploadResult.fileName || uploadResult.name,
      uploadTime: uploadResult.uploadTime || new Date().toISOString(),
      // Keep original fields for compatibility
      ...uploadResult
    };

    return {
      data: transformedResult,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('上传文件失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 删除人员证件
 * @param {string} staffId - 人员ID
 * @param {string} type - 证件类型
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteStaffDocument(staffId, type) {
  try {
    const res = await artemisRequest(`${STAFF_API.DELETE_DOCUMENT}/${staffId}/${type}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      }
    });

    const result = res?.data;

    console.log('删除证件原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('删除文件失败:', error);
    throw error; // Remove mock fallback
  }
}

/**
 * 获取驾驶员列表
 * @param {Object} params - 查询参数
 * @param {number} params.pageNum - 页码，默认为1
 * @param {number} params.pageSize - 每页数量，默认为20
 * @param {string} [params.status] - 状态
 * @param {string} [params.keyword] - 搜索关键词
 * @returns {Promise} - 返回Promise对象
 */
export async function getDriverList(params = {}) {
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 20;

  try {
    const res = await artemisRequest(DRIVER_API.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify({ pageSize, pageNum, status: params.status, keyword: params.keyword })
    });

    const result = res?.data;

    console.log('驾驶员列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0') {
      throw new Error(result.msg || '获取驾驶员列表失败');
    }

    // Transform the response to match the expected format
    const transformedDrivers = result.data.list.map(driver => ({
      userId: driver.id,
      name: driver.driverName,
      type: 'DRIVER',
      phone: driver.phone,
      gender: driver.gender,
      genderText: driver.genderName,
      position: '驾驶员',
      department: driver.enterpriseName,
      employeeId: driver.id,
      driverLicense: driver.driverLicense,
      driverLicenseExpiry: driver.driverLicenseExpiry,
      driverLicenseType: driver.driverLicenseType,
      drivingExperience: driver.drivingExperience,
      status: driver.status,
      address: driver.address,
      remarks: driver.remarks,
      createdAt: driver.createTime,
      updatedAt: driver.updateTime,
      // Keep original fields for compatibility
      ...driver
    }));

    return {
      data: transformedDrivers,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取驾驶员列表失败:', error);
    throw error;
  }
}

/**
 * 获取驾驶员详情
 * @param {string} driverId - 驾驶员ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getDriverById(driverId) {
  try {
    const res = await artemisRequest(`${DRIVER_API.GET_BY_ID}/${driverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });

    const result = res?.data;

    console.log('驾驶员详情原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const driver = result.data || result;
    const transformedDriver = {
      userId: driver.id,
      name: driver.driverName,
      type: 'DRIVER',
      phone: driver.phone,
      gender: driver.gender,
      genderText: driver.genderName,
      position: '驾驶员',
      department: driver.enterpriseName,
      employeeId: driver.id,
      driverLicense: driver.driverLicense,
      driverLicenseExpiry: driver.driverLicenseExpiry,
      driverLicenseType: driver.driverLicenseType,
      drivingExperience: driver.drivingExperience,
      status: driver.status,
      address: driver.address,
      remarks: driver.remarks,
      createdAt: driver.createTime,
      updatedAt: driver.updateTime,
      // Keep original fields for compatibility
      ...driver
    };

    return {
      data: transformedDriver,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取驾驶员详情失败:', error);
    throw error;
  }
}

/**
 * 创建设驾驶员
 * @param {Object} driverData - 驾驶员数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createDriver(driverData) {
  try {
    // Transform data to match API expectations
    const requestData = {
      driverName: driverData.name,
      phone: driverData.phone,
      gender: driverData.gender,
      driverLicense: driverData.driverLicense,
      driverLicenseExpiry: driverData.driverLicenseExpiry,
      driverLicenseType: driverData.driverLicenseType,
      drivingExperience: driverData.drivingExperience,
      status: driverData.status || 'ACTIVE',
      address: driverData.address,
      remarks: driverData.remarks,
      // Add any other required fields
      ...driverData
    };

    const res = await artemisRequest(DRIVER_API.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(driverData)
    });

    const result = res?.data;

    console.log('创建设驾驶员原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const driver = result.data || result;
    const transformedDriver = {
      userId: driver.id,
      name: driver.driverName,
      type: 'DRIVER',
      phone: driver.phone,
      gender: driver.gender,
      genderText: driver.genderName,
      position: '驾驶员',
      department: driver.enterpriseName,
      employeeId: driver.id,
      driverLicense: driver.driverLicense,
      driverLicenseExpiry: driver.driverLicenseExpiry,
      driverLicenseType: driver.driverLicenseType,
      drivingExperience: driver.drivingExperience,
      status: driver.status,
      address: driver.address,
      remarks: driver.remarks,
      createdAt: driver.createTime,
      updatedAt: driver.updateTime,
      // Keep original fields for compatibility
      ...driver
    };

    return {
      data: transformedDriver,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建设驾驶员失败:', error);
    throw error;
  }
}

/**
 * 更新驾驶员信息
 * @param {Object} driverData - 驾驶员数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateDriver(driverData) {
  try {
    // Transform data to match API expectations
    const requestData = {
      id: driverData.userId,
      driverName: driverData.name,
      phone: driverData.phone,
      gender: driverData.gender,
      driverLicense: driverData.driverLicense,
      driverLicenseExpiry: driverData.driverLicenseExpiry,
      driverLicenseType: driverData.driverLicenseType,
      drivingExperience: driverData.drivingExperience,
      status: driverData.status,
      address: driverData.address,
      remarks: driverData.remarks,
      // Add any other required fields
      ...driverData
    };

    const res = await artemisRequest(DRIVER_API.UPDATE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(driverData)
    });

    const result = res?.data;

    console.log('更新驾驶员原始API响应:', JSON.stringify(result, null, 2));
    
    // Transform the response to match the expected format
    const driver = result.data || result;
    const transformedDriver = {
      userId: driver.id,
      name: driver.driverName,
      type: 'DRIVER',
      phone: driver.phone,
      gender: driver.gender,
      genderText: driver.genderName,
      position: '驾驶员',
      department: driver.enterpriseName,
      employeeId: driver.id,
      driverLicense: driver.driverLicense,
      driverLicenseExpiry: driver.driverLicenseExpiry,
      driverLicenseType: driver.driverLicenseType,
      drivingExperience: driver.drivingExperience,
      status: driver.status,
      address: driver.address,
      remarks: driver.remarks,
      createdAt: driver.createTime,
      updatedAt: driver.updateTime,
      // Keep original fields for compatibility
      ...driver
    };

    return {
      data: transformedDriver,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('更新驾驶员信息失败:', error);
    throw error;
  }
}

/**
 * 删除驾驶员
 * @param {string} driverId - 驾驶员ID
 * @returns {Promise} - 返回Promise对象
 */
export async function deleteDriver(driverId) {
  try {
    const res = await artemisRequest(`${DRIVER_API.DELETE}/${driverId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });

    const result = res?.data;

    console.log('删除驾驶员原始API响应:', JSON.stringify(result, null, 2));

    return {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('删除驾驶员失败:', error);
    throw error;
  }
}
