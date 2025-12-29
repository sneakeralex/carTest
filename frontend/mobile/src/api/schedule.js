import { generateDailySchedule } from '@/mock/schedule';
import { artemisRequest } from './request';

// 判断是否使用mock数据
const useMock = false; // Changed to false to prefer real API

// Remove hardcoded server/port defaults — frontend should not contain remote IPs/ports.
export const test_management_server = import.meta.env.VITE_TEST_MANAGEMENT_SERVER || '';
export const test_management_port = import.meta.env.VITE_TEST_MANAGEMENT_PORT || '';

// 模拟延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟响应格式
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

// 模拟场地排期数据
const mockSchedules = {
  'TS001': {
    name: '高速测试场',
    'AM': { available: true },
    'PM': { available: true },
  },
  'TS002': {
    name: '城市道路测试场',
    'AM': { available: false },
    'PM': { available: true },
  },
  'TS003': {
    name: '综合测试场',
    'AM': { available: true },
    'PM': { available: false },
  }
};

// 模拟天气数据
const mockWeather = {
  'TS001': {
    temperature: 25,
    condition: '晴',
    suitable: true,
  },
  'TS002': {
    temperature: 15,
    condition: '雨',
    suitable: false,
    warning: '当前降雨较大，可能影响测试进行'
  },
  'TS003': {
    temperature: 30,
    condition: '多云',
    suitable: true,
    warning: '气温较高，请注意防暑'
  }
};

/**
 * 获取指定日期的场地安排
 * @param {string} date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getDailySchedule(date) {
  if (useMock) {
    await delay(300);
    const scheduleData = generateDailySchedule(date);
    return scheduleData;
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('date', date);

    // Route via proxy; backend should handle any external routing/signing
    const res = await artemisRequest(`/api/schedule/daily?${queryParams}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取每日场地安排原始API响应:', JSON.stringify(result, null, 2));

    return mockResponse(result.data || result);
  } catch (error) {
    console.error('获取每日场地安排失败，使用mock数据:', error);
    // Fallback to mock
    await delay(300);
    const scheduleData = generateDailySchedule(date);
    return scheduleData;
  }
}

/**
 * 获取场地排期
 * @param {Object} params - 查询参数
 * @param {string} params.testSiteId - 测试场地ID
 * @param {string} params.date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getSchedule(params) {
  if (useMock) {
    await delay(300);
    const schedule = mockSchedules[params.testSiteId] || {
      'AM': { available: true },
      'PM': { available: true }
    };
    return mockResponse(schedule);
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('testSiteId', params.testSiteId);
    if (params.date) queryParams.append('date', params.date);

    const res = await artemisRequest(`/api/schedule/site?${queryParams}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取场地排期原始API响应:', JSON.stringify(result, null, 2));

    const schedule = result.data || { 'AM': { available: true }, 'PM': { available: true } };
    return mockResponse(schedule);
  } catch (error) {
    console.error('获取场地排期失败，使用mock数据:', error);
    await delay(300);
    const schedule = mockSchedules[params.testSiteId] || { 'AM': { available: true }, 'PM': { available: true } };
    return mockResponse(schedule);
  }
}

/**
 * 获取天气信息
 * @param {Object} params - 查询参数
 * @param {string} params.testSiteId - 测试场地ID
 * @param {string} params.date - 日期 (YYYY-MM-DD)
 * @returns {Promise} - 返回Promise对象
 */
export async function getWeather(params) {
  if (useMock) {
    await delay(300);
    const weather = mockWeather[params.testSiteId] || { temperature: 20, condition: '晴', suitable: true };
    return mockResponse(weather);
  }

  try {
    const queryParams = new URLSearchParams();
    queryParams.append('testSiteId', params.testSiteId);
    if (params.date) queryParams.append('date', params.date);

    const res = await artemisRequest(`/api/schedule/weather?${queryParams}`, { method: 'GET' });
    const result = res?.data;
    console.log('获取天气信息原始API响应:', JSON.stringify(result, null, 2));

    const weather = result.data || { temperature: 20, condition: '晴', suitable: true };
    return mockResponse(weather);
  } catch (error) {
    console.error('获取天气信息失败，使用mock数据:', error);
    await delay(300);
    const weather = mockWeather[params.testSiteId] || { temperature: 20, condition: '晴', suitable: true };
    return mockResponse(weather);
  }
}

/**
 * 创建预约
 * @param {Object} data - 预约数据
 * @returns {Promise} - 返回Promise对象
 */
export async function createBooking(data) {
  if (useMock) {
    await delay(500);
    return mockResponse({ bookingId: 'BK' + Date.now(), ...data, status: 'PENDING' });
  }

  try {
    const res = await artemisRequest('/api/schedule/booking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = res?.data;
    console.log('创建预约原始API响应:', JSON.stringify(result, null, 2));

    const booking = result.data || { bookingId: 'BK' + Date.now(), ...data, status: 'PENDING' };
    return mockResponse(booking);
  } catch (error) {
    console.error('创建预约失败，使用mock数据:', error);
    await delay(500);
    return mockResponse({ bookingId: 'BK' + Date.now(), ...data, status: 'PENDING' });
  }
}

// 导出 API 对象
export const scheduleApi = {
  getDailySchedule,
  getSchedule,
  getWeather,
  createBooking
};
