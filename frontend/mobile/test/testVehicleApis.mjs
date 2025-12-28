import { getMobileVehicles, getMobileVehicleById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/vehicle.js';

async function testVehicleApis() {
  console.log('=== 测试车辆真实API ===\n');

  try {
    console.log('1. 测试获取车辆列表...');
    const vehiclesResult = await getMobileVehicles();
    console.log('   结果:', vehiclesResult.data?.content?.length || 0, '辆车');

    if (vehiclesResult.data?.content?.length > 0) {
      const firstVehicleId = vehiclesResult.data.content[0].vehicleId;
      console.log('2. 测试获取车辆详情 (ID:', firstVehicleId, ')...');
      const vehicleDetailResult = await getMobileVehicleById(firstVehicleId);
      console.log('   结果:', vehicleDetailResult.data ? '成功' : '失败');
      if (vehicleDetailResult.data) {
        console.log('   车辆信息:', {
          车牌: vehicleDetailResult.data.licensePlate,
          品牌: vehicleDetailResult.data.brand,
          型号: vehicleDetailResult.data.model,
          颜色: vehicleDetailResult.data.color
        });
      }
    }

    console.log('\n=== 车辆API测试完成 ===');

  } catch (error) {
    console.error('测试失败:', error);
  }
}

testVehicleApis();
