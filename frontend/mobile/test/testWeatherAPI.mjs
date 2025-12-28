/**
 * 天气API测试脚本
 * 测试 getWeatherInfo 函数的实际API调用
 */

import fetch from 'node-fetch';

// 模拟mock响应函数
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

// 模拟天气数据
const mockWeatherData = {
  date: '2025-04-01',
  condition: '晴朗',
  temperature: 25,
  windSpeed: 2,
  precipitation: 0,
  suitable: true
};

// 模拟getWeatherInfo
const getMockWeatherInfo = async (siteId, date) => {
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockResponse(mockWeatherData);
};

console.log('🌤️ 天气API测试开始...\n');

// 测试参数
const testSiteId = 'site1'; // 示例siteId
const testDate = '2025-04-01'; // 示例日期

// 实际API URL (通过proxy重写后的)
const apiUrl = 'https://cartest.douwifi.cn/artemis/api/v1/oeeooo7';

// 测试1: 调用实际API
console.log('📡 测试1: 调用实际天气API');
console.log(`URL: ${apiUrl}`);
console.log(`Method: POST`);
console.log(`Content-Type: application/x-www-form-urlencoded`);
console.log(`Body: siteId=${testSiteId}&date=${testDate}\n`);

try {
  const formData = new URLSearchParams();
  formData.append('siteId', testSiteId);
  formData.append('date', testDate);

  // Generate auth headers
  const reqInfo = {
    method: 'POST',
    url: '/artemis/api/v1/oeeooo7', // Note: full path for signing
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
    },
    body: formData.toString()
  };
  
  const creds = {
    appKey: '21345372', // From error message
    appSecret: 'CmxKJ6ON0dVzZRdkUkdm' // Assuming same as other APIs
  };
  
  // const authHeaders = generateArtemisAuthHeaders(reqInfo, creds);
  // console.log('认证头:', authHeaders);

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': '*/*',
      'Accept-Encoding': 'identity'
      // ...authHeaders
    },
    body: formData.toString()
  });

  console.log(`响应状态: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('API响应:');
  console.log(JSON.stringify(result, null, 2));

  // 检查响应格式
  if (result.code !== '0' && result.code !== 200) {
    console.log('❌ API返回错误:', result.msg || '未知错误');
  } else {
    console.log('✅ API调用成功');

    // 转换响应格式 (模拟weather.js中的逻辑)
    const weather = result.data || result;
    const transformedResponse = {
      data: {
        siteId: weather.siteId || testSiteId,
        date: weather.date || testDate,
        temperature: weather.temperature || weather.temp,
        humidity: weather.humidity,
        windSpeed: weather.windSpeed,
        weather: weather.weather || weather.condition,
        ...weather
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    console.log('转换后的响应:');
    console.log(JSON.stringify(transformedResponse, null, 2));
  }

} catch (error) {
  console.log('❌ 实际API调用失败:', error.message);
  console.log('🔄 回退到mock数据...\n');

  // 测试2: fallback到mock
  console.log('📊 测试2: Mock数据fallback');
  try {
    const mockResponse = await getMockWeatherInfo(testSiteId, testDate);
    console.log('Mock响应:');
    console.log(JSON.stringify(mockResponse, null, 2));
    console.log('✅ Mock数据获取成功');
  } catch (mockError) {
    console.log('❌ Mock数据获取失败:', mockError.message);
  }
}

console.log('\n🌤️ 天气API测试完成');
