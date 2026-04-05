// 模拟API响应延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 导入存储工具
import { getItem } from '../utils/storage.js';
import { artemisRequest } from './request';
import { VEHICLE_API } from './config.js';

// 获取认证token的辅助函数
const getAuthToken = () => {
  // 在浏览器环境中使用storage工具
  if (typeof window !== 'undefined') {
    return getItem('token') || '';
  }
  // 在Node.js测试环境中返回空字符串
  return '';
};

// 车辆颜色映射
const getColorName = (colorCode) => {
  const colorMap = {
    1: '白色',
    2: '黑色',
    3: '红色',
    4: '蓝色',
    5: '银色',
    6: '灰色',
    7: '绿色',
    8: '黄色',
    9: '紫色',
    10: '橙色',
    11: '粉色'
  };
  return colorMap[colorCode] || '未知';
};

// 车辆类型映射
const getVehicleTypeName = (typeCode) => {
  const typeMap = {
    1: '轿车',
    2: 'SUV',
    3: '卡车',
    4: '面包车',
    5: '跑车',
    6: 'MPV'
  };
  return typeMap[typeCode] || '未知';
};

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
export async function getMobileVehicles(params = {}) {
  try {
    const bodyStr = JSON.stringify({
      pageNo: params.page || 1,
      pageSize: params.size || 100 // reduce payload to mitigate ECONNRESET
    });

    const res = await artemisRequest(VEHICLE_API.LIST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: bodyStr
    });

    const result = res?.data;

    console.log('原始API响应:', JSON.stringify(result, null, 2));
    
    // Check for API error response
    if (result.code && result.code !== '0') {
      throw new Error(result.msg || 'API error');
    }
    
    // Transform the response to match the expected format
    const transformedVehicles = (result.data.list || []).map(vehicle => ({
      vehicleId: vehicle.vehicleId,
      licensePlate: vehicle.plateNo,
      // API不提供品牌/型号/年份，保留原始值或设置为null
      brand: vehicle.vehicleBrand || null,
      model: vehicle.vehicleModel || null,
      year: vehicle.vehicleYear || null,
      mileage: vehicle.currentMileage || 0,
      // 颜色与类型名称映射
      color: getColorName(vehicle.vehicleColor),
      type: getVehicleTypeName(vehicle.vehicleType),
      vehicleTypeName: getVehicleTypeName(vehicle.vehicleType),
      vehicleTypeId: vehicle.vehicleType,
      // 车牌类型/颜色原始值
      plateType: vehicle.plateType,
      plateColor: vehicle.plateColor,
      // 绑定人员信息
      isBandPerson: vehicle.isBandPerson,
      personId: vehicle.personId,
      personName: vehicle.personName,
      phoneNo: vehicle.phoneNo,
      mark: vehicle.mark,
      status: vehicle.vehicleStatus || 'NORMAL',
      currentMileage: vehicle.currentMileage || 0,
      images: [],
      // 保留原始字段
      ...vehicle
    }));

    return {
      data: {
        content: transformedVehicles,
        pageable: {
          pageNumber: result.data.pageNo || params.page || 0,
          pageSize: result.data.pageSize || params.size || 10,
          total: result.data.total || 0
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取车辆列表失败:', error);
    // Retry once on network errors
    if (error && (error.name === 'TypeError' || /Network|ECONNRESET|fetch failed/i.test(String(error)))) {
      try {
        await delay(300);
        const retryBody = JSON.stringify({
          pageNo: params.page || 1,
          pageSize: 50
        });
        const res = await artemisRequest(VEHICLE_API.ADVANCE_LIST, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': '*/*', 'Accept-Encoding': 'identity' },
          body: retryBody
        });
        if (res) {
          const result = res?.data;
          if (!result.code || result.code === '0') {
            const transformedVehicles = (result.data.list || []).map(vehicle => ({
              vehicleId: vehicle.vehicleId,
              licensePlate: vehicle.plateNo,
              // API不提供品牌/型号/年份，保留原始值或设置为null
              brand: vehicle.vehicleBrand || null,
              model: vehicle.vehicleModel || null,
              year: vehicle.vehicleYear || null,
              mileage: vehicle.currentMileage || 0,
              // 颜色与类型名称映射
              color: getColorName(vehicle.vehicleColor),
              type: getVehicleTypeName(vehicle.vehicleType),
              vehicleTypeName: getVehicleTypeName(vehicle.vehicleType),
              vehicleTypeId: vehicle.vehicleType,
              // 车牌类型/颜色原始值
              plateType: vehicle.plateType,
              plateColor: vehicle.plateColor,
              // 绑定人员信息
              isBandPerson: vehicle.isBandPerson,
              personId: vehicle.personId,
              personName: vehicle.personName,
              phoneNo: vehicle.phoneNo,
              mark: vehicle.mark,
              status: vehicle.vehicleStatus || 'NORMAL',
              currentMileage: vehicle.currentMileage || 0,
              images: [],
              // 保留原始字段
              ...vehicle
            }));
            return {
              data: {
                content: transformedVehicles,
                pageable: {
                  pageNumber: result.data.pageNo || params.page || 0,
                  pageSize: result.data.pageSize || 50,
                  total: result.data.total || transformedVehicles.length
                }
              },
              status: 200,
              statusText: 'OK',
              headers: {},
              config: {}
            };
          }
        }
      } catch (e) {
        console.warn('重试获取车辆列表失败:', e);
      }
    }
    throw error;
  }
}

/**
 * 根据ID获取车辆详情 (移动端)
 * @param {string} vehicleId - 车辆ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getMobileVehicleById(vehicleId) {
  try {
    // Since the API doesn't support querying by ID, we fetch all vehicles and find the one we need
    const bodyStr = JSON.stringify({
      pageNo: 1,
      pageSize: 100 // reduce payload
    });

    const res = await artemisRequest(VEHICLE_API.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: bodyStr
    });

    const result = res?.data;
    console.log('获取车辆详情原始API响应:', JSON.stringify(result, null, 2));
    // 如果后端返回错误码或禁止访问，走mock回退
    if ((result.code && result.code !== '0') || !result.data) {
      throw new Error(result.msg || 'API error');
    }
    
    // Find the specific vehicle
    const vehicle = result.data && result.data.list ? result.data.list.find(v => String(v.vehicleId) === String(vehicleId)) : null;
    
    if (!vehicle) {
      throw new Error('车辆不存在');
    }

    // Transform the vehicle to match expected format
    const transformedVehicle = {
      vehicleId: vehicle.vehicleId,
      licensePlate: vehicle.plateNo,
      // API不提供品牌/型号/年份，保留原始值或设置为null
      brand: vehicle.vehicleBrand || null,
      model: vehicle.vehicleModel || null,
      year: vehicle.vehicleYear || null,
      mileage: vehicle.currentMileage || 0,
      // 颜色与类型名称映射
      color: getColorName(vehicle.vehicleColor),
      type: getVehicleTypeName(vehicle.vehicleType),
      vehicleTypeName: getVehicleTypeName(vehicle.vehicleType),
      vehicleTypeId: vehicle.vehicleType,
      // 车牌类型/颜色原始值
      plateType: vehicle.plateType,
      plateColor: vehicle.plateColor,
      // 绑定人员信息
      isBandPerson: vehicle.isBandPerson,
      personId: vehicle.personId,
      personName: vehicle.personName,
      phoneNo: vehicle.phoneNo,
      mark: vehicle.mark,
      status: vehicle.vehicleStatus || 'NORMAL',
      currentMileage: vehicle.currentMileage || 0,
      images: [],
      // Keep original fields
      ...vehicle
    };
    
    return {
      data: transformedVehicle,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取车辆详情失败:', error);
    throw error;
  }
}

/**
 * 获取车辆品牌列表
 * @returns {Promise} - 返回Promise对象
 */
export async function getVehicleBrands() {
  await delay(300);
  return [];
}

/**
 * 获取车辆型号列表
 * @param {string} brandId - 品牌ID (可选)
 * @returns {Promise} - 返回Promise对象
 */
export async function getVehicleModels(brandId = null) {
  await delay(300);
  return [];
}

/**
 * 获取车辆类型列表
 * @returns {Promise} - 返回Promise对象
 */
export async function getVehicleTypes() {
  await delay(300);
  return [];
}

// 兼容旧用法的导出别名
export { getMobileVehicles as getVehicles };
// 如需要也可导出详情别名（保留现有命名不变）
export { getMobileVehicleById as getVehicleById };
