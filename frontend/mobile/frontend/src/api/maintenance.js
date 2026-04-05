// import request from './request.js';
import * as maintenanceMock from '../mock/maintenance.js';
import { artemisRequest } from './request';
import { MAINTENANCE_API } from './config.js';

// 判断是否使用mock数据
const useMock = false; // Changed to false to prefer real API

// Base URL for API calls - DO NOT hardcode external hosts in frontend. Use env var or proxy.
export const MAINTENANCE_BASE_URL = (globalThis?.import?.meta?.env?.VITE_MAINTENANCE_BASE_URL) || '';

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
 * 获取维护记录列表
 * @returns {Promise} - 返回Promise对象
 */
export async function getMaintenanceRecords() {
  try {
    const res = await artemisRequest(MAINTENANCE_API.LIST, { method: 'GET' });
    const result = res?.data;
    console.log('获取维护记录列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取维护记录失败');
    }

    // Transform response to expected format
    const records = (result.data?.list || result.data?.records || result.data || []).map(record => ({
      id: record.id || record.maintenanceId,
      equipmentId: record.equipmentId,
      equipmentName: record.equipmentName,
      maintenanceType: record.maintenanceType,
      description: record.description,
      scheduledDate: record.scheduledDate,
      completedDate: record.completedDate,
      status: record.status,
      technician: record.technician,
      cost: record.cost,
      notes: record.notes,
      createdAt: record.createdAt || record.createTime,
      updatedAt: record.updatedAt || record.updateTime
    }));

    return {
      data: { 
        records: records,
        total: result.data?.total || records.length
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取维护记录列表失败:', error);
    // Fallback to mock
    console.log('🔄 维护记录API: 使用Mock数据');
    await delay(300);
    try {
      const result = maintenanceMock.getMaintenances({ url: '/maintenances', method: 'get' });
      console.log('✅ 维护记录API: Mock数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 维护记录API: Mock数据错误', mockError);
      return mockResponse({ records: [], total: 0 });
    }
  }
}

/**
 * 根据ID获取维护详情
 * @param {number|string} id - 维护ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getMaintenanceById(id) {
  try {
    const res = await artemisRequest(`${MAINTENANCE_API.DETAIL}/${id}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取维护详情原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取维护详情失败');
    }

    // Transform response to expected format
    const record = result.data || result;
    const transformedRecord = {
      id: record.id || record.maintenanceId,
      equipmentId: record.equipmentId,
      equipmentName: record.equipmentName,
      maintenanceType: record.maintenanceType,
      description: record.description,
      scheduledDate: record.scheduledDate,
      completedDate: record.completedDate,
      status: record.status,
      technician: record.technician,
      cost: record.cost,
      notes: record.notes,
      parts: record.parts || [],
      createdAt: record.createdAt || record.createTime,
      updatedAt: record.updatedAt || record.updateTime
    };

    return {
      data: transformedRecord,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取维护详情失败:', error);
    // Fallback to mock
    console.log('🔄 维护记录API: 获取详情使用Mock数据, ID:', id);
    await delay(300);
    try {
      const result = maintenanceMock.getMaintenanceById({ url: `/maintenances/${id}`, method: 'get' });
      console.log('✅ 维护记录API: Mock详情数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 维护记录API: Mock详情数据错误', mockError);
      return mockResponse(null);
    }
  }
}

/**
 * 创建维护记录
 * @param {Object} maintenanceData - 维护数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createMaintenance(maintenanceData) {
  try {
    const res = await artemisRequest(MAINTENANCE_API.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(maintenanceData)
    });
    const result = res?.data;
    console.log('创建维护记录原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '创建维护记录失败');
    }

    // Transform response to expected format
    const createdRecord = result.data || maintenanceData;
    const transformedRecord = {
      id: createdRecord.id || createdRecord.maintenanceId,
      equipmentId: createdRecord.equipmentId || maintenanceData.equipmentId,
      equipmentName: createdRecord.equipmentName || maintenanceData.equipmentName,
      maintenanceType: createdRecord.maintenanceType || maintenanceData.maintenanceType,
      description: createdRecord.description || maintenanceData.description,
      scheduledDate: createdRecord.scheduledDate || maintenanceData.scheduledDate,
      completedDate: createdRecord.completedDate || maintenanceData.completedDate,
      status: createdRecord.status || maintenanceData.status || 'PENDING',
      technician: createdRecord.technician || maintenanceData.technician,
      cost: createdRecord.cost || maintenanceData.cost,
      notes: createdRecord.notes || maintenanceData.notes,
      createdAt: createdRecord.createdAt || createdRecord.createTime,
      updatedAt: createdRecord.updatedAt || createdRecord.updateTime
    };

    return {
      data: transformedRecord,
      status: 201,
      statusText: 'Created',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('创建维护记录失败:', error);
    // Fallback to mock
    console.log('🔄 维护记录API: 创建使用Mock数据', maintenanceData);
    await delay(300);
    try {
      const result = maintenanceMock.createMaintenance({ 
        url: '/maintenances', 
        method: 'post',
        data: JSON.stringify(maintenanceData)
      });
      console.log('✅ 维护记录API: Mock创建数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 维护记录API: Mock创建数据错误', mockError);
      return mockResponse(maintenanceData);
    }
  }
}

/**
 * 更新维护记录
 * @param {number|string} id - 维护ID
 * @param {Object} maintenanceData - 维护数据
 * @returns {Promise} - 返回Promise对象
 */
export async function updateMaintenance(id, maintenanceData) {
  try {
    const res = await artemisRequest(`${MAINTENANCE_API.DETAIL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(maintenanceData)
    });
    const result = res?.data;
    console.log('更新维护记录原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '更新维护记录失败');
    }

    // Transform response to expected format
    const updatedRecord = result.data || { ...maintenanceData, id };
    const transformedRecord = {
      id: updatedRecord.id || updatedRecord.maintenanceId || id,
      equipmentId: updatedRecord.equipmentId || maintenanceData.equipmentId,
      equipmentName: updatedRecord.equipmentName || maintenanceData.equipmentName,
      maintenanceType: updatedRecord.maintenanceType || maintenanceData.maintenanceType,
      description: updatedRecord.description || maintenanceData.description,
      scheduledDate: updatedRecord.scheduledDate || maintenanceData.scheduledDate,
      completedDate: updatedRecord.completedDate || maintenanceData.completedDate,
      status: updatedRecord.status || maintenanceData.status,
      technician: updatedRecord.technician || maintenanceData.technician,
      cost: updatedRecord.cost || maintenanceData.cost,
      notes: updatedRecord.notes || maintenanceData.notes,
      updatedAt: updatedRecord.updatedAt || updatedRecord.updateTime
    };

    return {
      data: transformedRecord,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('更新维护记录失败:', error);
    // Fallback to mock
    console.log('🔄 维护记录API: 更新使用Mock数据, ID:', id, maintenanceData);
    await delay(300);
    try {
      const result = maintenanceMock.updateMaintenance({ 
        url: `/maintenances/${id}`, 
        method: 'put',
        data: JSON.stringify(maintenanceData)
      });
      console.log('✅ 维护记录API: Mock更新数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 维护记录API: Mock更新数据错误', mockError);
      return mockResponse({ ...maintenanceData, id });
    }
  }
}

/**
 * 取消维护记录
 * @param {number|string} id - 维护ID
 * @returns {Promise} - 返回Promise对象
 */
export async function cancelMaintenance(id) {
  try {
    const res = await artemisRequest(`${MAINTENANCE_API.DETAIL}/${id}/cancel`, { method: 'PUT' });
    const result = res?.data;
    console.log('取消维护记录原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '取消维护记录失败');
    }

    // Transform response to expected format
    const cancelledRecord = result.data || { id, status: 'CANCELLED' };

    return {
      data: cancelledRecord,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('取消维护记录失败:', error);
    // Fallback to mock
    console.log('🔄 维护记录API: 取消使用Mock数据, ID:', id);
    await delay(300);
    try {
      // 使用updateMaintenance来模拟取消操作
      const result = maintenanceMock.updateMaintenance({ 
        url: `/maintenances/${id}`, 
        method: 'put',
        data: JSON.stringify({ status: 'CANCELLED' })
      });
      console.log('✅ 维护记录API: Mock取消数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 维护记录API: Mock取消数据错误', mockError);
      return mockResponse({ id, status: 'CANCELLED' });
    }
  }
}
