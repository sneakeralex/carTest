// 设备领用页面问题诊断脚本
import { getEquipments } from '../src/api/equipment.js';

console.log('🔧 开始诊断设备领用页面问题...\n');

async function diagnoseEquipmentIssue() {
  try {
    // 1. 测试设备API
    console.log('1️⃣ 测试设备API调用...');
    const result = await getEquipments({ page: 1, size: 10 });
    console.log('✅ 设备API调用成功');
    console.log('📊 API响应结构:', {
      hasData: !!result.data,
      hasContent: !!result.data?.content,
      contentLength: result.data?.content?.length || 0,
      sampleItem: result.data?.content?.[0] || null
    });
    
    // 2. 检查数据格式
    if (result.data?.content?.length > 0) {
      const sampleEquipment = result.data.content[0];
      console.log('\n2️⃣ 检查数据格式...');
      console.log('📋 样本设备数据:', {
        equipmentId: sampleEquipment.equipmentId,
        equipmentName: sampleEquipment.equipmentName,
        equipmentNo: sampleEquipment.equipmentNo,
        status: sampleEquipment.status,
        equipmentType: sampleEquipment.equipmentType
      });
      
      // 3. 检查空闲设备
      const idleEquipments = result.data.content.filter(item => item.status === 'IDLE');
      console.log('\n3️⃣ 空闲设备统计:');
      console.log('📈 总设备数:', result.data.content.length);
      console.log('📈 空闲设备数:', idleEquipments.length);
      console.log('📈 状态分布:', {
        IDLE: result.data.content.filter(item => item.status === 'IDLE').length,
        IN_USE: result.data.content.filter(item => item.status === 'IN_USE').length,
        MAINTENANCE: result.data.content.filter(item => item.status === 'MAINTENANCE').length,
        RETIRED: result.data.content.filter(item => item.status === 'RETIRED').length
      });
      
      if (idleEquipments.length > 0) {
        console.log('✅ 有可用的空闲设备');
        console.log('📋 第一个空闲设备:', {
          name: idleEquipments[0].equipmentName,
          no: idleEquipments[0].equipmentNo,
          id: idleEquipments[0].equipmentId
        });
      } else {
        console.log('⚠️ 没有可用的空闲设备');
      }
    }
    
    console.log('\n🎉 设备API诊断完成！');
    
  } catch (error) {
    console.error('❌ 设备API测试失败:', error.message);
    console.error('📍 错误详情:', error);
  }
}

// 运行诊断
diagnoseEquipmentIssue();
