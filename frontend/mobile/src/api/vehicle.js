import request from './request';

/**
 * 获取车辆列表 (移动端)
 * @param {Object} params - 查询参数
 * @param {string} params.brand - 品牌
 * @param {string} params.model - 型号
 * @param {string} params.status - 状态
 * @param {string} params.keyword - 关键词
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @returns {Promise} - 返回Promise对象
 */
export function getMobileVehicles(params = {}) {
  return request({
    url: '/api/v1/mobile/vehicles',
    method: 'get',
    params
  });
}

/**
 * 根据ID获取车辆详情 (移动端)
 * @param {string} vehicleId - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function getMobileVehicleById(vehicleId) {
  return request({
    url: `/api/v1/mobile/vehicles/${vehicleId}`,
    method: 'get'
  });
}

/**
 * 获取用户车辆列表
 * @param {string} userId - 用户ID
 * @returns {Promise} - 返回Promise对象
 */
export function getUserVehicles(userId) {
  return request({
    url: `/api/v1/mobile/vehicles/user/${userId}`,
    method: 'get'
  });
}

/**
 * 添加用户车辆
 * @param {string} userId - 用户ID
 * @param {Object} vehicleData - 车辆数据
 * @param {string} vehicleData.licensePlate - 车牌号
 * @param {string} vehicleData.brand - 品牌
 * @param {string} vehicleData.model - 型号
 * @param {string} vehicleData.year - 年份
 * @param {string} vehicleData.color - 颜色
 * @param {string} vehicleData.engineNumber - 发动机号
 * @param {string} vehicleData.chassisNumber - 车架号
 * @param {string} vehicleData.description - 描述
 * @returns {Promise} - 返回Promise对象
 */
export function addUserVehicle(userId, vehicleData) {
  return request({
    url: `/api/v1/mobile/vehicles/user/${userId}`,
    method: 'post',
    data: vehicleData
  });
}

/**
 * 更新车辆信息 (移动端)
 * @param {string} vehicleId - 车辆ID
 * @param {Object} vehicleData - 车辆数据
 * @returns {Promise} - 返回Promise对象
 */
export function updateMobileVehicle(vehicleId, vehicleData) {
  return request({
    url: `/api/v1/mobile/vehicles/${vehicleId}`,
    method: 'put',
    data: vehicleData
  });
}

/**
 * 删除车辆 (移动端)
 * @param {string} vehicleId - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function deleteMobileVehicle(vehicleId) {
  return request({
    url: `/api/v1/mobile/vehicles/${vehicleId}`,
    method: 'delete'
  });
}

/**
 * 上传车辆图片
 * @param {string} vehicleId - 车辆ID
 * @param {FormData} formData - 包含图片文件的FormData
 * @returns {Promise} - 返回Promise对象
 */
export function uploadVehicleImages(vehicleId, formData) {
  return request({
    url: `/api/v1/mobile/vehicles/${vehicleId}/images`,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

/**
 * 获取车辆图片列表
 * @param {string} vehicleId - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleImages(vehicleId) {
  return request({
    url: `/api/v1/mobile/vehicles/${vehicleId}/images`,
    method: 'get'
  });
}

/**
 * 获取车辆品牌列表
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleBrands() {
  return request({
    url: '/api/v1/mobile/vehicles/brands',
    method: 'get'
  });
}

/**
 * 获取车辆型号列表
 * @param {string} brandId - 品牌ID (可选)
 * @returns {Promise} - 返回Promise对象
 */
export function getVehicleModels(brandId = null) {
  const params = brandId ? { brandId } : {};
  return request({
    url: '/api/v1/mobile/vehicles/models',
    method: 'get',
    params
  });
}