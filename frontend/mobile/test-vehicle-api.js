import { getMobileVehicles } from './src/api/vehicle.js';

// 动态导入以支持Node.js环境
async function loadVehicleAPI() {
  const vehicleAPI = await import('./src/api/vehicle.js');
  return {
    getMobileVehicles: vehicleAPI.getMobileVehicles,
    getMobileVehicleById: vehicleAPI.getMobileVehicleById,
    getUserVehicles: vehicleAPI.getUserVehicles,
    addUserVehicle: vehicleAPI.addUserVehicle,
    updateMobileVehicle: vehicleAPI.updateMobileVehicle,
    deleteMobileVehicle: vehicleAPI.deleteMobileVehicle,
    uploadVehicleImages: vehicleAPI.uploadVehicleImages,
    getVehicleImages: vehicleAPI.getVehicleImages,
    getVehicleBrands: vehicleAPI.getVehicleBrands,
    getVehicleModels: vehicleAPI.getVehicleModels,
    getVehicleTypes: vehicleAPI.getVehicleTypes
  };
}

/**
 * 测试获取车辆列表接口
 */
async function testVehicleListAPI() {
  console.log('🚗 开始测试车辆列表API...');

  try {
    // 测试基本调用
    console.log('\n=== 测试基本调用 ===');
    const result = await getMobileVehicles();
    console.log('✅ API响应状态:', result.status);
    console.log('📊 返回数据条数:', result.data.content.length);
    console.log('📄 分页信息:', result.data.pageable);
    console.log('🚙 第一辆车信息:', result.data.content[0] ? {
      vehicleId: result.data.content[0].vehicleId,
      licensePlate: result.data.content[0].licensePlate,
      brand: result.data.content[0].brand,
      model: result.data.content[0].model,
      status: result.data.content[0].status
    } : '无数据');

    // 测试带参数调用
    console.log('\n=== 测试带参数调用 (page=1, size=5) ===');
    const resultWithParams = await getMobileVehicles({ page: 1, size: 5 });
    console.log('✅ API响应状态:', resultWithParams.status);
    console.log('📊 返回数据条数:', resultWithParams.data.content.length);
    console.log('📄 分页信息:', resultWithParams.data.pageable);

    // 测试搜索功能
    console.log('\n=== 测试搜索功能 (keyword=京) ===');
    const resultWithSearch = await getMobileVehicles({ keyword: '京', page: 1, size: 10 });
    console.log('✅ API响应状态:', resultWithSearch.status);
    console.log('🔍 搜索结果条数:', resultWithSearch.data.content.length);
    console.log('📄 分页信息:', resultWithSearch.data.pageable);

    console.log('\n✅ 车辆列表API测试完成');

  } catch (error) {
    console.error('❌ 车辆列表API测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

/**
 * 测试获取车辆详情接口
 */
async function testVehicleDetailAPI() {
  console.log('\n🚗 开始测试车辆详情API...');

  try {
    // 先获取车辆列表，获取一个有效的车辆ID
    const vehicleList = await getMobileVehicles({ page: 1, size: 1 });
    if (vehicleList.data.content.length === 0) {
      console.log('⚠️ 没有可用的车辆数据，跳过详情测试');
      return;
    }

    const vehicleId = vehicleList.data.content[0].vehicleId;
    console.log('\n=== 测试获取车辆详情 ===');
    console.log('🎯 测试车辆ID:', vehicleId);

    const result = await getMobileVehicleById(vehicleId);
    console.log('✅ API响应状态:', result.status);
    console.log('🚙 车辆详情:', {
      vehicleId: result.data.vehicleId,
      licensePlate: result.data.licensePlate,
      brand: result.data.brand,
      model: result.data.model,
      color: result.data.color,
      status: result.data.status,
      mileage: result.data.mileage
    });

    console.log('\n✅ 车辆详情API测试完成');

  } catch (error) {
    console.error('❌ 车辆详情API测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

/**
 * 测试车辆品牌和型号接口
 */
async function testVehicleMetaAPI() {
  console.log('\n🚗 开始测试车辆元数据API...');

  try {
    // 测试获取车辆品牌
    console.log('\n=== 测试获取车辆品牌 ===');
    const brandsResult = await getVehicleBrands();
    console.log('✅ 品牌API响应状态:', brandsResult.status);
    console.log('🏷️ 品牌数量:', brandsResult.data.length);
    console.log('🏷️ 前3个品牌:', brandsResult.data.slice(0, 3));

    // 测试获取车辆型号
    console.log('\n=== 测试获取车辆型号 ===');
    const modelsResult = await getVehicleModels();
    console.log('✅ 型号API响应状态:', modelsResult.status);
    console.log('🚗 型号数量:', modelsResult.data.length);
    console.log('🚗 前3个型号:', modelsResult.data.slice(0, 3));

    // 测试获取车辆类型
    console.log('\n=== 测试获取车辆类型 ===');
    const typesResult = await getVehicleTypes();
    console.log('✅ 类型API响应状态:', typesResult.status);
    console.log('🚙 类型数量:', typesResult.data.length);
    console.log('🚙 车辆类型:', typesResult.data);

    console.log('\n✅ 车辆元数据API测试完成');

  } catch (error) {
    console.error('❌ 车辆元数据API测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

/**
 * 测试用户车辆相关接口
 */
async function testUserVehicleAPI() {
  console.log('\n🚗 开始测试用户车辆API...');

  try {
    const testUserId = 'user123';

    // 测试获取用户车辆列表
    console.log('\n=== 测试获取用户车辆列表 ===');
    const userVehiclesResult = await getUserVehicles(testUserId);
    console.log('✅ 用户车辆API响应状态:', userVehiclesResult.status);
    console.log('👤 用户车辆数量:', userVehiclesResult.data.length);

    // 测试添加用户车辆
    console.log('\n=== 测试添加用户车辆 ===');
    const newVehicleData = {
      licensePlate: '测试车牌123',
      brand: '测试品牌',
      model: '测试型号',
      year: '2023',
      color: '白色',
      engineNumber: 'TEST123456',
      chassisNumber: 'CHASSIS123456',
      description: '测试车辆'
    };

    const addResult = await addUserVehicle(testUserId, newVehicleData);
    console.log('✅ 添加车辆API响应状态:', addResult.status);
    console.log('🚗 新增车辆ID:', addResult.data.vehicleId);
    console.log('🚗 新增车辆信息:', {
      licensePlate: addResult.data.licensePlate,
      brand: addResult.data.brand,
      status: addResult.data.status
    });

    const newVehicleId = addResult.data.vehicleId;

    // 测试更新车辆信息
    console.log('\n=== 测试更新车辆信息 ===');
    const updateData = {
      description: '更新后的测试车辆',
      mileage: 5000
    };

    const updateResult = await updateMobileVehicle(newVehicleId, updateData);
    console.log('✅ 更新车辆API响应状态:', updateResult.status);
    console.log('🚗 更新后车辆信息:', {
      vehicleId: updateResult.data.vehicleId,
      description: updateResult.data.description,
      mileage: updateResult.data.mileage
    });

    // 测试删除车辆
    console.log('\n=== 测试删除车辆 ===');
    const deleteResult = await deleteMobileVehicle(newVehicleId);
    console.log('✅ 删除车辆API响应状态:', deleteResult.status);
    console.log('🗑️ 删除结果:', deleteResult.data);

    console.log('\n✅ 用户车辆API测试完成');

  } catch (error) {
    console.error('❌ 用户车辆API测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

/**
 * 测试车辆图片相关接口
 */
async function testVehicleImageAPI() {
  console.log('\n🚗 开始测试车辆图片API...');

  try {
    // 获取一个车辆ID进行测试
    const vehicleList = await getMobileVehicles({ page: 1, size: 1 });
    if (vehicleList.data.content.length === 0) {
      console.log('⚠️ 没有可用的车辆数据，跳过图片测试');
      return;
    }

    const vehicleId = vehicleList.data.content[0].vehicleId;

    // 测试获取车辆图片列表
    console.log('\n=== 测试获取车辆图片列表 ===');
    const imagesResult = await getVehicleImages(vehicleId);
    console.log('✅ 获取图片API响应状态:', imagesResult.status);
    console.log('🖼️ 图片数量:', imagesResult.data.length);

    // 测试上传车辆图片（使用模拟数据）
    console.log('\n=== 测试上传车辆图片 ===');
    const formData = new FormData();
    // 注意：这里只是模拟，实际测试需要真实的图片文件
    // formData.append('image', imageFile);

    console.log('⚠️ 图片上传测试跳过（需要真实图片文件）');

    console.log('\n✅ 车辆图片API测试完成');

  } catch (error) {
    console.error('❌ 车辆图片API测试失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

/**
 * 主测试执行函数
 */
async function runTests() {
  console.log('🧪 开始运行车辆API完整测试套件...\n');

  try {
    // 加载API模块
    const api = await loadVehicleAPI();

    // 绑定API函数到全局作用域以供测试函数使用
    global.getMobileVehicles = api.getMobileVehicles;
    global.getMobileVehicleById = api.getMobileVehicleById;
    global.getUserVehicles = api.getUserVehicles;
    global.addUserVehicle = api.addUserVehicle;
    global.updateMobileVehicle = api.updateMobileVehicle;
    global.deleteMobileVehicle = api.deleteMobileVehicle;
    global.uploadVehicleImages = api.uploadVehicleImages;
    global.getVehicleImages = api.getVehicleImages;
    global.getVehicleBrands = api.getVehicleBrands;
    global.getVehicleModels = api.getVehicleModels;
    global.getVehicleTypes = api.getVehicleTypes;

    // 执行所有测试
    await testVehicleListAPI();
    await testVehicleDetailAPI();
    await testVehicleMetaAPI();
    await testUserVehicleAPI();
    await testVehicleImageAPI();

    console.log('\n🎉 所有车辆API测试完成！');

  } catch (error) {
    console.error('❌ 测试执行失败:', error.message);
    console.error('🔍 错误详情:', error);
  }
}

// 导出测试函数供单独调用
export {
  testVehicleListAPI,
  testVehicleDetailAPI,
  testVehicleMetaAPI,
  testUserVehicleAPI,
  testVehicleImageAPI,
  runTests
};

// 如果直接运行此文件，则执行所有测试
if (typeof window === 'undefined') {
  // Node.js环境
  runTests().catch(console.error);
} else {
  // 浏览器环境，暴露到全局
  window.testVehicleAPIs = {
    testVehicleListAPI,
    testVehicleDetailAPI,
    testVehicleMetaAPI,
    testUserVehicleAPI,
    testVehicleImageAPI,
    runTests
  };
}
