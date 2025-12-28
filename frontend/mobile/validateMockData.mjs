// 验证mock数据生成结果
import Mock from 'mockjs';

console.log('🔧 验证Mock.js数据生成...\n');

// 重新生成一次mock数据来检查
const testMockData = Mock.mock({
  [`list|20`]: [{
    'equipmentId|+1': 1,
    'equipmentNo': /EQ[A-Z]{2}\d{4}/,
    'equipmentName': '@ctitle(3, 8)',
    'equipmentType|1': ['压力测试仪', '温度检测仪', '电压表', '万用表', '示波器'],
    'status|1': ['IN_USE', 'IDLE', 'MAINTENANCE', 'RETIRED'],
    'location': '@ctitle(5, 10)实验室',
    'departmentName': '@ctitle(3, 6)部'
  }]
}).list;

console.log('1️⃣ 测试生成的mock数据:');
console.log('数据数量:', testMockData.length);

if (testMockData.length > 0) {
  console.log('前3个设备样本:');
  testMockData.slice(0, 3).forEach((item, index) => {
    console.log(`设备${index + 1}:`, {
      id: item.equipmentId,
      name: item.equipmentName,
      no: item.equipmentNo,
      status: item.status,
      type: item.equipmentType
    });
  });
  
  const statusDistribution = testMockData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
  console.log('\n2️⃣ 状态分布统计:');
  console.log(statusDistribution);
  
  const idleCount = testMockData.filter(item => item.status === 'IDLE').length;
  console.log('\n3️⃣ 空闲设备分析:');
  console.log('空闲设备数量:', idleCount);
  console.log('空闲设备占比:', (idleCount / testMockData.length * 100).toFixed(1) + '%');
  
  if (idleCount > 0) {
    console.log('✅ 有空闲设备可用');
    const idleEquipments = testMockData.filter(item => item.status === 'IDLE');
    console.log('第一个空闲设备:', {
      name: idleEquipments[0].equipmentName,
      no: idleEquipments[0].equipmentNo
    });
  } else {
    console.log('⚠️ 这次生成没有空闲设备');
  }
} else {
  console.log('❌ 没有生成任何数据');
}

// 现在导入实际的mock数据进行对比
console.log('\n4️⃣ 导入实际的mock数据进行对比...');
import('./src/mock/equipment.js').then(equipmentMock => {
  const actualMockData = equipmentMock.mockEquipments;
  console.log('实际mock数据数量:', actualMockData?.length || 0);
  
  if (actualMockData && actualMockData.length > 0) {
    const actualStatusDistribution = actualMockData.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('实际状态分布:', actualStatusDistribution);
    
    const actualIdleCount = actualMockData.filter(item => item.status === 'IDLE').length;
    console.log('实际空闲设备数:', actualIdleCount);
    
    if (actualIdleCount > 0) {
      console.log('✅ 实际mock数据有空闲设备');
    } else {
      console.log('❌ 实际mock数据没有空闲设备！这是问题所在');
    }
  }
}).catch(error => {
  console.error('导入mock数据失败:', error);
});
