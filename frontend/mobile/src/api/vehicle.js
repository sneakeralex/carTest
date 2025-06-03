import request from './request';

/**
 * 获取车辆列表
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicles() {
  return request({
    url: '/vehicles',
    method: 'get'
  });
}

/**
 * 根据ID获取车辆详情
 * @param {number|string} id - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleById(id) {
  return request({
    url: `/vehicles/${id}`,
    method: 'get'
  });
}

/**
 * 添加车辆
 * @param {Object} vehicleData - 车辆数据
 * @returns {Promise} - 返回Promise对象
 */
export function addVehicle(vehicleData) {
  return request({
    url: '/vehicles',
    method: 'post',
    data: vehicleData
  });
}

/**
 * 更新车辆信息
 * @param {number|string} id - 车辆ID
 * @param {Object} vehicleData - 车辆数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateVehicle(id, vehicleData) {
  return request({
    url: `/vehicles/${id}`,
    method: 'put',
    data: vehicleData
  });
}

/**
 * 删除车辆
 * @param {number|string} id - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function deleteVehicle(id) {
  return request({
    url: `/vehicles/${id}`,
    method: 'delete'
  });
}

/**
 * 获取车辆类型列表
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleTypes() {
  return request({
    url: '/vehicle-types',
    method: 'get'
  });
}