// 简单的设备API测试和数据格式验证
console.log('🔧 设备API和数据格式验证...');

// 检查mock数据格式
const mockData = {
  equipmentId: 1,
  equipmentNo: 'EQAB1234',
  equipmentName: '测试设备',
  equipmentType: '压力测试仪',
  status: 'IDLE'
};

console.log('📋 Mock数据格式:', mockData);

// 检查前端期望的数据格式
const expectedFormat = {
  id: mockData.equipmentId,
  code: mockData.equipmentNo,
  name: mockData.equipmentName,
  type: mockData.equipmentType,
  status: mockData.status
};

console.log('📋 前端期望格式:', expectedFormat);

// 数据转换函数
function convertEquipmentData(mockItems) {
  return mockItems.map(item => ({
    id: item.equipmentId,
    code: item.equipmentNo,
    name: item.equipmentName,
    type: item.equipmentType,
    status: item.status,
    // 保留原始数据
    ...item
  }));
}

console.log('✅ 数据转换函数已定义');
console.log('🎯 建议：在设备store或API中添加数据格式转换');

// API响应格式
const mockAPIResponse = {
  data: {
    content: [mockData],
    pageable: {
      pageNumber: 1,
      pageSize: 20,
      total: 1
    }
  },
  status: 200,
  statusText: 'OK'
};

console.log('📊 API响应格式:', mockAPIResponse);
console.log('\n🎉 验证完成！');
