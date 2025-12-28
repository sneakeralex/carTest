// Mock localStorage for Node.js environment
global.localStorage = {
  data: {
    'user': JSON.stringify({ username: 'admin', id: 1 }),
    'token': 'mock-token'
  },
  getItem: function(key) {
    return this.data[key] || null;
  },
  setItem: function(key, value) {
    this.data[key] = value;
  },
  removeItem: function(key) {
    delete this.data[key];
  }
};

// filepath: /Users/yhan/workspace/carTest/frontend/mobile/test/testRealApis.mjs
// import { register, login, getUserInfo, changePassword } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/auth.js';
import { getMobileVehicles, getMobileVehicleById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/vehicle.js';
import { getEquipments, getEquipmentById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/equipment.js';
import { getContracts, getContractById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/contract.js';
import { getMaintenanceRecords, getMaintenanceById } from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/maintenance.js';

async function testRealApis() {
  console.log('=== 开始测试真实API ===\n');

  try {
    // 1. 测试认证API
    console.log('1. 测试认证API');

    // 注册测试
    console.log('   - 测试用户注册...');
    // const registerData = {
    //   username: 'testuser_' + Date.now(),
    //   password: 'Test123456',
    //   email: 'test@example.com',
    //   phone: '13800138000'
    // };
    // const registerResult = await register(registerData);
    // console.log('   注册结果:', registerResult.data ? '成功' : '失败');

    // // 登录测试
    // console.log('   - 测试用户登录...');
    // const loginData = {
    //   username: registerData.username,
    //   password: registerData.password
    // };
    // const loginResult = await login(loginData);
    // console.log('   登录结果:', loginResult.data ? '成功' : '失败');

    // 获取用户信息测试
    // console.log('   - 测试获取用户信息...');
    // const userInfoResult = await getUserInfo();
    // console.log('   获取用户信息结果:', userInfoResult.data ? '成功' : '失败');

    console.log('认证API测试跳过 (localStorage问题)\n');

    // 2. 测试车辆API
    console.log('2. 测试车辆API');

    console.log('   - 测试获取车辆列表...');
    const vehiclesResult = await getMobileVehicles();
    console.log('   车辆列表结果:', vehiclesResult.data?.content?.length || 0, '辆车');

    if (vehiclesResult.data?.content?.length > 0) {
      const firstVehicleId = vehiclesResult.data.content[0].vehicleId;
      console.log('   - 测试获取车辆详情 (ID:', firstVehicleId, ')...');
      const vehicleDetailResult = await getMobileVehicleById(firstVehicleId);
      console.log('   车辆详情结果:', vehicleDetailResult.data ? '成功' : '失败');
    }

    console.log('车辆API测试完成\n');

    // 3. 测试设备API
    console.log('3. 测试设备API');

    console.log('   - 测试获取设备列表...');
    const equipmentsResult = await getEquipments({ page: 1, size: 10 });
    console.log('   设备列表结果:', equipmentsResult.data?.content?.length || 0, '个设备');

    if (equipmentsResult.data?.content?.length > 0) {
      const firstEquipmentId = equipmentsResult.data.content[0].equipmentId;
      console.log('   - 测试获取设备详情 (ID:', firstEquipmentId, ')...');
      const equipmentDetailResult = await getEquipmentById(firstEquipmentId);
      console.log('   设备详情结果:', equipmentDetailResult.data ? '成功' : '失败');
    }

    console.log('设备API测试完成\n');

    // 4. 测试合同API
    console.log('4. 测试合同API');

    console.log('   - 测试获取合同列表...');
    const contractsResult = await getContracts();
    console.log('   合同列表结果:', contractsResult.data?.content?.length || 0, '个合同');

    if (contractsResult.data?.content?.length > 0) {
      const firstContractId = contractsResult.data.content[0].id;
      console.log('   - 测试获取合同详情 (ID:', firstContractId, ')...');
      const contractDetailResult = await getContractById(firstContractId);
      console.log('   合同详情结果:', contractDetailResult.data ? '成功' : '失败');
    }

    console.log('合同API测试完成\n');

    // 5. 测试维护API
    console.log('5. 测试维护API');

    console.log('   - 测试获取维护记录列表...');
    const maintenanceResult = await getMaintenanceRecords();
    console.log('   维护记录列表结果:', maintenanceResult.data?.records?.length || 0, '条记录');

    if (maintenanceResult.data?.records?.length > 0) {
      const firstMaintenanceId = maintenanceResult.data.records[0].id;
      console.log('   - 测试获取维护详情 (ID:', firstMaintenanceId, ')...');
      const maintenanceDetailResult = await getMaintenanceById(firstMaintenanceId);
      console.log('   维护详情结果:', maintenanceDetailResult.data ? '成功' : '失败');
    }

    console.log('维护API测试完成\n');

    console.log('=== 所有真实API测试完成 ===');

  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行测试
testRealApis();
