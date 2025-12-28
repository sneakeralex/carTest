/**
 * 天气功能测试
 * 测试增强后的天气数据和功能
 */

import { mockWeatherInfo } from '../src/mock/dashboard.js';

console.log('🌤️  天气功能测试开始...\n');

// 测试1: 验证天气数据结构完整性
console.log('📊 测试1: 天气数据结构完整性');
const requiredWeatherFields = [
  'temperature', 'tempMin', 'tempMax', 'feelsLike',
  'weather', 'weatherCode', 'description',
  'humidity', 'windSpeed', 'windDirection', 'windLevel',
  'pressure', 'visibility', 'uvIndex', 'uvLevel',
  'aqi', 'aqiLevel', 'precipitation', 'precipitationProbability',
  'sunrise', 'sunset', 'city', 'district',
  'updateTime', 'suitable', 'suitabilityReason',
  'alerts', 'hourlyForecast', 'dailyForecast'
];

let missingFields = [];
requiredWeatherFields.forEach(field => {
  if (!(field in mockWeatherInfo)) {
    missingFields.push(field);
  }
});

if (missingFields.length === 0) {
  console.log('✅ 所有必需的天气字段都存在');
} else {
  console.log('❌ 缺少以下字段:', missingFields);
}

// 测试2: 验证天气数据类型
console.log('\n📝 测试2: 天气数据类型验证');
const typeChecks = [
  { field: 'temperature', type: 'number', value: mockWeatherInfo.temperature },
  { field: 'humidity', type: 'number', value: mockWeatherInfo.humidity },
  { field: 'windSpeed', type: 'number', value: mockWeatherInfo.windSpeed },
  { field: 'suitable', type: 'boolean', value: mockWeatherInfo.suitable },
  { field: 'hourlyForecast', type: 'object', value: mockWeatherInfo.hourlyForecast },
  { field: 'dailyForecast', type: 'object', value: mockWeatherInfo.dailyForecast }
];

typeChecks.forEach(check => {
  const actualType = Array.isArray(check.value) ? 'object' : typeof check.value;
  if (actualType === check.type) {
    console.log(`✅ ${check.field}: ${actualType}`);
  } else {
    console.log(`❌ ${check.field}: 期望 ${check.type}, 实际 ${actualType}`);
  }
});

// 测试3: 验证预报数据结构
console.log('\n⏰ 测试3: 预报数据结构验证');

// 检查小时预报
if (mockWeatherInfo.hourlyForecast && Array.isArray(mockWeatherInfo.hourlyForecast)) {
  const hourlyFields = ['time', 'temp', 'weather', 'windSpeed'];
  const firstHour = mockWeatherInfo.hourlyForecast[0];
  
  if (firstHour && hourlyFields.every(field => field in firstHour)) {
    console.log(`✅ 小时预报数据结构正确 (${mockWeatherInfo.hourlyForecast.length}小时)`);
  } else {
    console.log('❌ 小时预报数据结构不完整');
  }
} else {
  console.log('❌ 小时预报数据不存在或格式错误');
}

// 检查日预报
if (mockWeatherInfo.dailyForecast && Array.isArray(mockWeatherInfo.dailyForecast)) {
  const dailyFields = ['date', 'tempMin', 'tempMax', 'weather', 'suitable', 'description'];
  const firstDay = mockWeatherInfo.dailyForecast[0];
  
  if (firstDay && dailyFields.every(field => field in firstDay)) {
    console.log(`✅ 日预报数据结构正确 (${mockWeatherInfo.dailyForecast.length}天)`);
  } else {
    console.log('❌ 日预报数据结构不完整');
  }
} else {
  console.log('❌ 日预报数据不存在或格式错误');
}

// 测试4: 验证天气适宜性逻辑
console.log('\n🎯 测试4: 天气适宜性验证');

function checkWeatherSuitability(weatherData) {
  const factors = [];
  
  // 温度检查 (适宜范围: 5-35°C)
  if (weatherData.temperature >= 5 && weatherData.temperature <= 35) {
    factors.push('✅ 温度适宜');
  } else {
    factors.push('❌ 温度不适宜');
  }
  
  // 风速检查 (适宜范围: <25km/h)
  if (weatherData.windSpeed < 25) {
    factors.push('✅ 风速适宜');
  } else {
    factors.push('❌ 风速过大');
  }
  
  // 降水检查
  if (weatherData.precipitation < 5) {
    factors.push('✅ 降水量适宜');
  } else {
    factors.push('❌ 降水量过大');
  }
  
  // 能见度检查 (适宜范围: >10km)
  if (weatherData.visibility > 10) {
    factors.push('✅ 能见度良好');
  } else {
    factors.push('❌ 能见度不佳');
  }
  
  return factors;
}

const suitabilityFactors = checkWeatherSuitability(mockWeatherInfo);
suitabilityFactors.forEach(factor => console.log(factor));

