import { artemisRequest } from './request';
import { SCHEDULE_API, BOOKING_API } from './config.js';

// Remove hardcoded server/port defaults — frontend should not contain remote IPs/ports.
export const test_management_server = import.meta.env.VITE_TEST_MANAGEMENT_SERVER || '';
export const test_management_port = import.meta.env.VITE_TEST_MANAGEMENT_PORT || '';

// 模拟响应格式
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

/**
 * 获取指定日期的场地安排
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getDailySchedule(date) {
  const queryParams = new URLSearchParams();
  queryParams.append('date', date);

  // Route via local /artemis proxy so upstream calls are forwarded through the dev proxy
  const res = await artemisRequest(`${SCHEDULE_API.DAILY}?${queryParams}`, { method: 'GET' });
  const result = res?.data;
  console.log('获取每日场地安排原始API响应:', JSON.stringify(result, null, 2));

  return mockResponse(result.data || result);
}

/**
 * 获取场地排期
 * @param {Object} params - 查询参数
 * @param {string} params.testSiteId - 测试场地ID
 * @param {string} params.date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getSchedule(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('testSiteId', params.testSiteId);
  if (params.date) queryParams.append('date', params.date);

  const res = await artemisRequest(`${SCHEDULE_API.SITE}?${queryParams}`, { method: 'GET' });
  const result = res?.data;
  console.log('获取场地排期原始API响应:', JSON.stringify(result, null, 2));

  const schedule = result.data || { 'AM': { available: true }, 'PM': { available: true } };
  return mockResponse(schedule);
}

/**
 * 获取天气信息
 * @param {Object} params - 查询参数
 * @param {string} params.testSiteId - 测试场地ID
 * @param {string} params.date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getWeather(params) {
  const queryParams = new URLSearchParams();
  queryParams.append('testSiteId', params.testSiteId);
  if (params.date) queryParams.append('date', params.date);

  const res = await artemisRequest(`${SCHEDULE_API.WEATHER}?${queryParams}`, { method: 'GET' });
  const result = res?.data;
  console.log('获取天气信息原始API响应:', JSON.stringify(result, null, 2));

  const weather = result.data || { temperature: 20, condition: '晴', suitable: true };
  return mockResponse(weather);
}

/**
 * 创建预约
 * @param {Object} data - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createBooking(data) {
  const res = await artemisRequest(SCHEDULE_API.BOOKING, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = res?.data;
  console.log('创建预约原始API响应:', JSON.stringify(result, null, 2));

  const booking = result.data || { bookingId: 'BK' + Date.now(), ...data, status: 'PENDING' };
  return mockResponse(booking);
}

/**
 * 获取场地排期
 * @param {Object} params - 查询参数
 * @param {string} params.provingGroundId - 试验场ID，默认3
 * @param {string} params.groundId - 场地ID，默认1
 * @param {number} params.day - 查看排期天数，默认7
 * @returns {Promise} - 返回Promise对象，结构 { data: { code, msg, data }, status, statusText, headers, config }
 */
export async function getGroundScheduling(params = {}) {
  try {
    const path = BOOKING_API.GROUND_SCHEDULING;
    const queryParams = new URLSearchParams();
    
    // 设置默认值
    if (params.provingGroundId !== undefined) {
      queryParams.append('provingGroundId', params.provingGroundId);
    } else {
      queryParams.append('provingGroundId', 3);
    }
    
    if (params.groundId !== undefined) {
      queryParams.append('groundId', params.groundId);
    } else {
      queryParams.append('groundId', 1);
    }
    
    if (params.day !== undefined) {
      queryParams.append('day', params.day);
    } else {
      queryParams.append('day', 7);
    }

    const res = await artemisRequest(`${path}?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const result = res?.data;
    console.log('获取场地排期原始API响应:', JSON.stringify(result, null, 2));
    
    // 检查返回的数据结构
    if (result && result.data && Array.isArray(result.data)) {
      console.log('API返回的数据长度:', result.data.length);
      if (result.data.length > 0) {
        console.log('第一个时间段的日期数据:', {
          nextZero: result.data[0].nextZero?.day,
          nextOne: result.data[0].nextOne?.day,
          nextTwo: result.data[0].nextTwo?.day,
          nextThree: result.data[0].nextThree?.day,
          nextFour: result.data[0].nextFour?.day,
          nextFive: result.data[0].nextFive?.day,
          nextSix: result.data[0].nextSix?.day
        });
      }
    }

    return {
      data: result,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取场地排期失败:', error);
    throw error;
  }
}

// 导出 API 对象
export const scheduleApi = {
  getDailySchedule,
  getSchedule,
  getWeather,
  createBooking,
  getGroundScheduling
};
