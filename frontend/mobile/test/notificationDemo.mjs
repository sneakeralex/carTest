/**
 * 通知功能演示脚本
 * 展示通知公告中的审批消息、场地消息、设备归还提醒等功能
 */
import { mockNotifications } from '../src/mock/dashboard.js';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const colorLog = (text, color = 'reset') => {
  console.log(`${colors[color]}${text}${colors.reset}`);
};

// 演示通知公告功能
const demonstrateNotificationFeatures = () => {
  colorLog('\n🎯 通知公告功能演示', 'bright');
  colorLog('=' .repeat(50), 'cyan');
  
  // 1. 审批消息演示
  colorLog('\n📋 1. 审批消息类型展示', 'blue');
  const approvalNotifications = mockNotifications.filter(n => n.category === 'approval');
  approvalNotifications.forEach((notification, index) => {
    colorLog(`\n  ${index + 1}. ${notification.title}`, 'yellow');
    colorLog(`     优先级: ${notification.priority === 'high' ? '🔴 重要' : '🟡 普通'}`, 'white');
    colorLog(`     内容: ${notification.content.substring(0, 80)}...`, 'white');
    if (notification.actions) {
      colorLog(`     可执行操作: ${notification.actions.map(a => a.label).join(', ')}`, 'green');
    }
    if (notification.approvalProgress) {
      colorLog(`     审批进度: ${notification.approvalProgress.map(p => `${p.department}(${p.status})`).join(' → ')}`, 'cyan');
    }
  });

  // 2. 场地消息演示
  colorLog('\n🏢 2. 场地消息类型展示', 'blue');
  const siteNotifications = mockNotifications.filter(n => n.category === 'site');
  siteNotifications.forEach((notification, index) => {
    colorLog(`\n  ${index + 1}. ${notification.title}`, 'yellow');
    colorLog(`     相关场地: ${notification.relatedId}`, 'white');
    colorLog(`     内容: ${notification.content.substring(0, 80)}...`, 'white');
    if (notification.affectedBookings) {
      colorLog(`     影响预约: ${notification.affectedBookings.join(', ')}`, 'magenta');
    }
    if (notification.actions) {
      colorLog(`     可执行操作: ${notification.actions.map(a => a.label).join(', ')}`, 'green');
    }
  });

  // 3. 设备归还提醒演示
  colorLog('\n🔧 3. 设备归还提醒展示', 'blue');
  const equipmentNotifications = mockNotifications.filter(n => n.category === 'equipment');
  equipmentNotifications.forEach((notification, index) => {
    colorLog(`\n  ${index + 1}. ${notification.title}`, 'yellow');
    if (notification.priority === 'urgent') {
      colorLog(`     🚨 紧急提醒！`, 'red');
    }
    colorLog(`     内容: ${notification.content.substring(0, 80)}...`, 'white');
    if (notification.dueDate) {
      colorLog(`     截止时间: ${notification.dueDate}`, 'red');
    }
    if (notification.originalTime && notification.newTime) {
      colorLog(`     时间调整: ${notification.originalTime} → ${notification.newTime}`, 'cyan');
    }
    if (notification.actions) {
      colorLog(`     可执行操作: ${notification.actions.map(a => a.label).join(', ')}`, 'green');
    }
  });

  // 4. 统计信息
  colorLog('\n📊 4. 通知统计信息', 'blue');
  const stats = {
    total: mockNotifications.length,
    unread: mockNotifications.filter(n => !n.read).length,
    urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
    high: mockNotifications.filter(n => n.priority === 'high').length,
    actionRequired: mockNotifications.filter(n => n.actionRequired).length,
    withDeadline: mockNotifications.filter(n => n.dueDate).length
  };

  colorLog(`\n  总通知数量: ${stats.total}条`, 'white');
  colorLog(`  未读通知: ${stats.unread}条`, 'yellow');
  colorLog(`  紧急通知: ${stats.urgent}条`, 'red');
  colorLog(`  重要通知: ${stats.high}条`, 'yellow');
  colorLog(`  需要操作: ${stats.actionRequired}条`, 'green');
  colorLog(`  有截止时间: ${stats.withDeadline}条`, 'magenta');

  // 5. 功能特性展示
  colorLog('\n✨ 5. 高级功能特性', 'blue');
  colorLog('\n  📱 移动端适配特性:', 'cyan');
  colorLog('    • 响应式设计，适配各种屏幕尺寸', 'white');
  colorLog('    • 下拉刷新，上拉加载更多', 'white');
  colorLog('    • 滑动操作，快捷处理通知', 'white');
  
  colorLog('\n  🎨 用户体验特性:', 'cyan');
  colorLog('    • 优先级颜色标识（红色=紧急，橙色=重要）', 'white');
  colorLog('    • 未读状态指示器', 'white');
  colorLog('    • 分类标签筛选', 'white');
  colorLog('    • 实时相对时间显示', 'white');
  
  colorLog('\n  ⚡ 交互功能特性:', 'cyan');
  colorLog('    • 一键快捷操作按钮', 'white');
  colorLog('    • 批量标记已读', 'white');
  colorLog('    • 通知设置个性化', 'white');
  colorLog('    • 免打扰时间管理', 'white');

  // 6. 页面路由展示
  colorLog('\n🗺️  6. 相关页面路由', 'blue');
  const routes = [
    { path: '/notifications', name: '通知列表', desc: '查看所有通知消息' },
    { path: '/notifications/:id', name: '通知详情', desc: '查看单条通知的详细信息' },
    { path: '/profile/notifications', name: '通知设置', desc: '管理通知偏好和推送设置' }
  ];

  routes.forEach(route => {
    colorLog(`\n  ${route.path}`, 'yellow');
    colorLog(`    ${route.name}: ${route.desc}`, 'white');
  });

  return true;
};

