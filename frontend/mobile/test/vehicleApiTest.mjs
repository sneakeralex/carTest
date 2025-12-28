import { 
  getMobileVehicles, 
  addUserVehicle, 
  getMobileVehicleById,
  updateMobileVehicle,
  deleteMobileVehicle,
  uploadVehicleImages
} from '../src/api/vehicle.js';

async function testVehicleApi() {
  try {
    console.log('1. 测试获取车辆列表');
    const vehicles = await getMobileVehicles();
    console.log('车辆列表:', JSON.stringify(vehicles.data, null, 2));

    console.log('\n2. 测试添加新车辆');
    const newVehicle = {
      licensePlate: '京A12345',
      brand: '比亚迪',
      model: '汉',
      year: '2025',
      color: '深空灰',
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS123456',
      description: '新能源汽车'
    };
    const addResponse = await addUserVehicle('1', newVehicle);
    console.log('添加车辆响应:', JSON.stringify(addResponse.data, null, 2));

    console.log('\n3. 测试获取车辆详情');
    const vehicleDetails = await getMobileVehicleById(addResponse.data.vehicleId);
    console.log('车辆详情:', JSON.stringify(vehicleDetails.data, null, 2));

    console.log('\n4. 测试更新车辆信息');
    const updateData = {
      ...addResponse.data,
      color: '珍珠白',
      description: '豪华新能源汽车'
    };
    const updateResponse = await updateMobileVehicle(addResponse.data.vehicleId, updateData);
    console.log('更新响应:', JSON.stringify(updateResponse.data, null, 2));

    console.log('\n5. 测试上传车辆图片');
    // 模拟 FormData
    const formData = new FormData();
    formData.append('file', new Blob(['test']), 'test.jpg');
    const uploadResponse = await uploadVehicleImages(addResponse.data.vehicleId, formData);
    console.log('上传图片响应:', JSON.stringify(uploadResponse.data, null, 2));

    console.log('\n6. 测试删除车辆');
    const deleteResponse = await deleteMobileVehicle(addResponse.data.vehicleId);
    console.log('删除响应:', JSON.stringify(deleteResponse.data, null, 2));

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testVehicleApi();
