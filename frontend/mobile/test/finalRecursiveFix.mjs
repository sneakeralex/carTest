// 递归更新错误最终修复脚本
import { readFileSync, writeFileSync } from 'fs';

const problematicFiles = [
  './src/views/BookingDetail.vue',
  './src/views/AppointmentDetail.vue',
  './src/views/NewMaintenance.vue',
  './src/views/MaintenanceDetail.vue'
];

console.log('🔧 执行递归更新错误最终修复...\n');

problematicFiles.forEach(filePath => {
  try {
    let content = readFileSync(filePath, 'utf8');
    let modified = false;
    const filename = filePath.split('/').pop();
    
    console.log(`📁 处理 ${filename}:`);
    
    // 1. 确保所有手动赋值都被注释掉
    const patterns = [
      /^(\s*)selectedDate\.value\s*=\s*selectedValues([^;]*);$/gm,
      /^(\s*)selectedRescheduleDate\.value\s*=\s*selectedValues([^;]*);$/gm
    ];
    
    patterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, '$1// selectedDate.value = selectedValues$2; // 已注释避免递归更新');
        modified = true;
        console.log(`  ✅ 注释掉手动赋值: ${matches.length} 处`);
      }
    });
    
    // 2. 检查所有 date confirm 处理函数是否正确
    const confirmHandlerRegex = /const\s+(on\w*DateConfirm)\s*=\s*\(\s*\{\s*selectedValues\s*\}\s*\)\s*=>\s*\{([^}]+)\}/gs;
    
    let match;
    while ((match = confirmHandlerRegex.exec(content)) !== null) {
      const [fullMatch, handlerName, handlerBody] = match;
      
      // 检查处理函数体内是否还有问题
      if (handlerBody.includes('selectedDate.value = selectedValues') && 
          !handlerBody.includes('// selectedDate.value = selectedValues')) {
        console.log(`  ⚠️  发现 ${handlerName} 中仍有活跃的手动赋值`);
      } else {
        console.log(`  ✅ ${handlerName} 处理函数正确`);
      }
    }
    
    // 3. 如果有修改，写回文件
    if (modified) {
      writeFileSync(filePath, content, 'utf8');
      console.log(`  💾 文件已更新`);
    } else {
      console.log(`  ✅ 文件无需修改`);
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ❌ 处理文件失败: ${error.message}\n`);
  }
});

console.log('🚀 修复完成! 请刷新浏览器页面并测试日期选择器功能。');
console.log('💡 如果问题仍然存在，请执行以下操作:');
console.log('1. 在浏览器中按 Cmd+Shift+Delete 清除缓存');
console.log('2. 重新启动开发服务器');
console.log('3. 检查 Vue DevTools 中的具体错误信息');
