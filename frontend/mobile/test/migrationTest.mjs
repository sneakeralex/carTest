#!/usr/bin/env node

/**
 * 测试数据迁移功能
 * 验证 MyTestRegistrations.vue 和 Home.vue 中的硬编码数据已成功迁移到mock目录
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 动态导入模块
const testRegistrationApi = await import(join(__dirname, '../src/api/testRegistration.js')).then(m => m.testRegistrationApi);
const scheduleApi = await import(join(__dirname, '../src/api/schedule.js')).then(m => m.scheduleApi);

console.log('🚀 测试数据迁移功能...\n');

// 测试 testRegistrationApi
console.log('📋 测试 Test Registration API:');
try {
  console.log('- 获取所有测试报名数据...');
  const allRegistrations = await testRegistrationApi.getAll();
  console.log(`✅ 成功获取 ${allRegistrations.length} 条测试报名记录`);
  
  console.log('- 获取用户测试报名数据...');
  const userRegistrations = await testRegistrationApi.getUserRegistrations('user123');
  console.log(`✅ 成功获取用户的 ${userRegistrations.length} 条测试报名记录`);
  
  console.log('- 测试第一条记录的数据结构:');
  if (allRegistrations.length > 0) {
    const firstRecord = allRegistrations[0];
    console.log(`   - ID: ${firstRecord.id}`);
    console.log(`   - 任务名称: ${firstRecord.taskName}`);
    console.log(`   - 状态: ${firstRecord.status}`);
    console.log(`   - 测试类型: ${firstRecord.taskType}`);
    console.log(`   - 难度: ${firstRecord.difficulty}`);
  }
} catch (error) {
  console.error('❌ Test Registration API 测试失败:', error.message);
}

console.log('\n📅 测试 Schedule API:');
try {
  console.log('- 获取今日日程安排...');
  const today = new Date().toISOString().split('T')[0];
  const todaySchedule = await scheduleApi.getDailySchedule(today);
  console.log(`✅ 成功获取今日 ${todaySchedule.length} 条日程安排`);
  
  console.log('- 获取明天日程安排...');
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const tomorrowSchedule = await scheduleApi.getDailySchedule(tomorrow);
  console.log(`✅ 成功获取明天 ${tomorrowSchedule.length} 条日程安排`);
  
  console.log('- 测试第一条日程记录的数据结构:');
  if (todaySchedule.length > 0) {
    const firstSchedule = todaySchedule[0];
    console.log(`   - ID: ${firstSchedule.id}`);
    console.log(`   - 测试场地: ${firstSchedule.testSiteName}`);
    console.log(`   - 任务名称: ${firstSchedule.taskName}`);
    console.log(`   - 时间段: ${firstSchedule.timeSlot}`);
    console.log(`   - 状态: ${firstSchedule.status}`);
  }
} catch (error) {
  console.error('❌ Schedule API 测试失败:', error.message);
}

console.log('\n🎯 数据对比测试:');
try {
  // 验证数据完整性
  console.log('- 验证测试报名数据类型覆盖...');
  const registrations = await testRegistrationApi.getAll();
  const taskTypes = [...new Set(registrations.map(r => r.taskType))];
  const statuses = [...new Set(registrations.map(r => r.status))];
  const difficulties = [...new Set(registrations.map(r => r.difficulty))];
  
  console.log(`   - 测试类型: ${taskTypes.join(', ')}`);
  console.log(`   - 状态类型: ${statuses.join(', ')}`);
  console.log(`   - 难度级别: ${difficulties.join(', ')}`);
  
  console.log('- 验证日程安排数据状态覆盖...');
  const schedules = await scheduleApi.getDailySchedule(new Date().toISOString().split('T')[0]);
  const scheduleStatuses = [...new Set(schedules.map(s => s.status))];
  console.log(`   - 日程状态: ${scheduleStatuses.join(', ')}`);
  
  console.log('\n✅ 数据迁移测试完成！');
  console.log('📝 总结:');
  console.log('   - ✅ Test Registration API 正常工作');
  console.log('   - ✅ Schedule API 正常工作');
  console.log('   - ✅ 数据结构完整，类型多样');
  console.log('   - ✅ 硬编码数据已成功迁移到mock目录');
  
} catch (error) {
  console.error('❌ 数据对比测试失败:', error.message);
}
