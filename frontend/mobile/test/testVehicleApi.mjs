import { getMobileVehicles, getMobileVehicleById } from '../src/api/vehicle.js';

async function testVehicleApi() {
  try {
    console.log('测试车辆列表 API');

    const params = {
      page: 1,
      size: 10
    };

    console.log('请求参数:', params);

    const response = await getMobileVehicles(params);
    console.log('车辆列表响应:', JSON.stringify(response, null, 2));

    console.log('车辆列表API测试成功！');

    // Test get vehicle by ID
    if (response.data.content && response.data.content.length > 0) {
      const vehicleId = response.data.content[0].vehicleId;
      console.log('测试获取车辆详情 API, vehicleId:', vehicleId);

      const detailResponse = await getMobileVehicleById(vehicleId);
      console.log('车辆详情响应:', JSON.stringify(detailResponse, null, 2));

      console.log('车辆详情API测试成功！');
    }

  } catch (error) {
    console.error('车辆API测试失败:', error.message);
  }
}

// 运行测试
testVehicleApi();
