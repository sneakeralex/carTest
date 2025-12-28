// 检查booking文件中的日期
const fs = require('fs');
const path = require('path');

const bookingMockPath = path.join(__dirname, '../src/mock/booking.js');

try {
  const bookingContent = fs.readFileSync(bookingMockPath, 'utf8');
  console.log('✅ 成功读取booking.js文件');
  
  // 检查是否有9月日期
  const septemberMatches = bookingContent.match(/2025-09/g);
  if (septemberMatches) {
    console.log('⚠️ 在booking.js中发现9月日期:', septemberMatches.length, '处');
    
    // 显示包含9月日期的行
    const lines = bookingContent.split('\n');
    lines.forEach((line, index) => {
      if (line.includes('2025-09')) {
        console.log(`  第${index + 1}行: ${line.trim()}`);
      }
    });
  } else {
    console.log('✅ booking.js中没有发现9月日期');
  }
  
  // 检查4月日期
  const aprilMatches = bookingContent.match(/2025-04/g);
  if (aprilMatches) {
    console.log('✅ 在booking.js中发现4月日期:', aprilMatches.length, '处');
  }
  
  // 显示所有日期相关的行
  console.log('\n📅 所有包含日期的行:');
  const lines = bookingContent.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('2025-') && !line.includes('//')) {
      console.log(`  第${index + 1}行: ${line.trim()}`);
    }
  });
  
} catch (error) {
  console.error('❌ 读取文件失败:', error.message);
}
