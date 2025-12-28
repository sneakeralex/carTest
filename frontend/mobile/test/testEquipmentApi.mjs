import { getEquipments, getEquipmentById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/equipment.js';

async function testEquipmentApi() {
  try {
    console.log('测试设备列表 API');
    const params = { page: 1, size: 10 };
    const response = await getEquipments(params);
    console.log('设备列表响应:', JSON.stringify(response, null, 2));

    if (response.data.content && response.data.content.length > 0) {
      const firstEquipmentId = response.data.content[0].equipmentId;
      console.log('\n测试获取设备详情 API, equipmentId:', firstEquipmentId);
      const detailResponse = await getEquipmentById(firstEquipmentId);
      console.log('设备详情响应:', JSON.stringify(detailResponse, null, 2));
    }

    console.log('设备API测试成功！');
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testEquipmentApi();
