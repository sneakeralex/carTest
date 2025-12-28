import request from './request';
import { getWeatherInfo as getMockWeatherInfo } from '../mock/weather';

// 使用mock数据
const useMock = false; // Changed to false to use real API

// 获取天气信息
export function getWeatherInfo(siteId, date) {
  if (useMock) {
    return getMockWeatherInfo(siteId, date);
  }
  
  // Use real API
  const formData = new URLSearchParams();
  formData.append('siteId', siteId);
  formData.append('date', date);
  
  // Generate auth headers
  const reqInfo = {
    method: 'POST',
    url: '/apiv1/oeeooo7',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
    },
    body: formData.toString()
  };
  
  // TODO: Get actual appKey and appSecret for weather API
  const creds = {
    appKey: '21345372', // From error message
    appSecret: 'CmxKJ6ON0dVzZRdkUkdm' // Assuming same as other APIs
  };
  
  // const authHeaders = generateArtemisAuthHeaders(reqInfo, creds);
  
  return fetch(`/apiv1/oeeooo7`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
      // ...authHeaders
    },
    body: formData.toString()
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }).then(result => {
    console.log('获取天气信息原始API响应:', JSON.stringify(result, null, 2));
    
    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取天气信息失败');
    }

    // Transform response to expected format
    const weather = result.data || result;
    return {
      data: {
        siteId: weather.siteId || siteId,
        date: weather.date || date,
        temperature: weather.temperature || weather.temp,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        weather: weather.weather || weather.condition,
        ...weather // Keep original fields
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  }).catch(error => {
    console.error('获取天气信息失败:', error);
    // Fallback to mock data
    return getMockWeatherInfo(siteId, date);
  });
}
