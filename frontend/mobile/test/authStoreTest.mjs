import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useAuthStore } from '../src/stores/auth.js';

async function testAuthStore() {
  try {
    // 创建测试环境
    const app = createApp({});
    const pinia = createPinia();
    app.use(pinia);
    
    // 初始化 auth store
    const authStore = useAuthStore();
    console.log('1. 初始化状态检查');
    console.log('初始token:', authStore.token);
    console.log('初始user:', authStore.user);
    console.log('初始认证状态:', authStore.isAuthenticated());
    
    console.log('\n2. 测试登录');
    try {
      const response = await authStore.login('test_user', '123456');
      console.log('登录响应:', response);
      console.log('登录后token:', authStore.token);
      console.log('登录后user:', authStore.user);
      console.log('登录后认证状态:', authStore.isAuthenticated());
      
      console.log('\n3. 测试获取用户信息');
      const userInfo = await authStore.getUserInfo();
      console.log('用户信息:', userInfo);
      
      console.log('\n4. 测试登出');
      authStore.logout();
      console.log('登出后token:', authStore.token);
      console.log('登出后user:', authStore.user);
      console.log('登出后认证状态:', authStore.isAuthenticated());
      
    } catch (err) {
      console.error('登录测试失败:', err);
    }
    
    console.log('\n5. 测试错误登录');
    try {
      await authStore.login('wrong_user', 'wrong_password');
    } catch (err) {
      console.log('预期的登录失败:', err);
    }
    
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testAuthStore();
