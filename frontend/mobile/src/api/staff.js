import { artemisRequest } from './request';

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
    const res = await artemisRequest('/artemis/api/v1/staff', {
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
    const res = await artemisRequest(`/artemis/api/manage/auth/v2/manage/userService/getUserById/${staffId}`, {
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

    const res = await artemisRequest('/artemis/api/manage/auth/v2/manage/userService/createUser', {
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

    const res = await artemisRequest('/artemis/api/manage/auth/v2/manage/userService/updateUser', {
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
    const res = await artemisRequest(`/artemis/api/manage/auth/v2/manage/userService/deleteUser/${staffId}`, {
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
    const res = await artemisRequest('/artemis/api/manage/auth/v2/manage/userService/uploadDocument', {
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
    const res = await artemisRequest(`/artemis/api/manage/auth/v2/manage/userService/deleteDocument/${staffId}/${type}`, {
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
