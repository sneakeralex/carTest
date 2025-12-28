// 简化的递归更新错误验证脚本
import { readFileSync } from 'fs';

const files = [
  './src/views/BookingDetail.vue',
  './src/views/AppointmentDetail.vue',
  './src/views/NewMaintenance.vue', 
  './src/views/MaintenanceDetail.vue'
];

console.log('🔍 检查递归更新错误根源...\n');

files.forEach(filePath => {
  try {
    const content = readFileSync(filePath, 'utf8');
    console.log(`📁 ${filePath.split('/').pop()}:`);
    
    // 检查是否还有未注释的手动赋值
    const activeAssignments = [];
    
    // 检查 selectedDate.value = selectedValues
    const dateMatches = content.match(/^\s*selectedDate\.value\s*=\s*selectedValues[^;]*;/gm);
    if (dateMatches) {
      activeAssignments.push(...dateMatches);
    }
    
    // 检查 selectedRescheduleDate.value = selectedValues  
    const rescheduleDateMatches = content.match(/^\s*selectedRescheduleDate\.value\s*=\s*selectedValues[^;]*;/gm);
    if (rescheduleDateMatches) {
      activeAssignments.push(...rescheduleDateMatches);
    }
    
    if (activeAssignments.length > 0) {
      console.log(`  ❌ 发现活跃的手动赋值 (导致递归更新):`);
      activeAssignments.forEach(assign => {
        console.log(`     ${assign.trim()}`);
      });
    } else {
      console.log(`  ✅ 没有发现活跃的手动赋值`);
    }
    
    // 检查注释掉的赋值
    const commentedAssignments = content.match(/\/\/\s*selected\w*Date\.value\s*=\s*selectedValues/g);
    if (commentedAssignments) {
      console.log(`  ✅ 发现已注释的赋值: ${commentedAssignments.length} 个`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ❌ 读取文件失败: ${error.message}\n`);
  }
});

console.log('💡 如果仍有递归更新错误，请检查:');
console.log('1. 浏览器缓存是否已清除');  
console.log('2. 开发服务器是否需要重启');
console.log('3. Vue DevTools 中的具体错误堆栈');