// 演示通知处理流程
const demonstrateNotificationFlow = () => {
  colorLog('\n🔄 通知处理流程演示', 'bright');
  colorLog('=' .repeat(50), 'cyan');

  const workflow = [
    {
      step: '1. 通知生成',
      description: '系统根据用户操作自动生成相应类型的通知',
      examples: ['审批结果通知', '场地变更通知', '设备到期提醒']
    },
    {
      step: '2. 通知分类',
      description: '按照业务类型和优先级进行分类处理',
      examples: ['审批类(approval)', '场地类(site)', '设备类(equipment)']
    },
    {
      step: '3. 推送策略',
      description: '根据用户设置和通知优先级决定推送方式',
      examples: ['紧急通知立即推送', '普通通知按设定时间推送', '免打扰时间延迟推送']
    },
    {
      step: '4. 用户交互',
      description: '用户可以查看、操作和管理通知',
      examples: ['快捷操作按钮', '详情查看', '批量处理']
    },
    {
      step: '5. 状态追踪',
      description: '记录通知的查看和处理状态',
      examples: ['已读/未读状态', '操作执行记录', '相关业务跳转']
    }
  ];

  workflow.forEach((item, index) => {
    colorLog(`\n${item.step}: ${item.description}`, 'blue');
    item.examples.forEach(example => {
      colorLog(`  • ${example}`, 'white');
    });
  });

  return true;
};

// 主演示函数
const runNotificationDemo = () => {
  colorLog('🚀 汽车测试平台 - 通知公告功能演示', 'bright');
  colorLog('版本: 1.0.0 | 日期: 2025年9月12日', 'cyan');
  
  try {
    // 运行功能演示
    demonstrateNotificationFeatures();
    
    // 运行流程演示
    demonstrateNotificationFlow();
    
    colorLog('\n🎉 演示完成！', 'green');
    colorLog('\n📝 使用说明:', 'blue');
    colorLog('1. 在首页可以看到最新的3条通知', 'white');
    colorLog('2. 点击"查看全部通知"进入通知列表页面', 'white');
    colorLog('3. 在通知列表可以按类型筛选和批量操作', 'white');
    colorLog('4. 点击单条通知查看详细内容和执行操作', 'white');
    colorLog('5. 在设置页面可以个性化通知偏好', 'white');

    return true;
  } catch (error) {
    colorLog(`\n❌ 演示过程中出现错误: ${error.message}`, 'red');
    return false;
  }
};

// 执行演示
if (typeof window === 'undefined') {
  // Node.js 环境
  runNotificationDemo();
} else {
  // 浏览器环境
  window.runNotificationDemo = runNotificationDemo;
  console.log('通知功能演示已加载，请在控制台运行 runNotificationDemo() 开始演示');
}

export { runNotificationDemo };
