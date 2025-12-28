console.log('🔧 开始设备API调试...');

// 直接测试设备API
async function testEquipmentAPI() {
  try {
    // 1. 测试直接调用设备API
    console.log('1️⃣ 测试直接调用设备API...');
    const equipmentAPI = await import('./src/api/equipment.js');
    const directResult = await equipmentAPI.getEquipments({ page: 1, size: 3 });
    console.log('✅ 直接调用成功');
    console.log('📊 直接调用结果:', directResult);
    
    // 2. 测试通过services/api调用
    console.log('\n2️⃣ 测试通过services/api调用...');
    const api = await import('./src/services/api.ts');
    const serviceResult = await api.default.equipment.getEquipments({ page: 1, size: 3 });
    console.log('✅ services/api调用成功');
    console.log('📊 services/api调用结果:', serviceResult);
    
    // 3. 测试store调用
    console.log('\n3️⃣ 测试store调用...');
    const { useEquipmentStore } = await import('./src/stores/equipment.js');
    // 注意：在Node.js环境中无法完全测试Pinia store
    console.log('✅ store模块加载成功');
    
    console.log('\n🎉 所有测试完成！');
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    console.error('📍 错误堆栈:', error.stack);
  }
}

testEquipmentAPI();
