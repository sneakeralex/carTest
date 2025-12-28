// 测试设备API是否工作
console.log('🔧 测试设备API...');

// 模拟调用设备API
import('../src/api/equipment.js').then(async (equipmentModule) => {
  try {
    console.log('✅ 设备API模块加载成功');
    
    // 测试获取设备列表
    const result = await equipmentModule.getEquipments({ page: 1, size: 5 });
    console.log('✅ getEquipments() 调用成功');
    console.log('📊 返回数据结构:', {
      hasData: !!result.data,
      hasContent: !!result.data?.content,
      itemCount: result.data?.content?.length || 0,
      totalItems: result.data?.pageable?.total || 0
    });
    
    if (result.data?.content?.length > 0) {
      const firstItem = result.data.content[0];
      console.log('📋 样本设备数据:', {
        equipmentId: firstItem.equipmentId,
        equipmentName: firstItem.equipmentName,
        equipmentNo: firstItem.equipmentNo,
        status: firstItem.status
      });
    }
    
    console.log('🎉 设备API测试完成！');
    console.log('🌐 设备页面现在应该可以正常加载了：http://localhost:5173/equipment/apply');
    
  } catch (error) {
    console.error('❌ 设备API测试失败:', error.message);
    console.error('详细错误:', error);
  }
}).catch(error => {
  console.error('❌ 无法加载设备API模块:', error);
});