const shouldBeSuitable = suitabilityFactors.every(factor => factor.includes('✅'));
if (shouldBeSuitable === mockWeatherInfo.suitable) {
  console.log('✅ 适宜性判断正确');
} else {
  console.log('❌ 适宜性判断可能有误');
}

// 测试5: 验证天气图标映射
console.log('\n🎨 测试5: 天气图标映射验证');

const weatherIconMap = {
  'sunny': 'sun-o',
  'cloudy': 'cloud-o',
  'rainy': 'umbrella-o',
  'snowy': 'snowflake-o',
  'foggy': 'fog-o',
  '晴': 'sun-o',
  '多云': 'cloud-o',
  '小雨': 'umbrella-o',
  '中雨': 'umbrella-o',
  '大雨': 'umbrella-o',
  '雪': 'snowflake-o',
  '雾': 'fog-o'
};

function getWeatherIcon(weatherCode) {
  return weatherIconMap[weatherCode] || 'sun-o';
}

// 测试当前天气图标
const currentIcon = getWeatherIcon(mockWeatherInfo.weatherCode);
console.log(`✅ 当前天气(${mockWeatherInfo.weather})图标: ${currentIcon}`);

// 测试预报天气图标
mockWeatherInfo.hourlyForecast.forEach((hour, index) => {
  if (index < 3) { // 只显示前3个
    const icon = getWeatherIcon(hour.weather);
    console.log(`✅ ${hour.time} ${hour.weather}图标: ${icon}`);
  }
});

// 测试6: 验证空气质量分级
console.log('\n🌬️  测试6: 空气质量分级验证');

function getAqiLevel(aqi) {
  if (aqi <= 50) return { level: '优', type: 'success' };
  if (aqi <= 100) return { level: '良', type: 'warning' };
  if (aqi <= 150) return { level: '轻度污染', type: 'danger' };
  if (aqi <= 200) return { level: '中度污染', type: 'danger' };
  if (aqi <= 300) return { level: '重度污染', type: 'danger' };
  return { level: '严重污染', type: 'danger' };
}

const aqiResult = getAqiLevel(mockWeatherInfo.aqi);
console.log(`✅ AQI ${mockWeatherInfo.aqi}: ${aqiResult.level} (${aqiResult.type})`);

// 测试7: 验证紫外线指数分级
console.log('\n☀️ 测试7: 紫外线指数分级验证');

function getUvLevel(uvIndex) {
  if (uvIndex <= 2) return { level: '弱', type: 'success' };
  if (uvIndex <= 5) return { level: '中等', type: 'warning' };
  if (uvIndex <= 7) return { level: '强', type: 'danger' };
  if (uvIndex <= 10) return { level: '很强', type: 'danger' };
  return { level: '极强', type: 'danger' };
}

const uvResult = getUvLevel(mockWeatherInfo.uvIndex);
console.log(`✅ UV指数 ${mockWeatherInfo.uvIndex}: ${uvResult.level} (${uvResult.type})`);

// 测试8: 数据一致性检查
console.log('\n🔍 测试8: 数据一致性检查');

const consistencyChecks = [
  {
    name: '温度范围一致性',
    check: mockWeatherInfo.tempMin <= mockWeatherInfo.temperature && 
           mockWeatherInfo.temperature <= mockWeatherInfo.tempMax,
    message: `当前温度${mockWeatherInfo.temperature}°C应在${mockWeatherInfo.tempMin}°C-${mockWeatherInfo.tempMax}°C范围内`
  },
  {
    name: 'AQI等级一致性',
    check: aqiResult.level === mockWeatherInfo.aqiLevel,
    message: `AQI等级应为${aqiResult.level}，当前为${mockWeatherInfo.aqiLevel}`
  },
  {
    name: 'UV等级一致性',
    check: uvResult.level === mockWeatherInfo.uvLevel,
    message: `UV等级应为${uvResult.level}，当前为${mockWeatherInfo.uvLevel}`
  }
];

consistencyChecks.forEach(check => {
  if (check.check) {
    console.log(`✅ ${check.name}`);
  } else {
    console.log(`❌ ${check.name}: ${check.message}`);
  }
});

console.log('\n🎉 天气功能测试完成！');

// 生成测试报告摘要
const testSummary = {
  totalTests: 8,
  weatherDataFields: requiredWeatherFields.length,
  hourlyForecastHours: mockWeatherInfo.hourlyForecast?.length || 0,
  dailyForecastDays: mockWeatherInfo.dailyForecast?.length || 0,
  currentWeather: {
    temperature: mockWeatherInfo.temperature,
    condition: mockWeatherInfo.weather,
    suitable: mockWeatherInfo.suitable,
    aqi: mockWeatherInfo.aqi,
    uvIndex: mockWeatherInfo.uvIndex
  }
};

console.log('\n📋 测试报告摘要:');
console.log(JSON.stringify(testSummary, null, 2));
