/**
 * 通知功能测试
 * 测试通知公告中的审批消息、场地消息、设备归还提醒等功能
 */
import { mockNotifications } from '../src/mock/dashboard.js';

// 通知类型测试
const testNotificationTypes = () => {
  console.log('=== 通知类型测试 ===');
  
  const approvalNotifications = mockNotifications.filter(n => n.category === 'approval');
  console.log(`✅ 审批消息数量: ${approvalNotifications.length}`);
  
  const siteNotifications = mockNotifications.filter(n => n.category === 'site');
  console.log(`✅ 场地消息数量: ${siteNotifications.length}`);
  
  const equipmentNotifications = mockNotifications.filter(n => n.category === 'equipment');
  console.log(`✅ 设备消息数量: ${equipmentNotifications.length}`);
  
  return approvalNotifications.length > 0 && siteNotifications.length > 0 && equipmentNotifications.length > 0;
};

// 优先级测试
const testNotificationPriorities = () => {
  console.log('\n=== 通知优先级测试 ===');
  
  const urgentNotifications = mockNotifications.filter(n => n.priority === 'urgent');
  const highNotifications = mockNotifications.filter(n => n.priority === 'high');
  const mediumNotifications = mockNotifications.filter(n => n.priority === 'medium');
  const lowNotifications = mockNotifications.filter(n => n.priority === 'low');
  
  console.log(`✅ 紧急通知: ${urgentNotifications.length}条`);
  console.log(`✅ 重要通知: ${highNotifications.length}条`);
  console.log(`✅ 普通通知: ${mediumNotifications.length}条`);
  console.log(`✅ 一般通知: ${lowNotifications.length}条`);
  
  return urgentNotifications.length > 0 && highNotifications.length > 0;
};

// 操作按钮测试
const testNotificationActions = () => {
  console.log('\n=== 通知操作测试 ===');
  
  const actionableNotifications = mockNotifications.filter(n => n.actionRequired && n.actions);
  console.log(`✅ 需要操作的通知: ${actionableNotifications.length}条`);
  
  let totalActions = 0;
  actionableNotifications.forEach(notification => {
    if (notification.actions) {
      totalActions += notification.actions.length;
      console.log(`  - ${notification.title}: ${notification.actions.length}个操作`);
    }
  });
  
  console.log(`✅ 总操作按钮数: ${totalActions}个`);
  
  return actionableNotifications.length > 0 && totalActions > 0;
};

// 特殊功能测试
const testSpecialFeatures = () => {
  console.log('\n=== 特殊功能测试 ===');
  
  // 测试截止时间提醒
  const deadlineNotifications = mockNotifications.filter(n => n.dueDate);
  console.log(`✅ 有截止时间的通知: ${deadlineNotifications.length}条`);
  
  // 测试审批进度
  const approvalProgressNotifications = mockNotifications.filter(n => n.approvalProgress);
  console.log(`✅ 有审批进度的通知: ${approvalProgressNotifications.length}条`);
  
  // 测试受影响的预约
  const affectedBookingsNotifications = mockNotifications.filter(n => n.affectedBookings && n.affectedBookings.length > 0);
  console.log(`✅ 影响预约的通知: ${affectedBookingsNotifications.length}条`);
  
  // 测试时间冲突调整
  const conflictNotifications = mockNotifications.filter(n => n.originalTime && n.newTime);
  console.log(`✅ 时间冲突调整通知: ${conflictNotifications.length}条`);
  
  return deadlineNotifications.length > 0 && approvalProgressNotifications.length > 0;
};

// 通知内容详细测试
const testNotificationContent = () => {
  console.log('\n=== 通知内容测试 ===');
  
  console.log('📋 审批消息示例:');
  const approvalExample = mockNotifications.find(n => n.category === 'approval');
  if (approvalExample) {
    console.log(`  标题: ${approvalExample.title}`);
    console.log(`  内容: ${approvalExample.content.substring(0, 50)}...`);
    console.log(`  相关ID: ${approvalExample.relatedId}`);
  }
  
  console.log('\n📋 场地消息示例:');
  const siteExample = mockNotifications.find(n => n.category === 'site');
  if (siteExample) {
    console.log(`  标题: ${siteExample.title}`);
    console.log(`  内容: ${siteExample.content.substring(0, 50)}...`);
    console.log(`  相关场地: ${siteExample.relatedId}`);
  }
  
  console.log('\n📋 设备提醒示例:');
  const equipmentExample = mockNotifications.find(n => n.category === 'equipment');
  if (equipmentExample) {
    console.log(`  标题: ${equipmentExample.title}`);
    console.log(`  内容: ${equipmentExample.content.substring(0, 50)}...`);
    console.log(`  截止时间: ${equipmentExample.dueDate || '无'}`);
  }
  
  return true;
};

// 运行所有测试
const runAllTests = () => {
  console.log('🚀 开始通知功能测试\n');
  
  const tests = [
    { name: '通知类型测试', fn: testNotificationTypes },
    { name: '通知优先级测试', fn: testNotificationPriorities },
    { name: '通知操作测试', fn: testNotificationActions },
    { name: '特殊功能测试', fn: testSpecialFeatures },
    { name: '通知内容测试', fn: testNotificationContent }
  ];
  
  let passedTests = 0;
  
  tests.forEach(test => {
    try {
      const result = test.fn();
      if (result) {
        passedTests++;
        console.log(`\n✅ ${test.name} - 通过`);
      } else {
        console.log(`\n❌ ${test.name} - 失败`);
      }
    } catch (error) {
      console.log(`\n❌ ${test.name} - 错误: ${error.message}`);
    }
  });
  
  console.log(`\n📊 测试结果: ${passedTests}/${tests.length} 通过`);
  console.log(`\n📈 总通知数量: ${mockNotifications.length}条`);
  console.log(`📈 未读通知: ${mockNotifications.filter(n => !n.read).length}条`);
  
  if (passedTests === tests.length) {
    console.log('\n🎉 所有通知功能测试通过！');
    return true;
  } else {
    console.log('\n⚠️  部分测试未通过，请检查实现');
    return false;
  }
};

// 执行测试
if (typeof window === 'undefined') {
  // Node.js 环境
  runAllTests();
} else {
  // 浏览器环境
  window.testNotifications = runAllTests;
  console.log('通知功能测试已加载，请在控制台运行 testNotifications() 开始测试');
}

export { runAllTests };
