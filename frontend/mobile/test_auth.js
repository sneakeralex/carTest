// 测试认证和路由
console.log('Setting up test authentication...');

// 设置localStorage认证信息
const testUser = {
  userId: '1',
  employeeId: 'EMP20250101001',
  username: 'admin',
  name: '管理员',
  phone: '13800138000',
  email: 'admin@example.com',
  idCard: '310123199001010101',
  role: 'ADMIN',
  department: '车辆检测中心',
  position: '高级检测工程师',
  hireDate: '2025-01-01',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test_user'
};

const testToken = 'mock-jwt-token-' + Date.now();

localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('token', testToken);

console.log('Test authentication set up successfully');
console.log('User:', testUser);
console.log('Token:', testToken);
console.log('Now refreshing page...');

// 刷新页面查看路由
window.location.reload();
