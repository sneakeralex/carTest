import { login, register, getUserInfo, getAccessToken } from '../src/api/auth.js';

async function testAuthApi() {
  try {
    console.log('1. 测试获取访问token API');
    const tokenResponse = await getAccessToken('admin', 'https://cartest.douwifi.cn', 'zh_CN');
    console.log('Token响应:', tokenResponse);
    
    const token = tokenResponse.data?.token;
    if (token) {
      console.log('✅ 获取token成功:', token);
      
      console.log('\n2. 使用token测试获取用户信息 API');
      const userInfoResponse = await getUserInfo(token);
      console.log('用户信息响应:', userInfoResponse);
    } else {
      console.log('❌ 获取token失败');
    }
    
    console.log('\n3. 测试登录 API');
    const loginResponse = await login('test_user', '123456');
    console.log('登录响应:', loginResponse);
    
    console.log('\n4. 测试获取用户信息 API (无token)');
    const userInfoResponseNoToken = await getUserInfo();
    console.log('用户信息响应:', userInfoResponseNoToken);
    
    console.log('\n5. 测试注册 API');
    const registerData = {
      username: 'new_user',
      password: '123456',
      name: '新用户',
      phone: '13912345678',
      email: 'new@example.com'
    };
    const registerResponse = await register(registerData);
    console.log('注册响应:', registerResponse);
    
    console.log('\n6. 测试错误登录');
    try {
      await login('wrong_user', 'wrong_password');
    } catch (err) {
      console.log('预期的登录失败:', err.message);
    }
    
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testAuthApi();
