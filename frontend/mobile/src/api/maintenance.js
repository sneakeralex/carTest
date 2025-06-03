import request from './request';

/**
 * 获取维修保养记录列表
 * @returns {Promise} - 返回Promise对象
 */
export function getMaintenanceRecords() {
  return request({
    url: '/maintenance',
    method: 'get'
  });
}

/**
 * 根据ID获取维修保养详情
 * @param {number|string} id - 维修保养ID
 * @returns {Promise} - 返回Promise对象
 */
export function getMaintenanceById(id) {
  return request({
    url: `/maintenance/${id}`,
    method: 'get'
  });
}

/**
 * 创建维修保养记录
 * @param {Object} maintenanceData - 维修保养数据
 * @param {number|string} maintenanceData.vehicleId - 车辆ID
 * @param {string} maintenanceData.maintenanceType - 维修保养类型
 * @param {string} maintenanceData.description - 描述
 * @param {Array} maintenanceData.items - 维修保养项目列表
 * @returns {Promise} - 返回Promise对象
 */
export function createMaintenance(maintenanceData) {
  return request({
    url: '/maintenance',
    method: 'post',
    data: maintenanceData
  });
}

/**
 * 更新维修保养记录
 * @param {number|string} id - 维修保养ID
 * @param {Object} maintenanceData - 维修保养数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateMaintenance(id, maintenanceData) {
  return request({
    url: `/maintenance/${id}`,
    method: 'put',
    data: maintenanceData
  });
}

/**
 * 取消维修保养
 * @param {number|string} id - 维修保养ID
 * @returns {Promise} - 返回Promise对象
 */
export function cancelMaintenance(id) {
  return request({
    url: `/maintenance/${id}/cancel`,
    method: 'put'
  });
}

/**
 * 获取维修保养项目列表
 * @returns {Promise} - 返回Promise对象
 */
export function getMaintenanceItems() {
  return request({
    url: '/maintenance/items',
    method: 'get'
  });
}

/**
 * 获取车辆的维修保养历史记录
 * @param {number|string} vehicleId - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleMaintenanceHistory(vehicleId) {
  return request({
    url: `/vehicles/${vehicleId}/maintenance-history`,
    method: 'get'
  });
}