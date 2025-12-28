#!/usr/bin/env node

/**
 * 增强通知系统测试脚本
 * 测试不同类型的通知消息显示和分类
 */

import { mockNotifications } from '../src/mock/dashboard.js';

console.log('🔔 增强通知系统测试');
console.log('='.repeat(50));

// 统计各类型通知数量
const notificationTypes = {};
const notificationCategories = {};
const priorityCount = {};
const actionRequiredCount = { required: 0, notRequired: 0 };
const readStatus = { read: 0, unread: 0 };

mockNotifications.forEach(notification => {
  // 统计类型
  notificationTypes[notification.type] = (notificationTypes[notification.type] || 0) + 1;
  
  // 统计分类
  notificationCategories[notification.category] = (notificationCategories[notification.category] || 0) + 1;
  
  // 统计优先级
  priorityCount[notification.priority] = (priorityCount[notification.priority] || 0) + 1;
  
  // 统计是否需要操作
  if (notification.actionRequired) {
    actionRequiredCount.required++;
  } else {
    actionRequiredCount.notRequired++;
  }
  
  // 统计读取状态
  if (notification.read) {
    readStatus.read++;
  } else {
    readStatus.unread++;
  }
});

console.log('\n📊 通知统计信息:');
console.log(`总通知数: ${mockNotifications.length}`);
console.log(`未读通知: ${readStatus.unread}`);
console.log(`已读通知: ${readStatus.read}`);
console.log(`需要操作: ${actionRequiredCount.required}`);
console.log(`无需操作: ${actionRequiredCount.notRequired}`);

console.log('\n📋 通知类型分布:');
Object.entries(notificationTypes).forEach(([type, count]) => {
  console.log(`  ${type}: ${count}条`);
});

console.log('\n🏷️ 通知分类分布:');
Object.entries(notificationCategories).forEach(([category, count]) => {
  const categoryNames = {
    'approval': '审批类',
    'site': '场地类',
    'equipment': '设备类',
    'system': '系统类',
    'financial': '财务类',
    'training': '培训类'
  };
  console.log(`  ${categoryNames[category] || category}: ${count}条`);
});

console.log('\n⚡ 优先级分布:');
Object.entries(priorityCount).forEach(([priority, count]) => {
  const priorityNames = {
    'urgent': '紧急',
    'high': '重要',
    'medium': '普通',
    'low': '一般'
  };
  console.log(`  ${priorityNames[priority] || priority}: ${count}条`);
});

console.log('\n🚨 紧急通知列表:');
const urgentNotifications = mockNotifications.filter(n => n.priority === 'urgent');
urgentNotifications.forEach(notification => {
  console.log(`  - ${notification.title}`);
  console.log(`    类型: ${notification.category}, 状态: ${notification.read ? '已读' : '未读'}`);
});

console.log('\n📢 需要操作的通知:');
const actionRequiredNotifications = mockNotifications.filter(n => n.actionRequired && !n.read);
actionRequiredNotifications.forEach(notification => {
  console.log(`  - ${notification.title}`);
  console.log(`    优先级: ${notification.priority}, 操作: ${notification.actions?.map(a => a.label).join(', ') || '无'}`);
});

console.log('\n🔧 设备相关通知:');
const equipmentNotifications = mockNotifications.filter(n => n.category === 'equipment');
equipmentNotifications.forEach(notification => {
  console.log(`  - ${notification.title}`);
  console.log(`    时间: ${new Date(notification.createdAt).toLocaleDateString()}, 优先级: ${notification.priority}`);
});

console.log('\n🏢 场地相关通知:');
const siteNotifications = mockNotifications.filter(n => n.category === 'site');
siteNotifications.forEach(notification => {
  console.log(`  - ${notification.title}`);
  console.log(`    时间: ${new Date(notification.createdAt).toLocaleDateString()}, 优先级: ${notification.priority}`);
});

console.log('\n✅ 测试完成！通知系统包含丰富的多类型消息数据');
console.log('包含场地通知、设备提醒、审批消息、系统通知、财务信息和培训提醒');
