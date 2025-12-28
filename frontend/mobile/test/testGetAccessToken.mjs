/**
 * 测试getAccessToken API
 */

import fetch from 'node-fetch';

console.log('🔐 测试getAccessToken API开始...\n');

// 测试服务器配置
const baseUrl = 'https://cartest.douwifi.cn/artemis';

async function testGetAccessToken() {
  console.log('1. 测试获取访问token');
  console.log(`URL: https://cartest.douwifi.cn/artemis/v1/tgt/login?userCode=${encodeURIComponent('admin')}&service=${encodeURIComponent('https://172.16.231.251')}&language=${encodeURIComponent('zh_CN')}`);
  console.log(`Method: GET\n`);

  try {
    const response = await fetch(`https://cartest.douwifi.cn/artemis/api/cas/v1/tgt/login?userCode=${encodeURIComponent('admin')}&service=${encodeURIComponent('https://172.16.231.251')}&language=${encodeURIComponent('zh_CN')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      }
    });

    console.log(`响应状态: ${response.status} ${response.statusText}`);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    const text = await response.text();
    console.log('响应文本 (前500字符):', text.substring(0, 500));

    try {
      const result = JSON.parse(text);
      console.log('响应内容:');
      console.log(JSON.stringify(result, null, 2));

      if (response.ok && (result.code === 200 || result.code === '0' || result.code === 0)) {
        // 尝试提取token
        const token = result.token || result.tgt || result.ticket || result.data?.token || result.data?.tgt;
        if (token) {
          console.log('✅ 获取token成功:', token);

          // 使用token测试获取用户信息
          console.log('\n2. 使用token测试获取用户信息');
          console.log(`URL: ${baseUrl}/api/manage/auth/v2/manage/userService/getUserInfo`);
          console.log(`Method: GET`);
          console.log(`Authorization: Bearer ${token}\n`);

          try {
            const userResponse = await fetch(`${baseUrl}/api/manage/auth/v2/manage/userService/getUserInfo`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Encoding': 'identity',
                'Authorization': `Bearer ${token}`
              }
            });

            console.log(`用户信息响应状态: ${userResponse.status} ${userResponse.statusText}`);

            const userResult = await userResponse.json();
            console.log('用户信息响应内容:');
            console.log(JSON.stringify(userResult, null, 2));

            if (userResponse.ok) {
              console.log('✅ 使用token获取用户信息成功');
            } else {
              console.log('❌ 使用token获取用户信息失败');
            }
          } catch (userError) {
            console.log('❌ 获取用户信息请求失败:', userError.message);
          }

        } else {
          console.log('❌ 响应中未找到token');
        }
      } else {
        console.log('❌ 获取token失败:', result.msg || '未知错误');
      }
    } catch (parseError) {
      console.log('❌ 解析响应内容失败:', parseError.message);
    }

  } catch (error) {
    console.log('❌ 获取token请求失败:', error.message);
  }
}

// 运行测试
testGetAccessToken();
