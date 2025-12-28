import { mockResponse, delay, randomElement } from './utils.js';

// 模拟天气类型
const weatherTypes = [
  { condition: '晴朗', temperature: 25, windSpeed: 2, precipitation: 0, suitable: true },
  { condition: '多云', temperature: 22, windSpeed: 3, precipitation: 10, suitable: true },
  { condition: '小雨', temperature: 18, windSpeed: 4, precipitation: 60, suitable: false },
  { condition: '大风', temperature: 20, windSpeed: 8, precipitation: 0, suitable: false },
  { condition: '雷雨', temperature: 24, windSpeed: 6, precipitation: 90, suitable: false }
];

// 模拟天气数据 - 固定在2025年4月
export const mockWeatherData = Array.from({ length: 30 }, (_, index) => {
  const date = new Date('2025-04-01');
  date.setDate(date.getDate() + index);
  const dateStr = date.toISOString().split('T')[0];
  
  // 为特定日期设置特定天气
  if (dateStr === '2025-04-09') {
    return {
      date: dateStr,
      condition: '小雨',
      temperature: 18,
      windSpeed: 4,
      precipitation: 60,
      suitable: false
    };
  }
  
  return {
    date: dateStr,
    ...randomElement(weatherTypes)
  };
});

// 获取指定日期的天气信息
export async function getWeatherInfo(siteId, date) {
  await delay(300);
  const weather = mockWeatherData.find(w => w.date === date) || mockWeatherData[0];
  return mockResponse(weather);
}
