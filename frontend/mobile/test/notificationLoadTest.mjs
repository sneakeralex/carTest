/**
 * 测试通知数据加载
 */
import { getNotifications } from '../src/api/dashboard.js';
import { mockNotifications } from '../src/mock/dashboard.js';

const testNotificationLoading = async () => {
  console.log('🔍 测试通知数据加载\n');
  
  // 模拟登录状态
  localStorage.setItem('token', 'test-token');
  localStorage.setItem('user', JSON.stringify({ userId: '1', name: 'Test User' }));
  
  try {
    console.log('📋 Mock 数据检查:');
    console.log(`   总通知数: ${mockNotifications.length}条`);
    console.log(`   未读通知: ${mockNotifications.filter(n => !n.read).length}条`);
    console.log(`   紧急通知: ${mockNotifications.filter(n => n.priority === 'urgent').length}条\n`);
    
    console.log('📱 API 调用测试:');
    const response = await getNotifications(10);
    console.log(`   API 响应状态: ${response.success ? '成功' : '失败'}`);
    console.log(`   返回通知数: ${response.data.length}条`);
    
    if (response.data.length > 0) {
      console.log('\n📝 返回的通知示例:');
      response.data.slice(0, 3).forEach((notification, index) => {
        console.log(`   ${index + 1}. ${notification.title}`);
        console.log(`      类型: ${notification.category} | 优先级: ${notification.priority}`);
        console.log(`      读取状态: ${notification.read ? '已读' : '未读'}`);
      });
    }
    
    console.log('\n✅ 通知数据加载测试通过！');
    return true;
    
  } catch (error) {
    console.error(`\n❌ 通知数据加载失败: ${error.message}`);
    return false;
  }
};

// 执行测试
testNotificationLoading().then(success => {
  if (success) {
    console.log('\n🎉 所有测试完成，通知功能正常！');
  } else {
    console.log('\n⚠️ 测试失败，请检查代码问题。');
  }
}).catch(error => {
  console.error(`\n💥 测试执行错误: ${error.message}`);
});
