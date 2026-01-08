import { mockResponse, delay, randomElement } from './utils.js';

// 模拟天气类型
const weatherTypes = [
  { condition: '晴朗', temperature: 25, windSpeed: 2, precipitation: 0, suitable: true },
  { condition: '多云', temperature: 22, windSpeed: 3, precipitation: 10, suitable: true },
  { condition: '小雨', temperature: 18, windSpeed: 4, precipitation: 60, suitable: false },
  { condition: '大风', temperature: 20, windSpeed: 8, precipitation: 0, suitable: false },
  { condition: '雷雨', temperature: 24, windSpeed: 6, precipitation: 90, suitable: false }
];

// No mock weather data — UI should request backend; return null when absent
export const mockWeatherData = [];

export async function getWeatherInfo(siteId, date) {
  return { data: null, status: 200 };
}
