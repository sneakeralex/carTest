/**
 * 预约API测试脚本
 * 直接测试预约API端点
 */

import fetch from 'node-fetch';

console.log('📅 预约API测试开始...\n');

// 测试服务器配置
const baseUrl = 'https://cartest.douwifi.cn/artemis';

// CAS登录配置
const casBaseUrl = baseUrl; // 使用相同的baseUrl

console.log('📅 预约API测试开始...\n');

// 测试0: CAS登录
console.log('🔐 测试0: CAS登录');
console.log(`URL: ${casBaseUrl}/v1/tgt/login?userCode=admin&service=https://172.16.229.88&language=zh_CN`);
console.log(`Method: GET\n`);

let token = null;
try {
  const loginResponse = await fetch(`${casBaseUrl}/v1/tgt/login?userCode=admin&service=https://172.16.229.88&language=zh_CN`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity'
    }
  });

  console.log(`响应状态: ${loginResponse.status} ${loginResponse.statusText}`);

  if (!loginResponse.ok) {
    throw new Error(`HTTP error! status: ${loginResponse.status}`);
  }

  const loginResult = await loginResponse.json();
  console.log('CAS登录响应:');
  console.log(JSON.stringify(loginResult, null, 2));
  
  // 假设响应中包含token
  token = loginResult.token || loginResult.tgt || loginResult.ticket || loginResult.data?.token || loginResult.data?.tgt;
  if (token) {
    console.log('✅ CAS登录成功，获取token:', token, '\n');
  } else {
    console.log('⚠️ CAS登录成功但未获取token\n');
  }

} catch (error) {
  console.log('❌ CAS登录失败:', error.message, '\n');
}

// 如果有token，获取用户信息
if (token) {
  console.log('👤 测试0.1: 获取用户信息');
  console.log(`URL: ${baseUrl}/api/manage/auth/v2/manage/userService/getUserInfo`);
  console.log(`Method: GET`);
  console.log(`Authorization: Bearer ${token}\n`);

  try {
    const userResponse = await fetch(`${baseUrl}/api/manage/auth/v2/manage/userService/getUserInfo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log(`响应状态: ${userResponse.status} ${userResponse.statusText}`);

    if (!userResponse.ok) {
      throw new Error(`HTTP error! status: ${userResponse.status}`);
    }

    const userResult = await userResponse.json();
    console.log('用户信息响应:');
    console.log(JSON.stringify(userResult, null, 2));
    console.log('✅ 获取用户信息成功\n');

  } catch (error) {
    console.log('❌ 获取用户信息失败:', error.message, '\n');
  }
}

// 测试参数
const testBookingData = {
  userId: "1848526399914856451", // 登录用户id
  vin: "1HGCM82633A123456", // 通过选取的测试车辆获取
  bookingNo: "BK-2023-1002", // 通过预约号接口获取
  projectNo: "DQ-GP-20250109001", // 通过选择获取
  provingGroundId: "3", // 通过菜单选择
  groundId: "1", // 通过接口获取
  testTypeId: "1", // 通过菜单选择
  testContent: "耐久性测试", // 用户填写
  bookingDate: "2025-12-25", // 更新为未来日期
  startTime: "09:00", // 用户从菜单选择
  endTime: "17:30", // 用户从菜单选择
  driverId: "1879417897919291394", // 用户选择司机后获取
  isExclusive: 1, // 用户填写
  billingType: "1", // 用户填写
  auxiliaryVehicleCount: 2, // 用户填写
  participantCount: 5, // 用户填写
  imagingRequirement: "0", // 用户填写
  remark: "需提前检查场地排水系统" // 用户填写
};

const testUpdateData = {
  notes: '更新后的测试预约'
};

const testApproveData = {
  approvedBy: 'admin',
  approvalNotes: '审批通过'
};

const testRescheduleData = {
  startTime: '2025-12-22T14:00:00Z',
  endTime: '2025-12-22T16:00:00Z'
};

// 测试1: 获取预约列表
console.log('📋 测试1: 获取预约列表');
console.log(`URL: ${baseUrl}/api/v1/booking/list/admin`);
console.log(`Method: GET\n`);

try {
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/api/v1/booking/list/admin`, {
    method: 'GET',
    headers
  });

  console.log(`响应状态: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('API响应:');
  console.log(JSON.stringify(result, null, 2));
  console.log('✅ 获取预约列表成功\n');

} catch (error) {
  console.log('❌ 获取预约列表失败:', error.message, '\n');
}

// 测试2: 创建预约
console.log('📝 测试2: 创建预约');
console.log(`URL: ${baseUrl}/api/v1/booking/add`);
console.log(`Method: POST`);
console.log(`Body: ${JSON.stringify(testBookingData, null, 2)}\n`);

try {
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/api/v1/booking/add`, {
    method: 'POST',
    headers,
    body: JSON.stringify(testBookingData)
  });

  console.log(`响应状态: ${response.status} ${response.statusText}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  console.log('API响应:');
  console.log(JSON.stringify(result, null, 2));
  console.log('✅ 创建预约成功\n');

  // 保存创建的预约ID用于后续测试
  const bookingId = result.data?.id || result.data?.bookingId || result.id || result.bookingId;
  if (bookingId) {
    console.log('📌 创建的预约ID:', bookingId);

    // 测试3: 获取预约详情
    console.log('\n📄 测试3: 获取预约详情');
    console.log(`URL: ${baseUrl}/api/v1/booking/${bookingId}`);
    console.log(`Method: GET\n`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const detailResponse = await fetch(`${baseUrl}/api/v1/booking/${bookingId}`, {
        method: 'GET',
        headers
      });

      console.log(`响应状态: ${detailResponse.status} ${detailResponse.statusText}`);

      if (!detailResponse.ok) {
        throw new Error(`HTTP error! status: ${detailResponse.status}`);
      }

      const detailResult = await detailResponse.json();
      console.log('API响应:');
      console.log(JSON.stringify(detailResult, null, 2));
      console.log('✅ 获取预约详情成功\n');

    } catch (error) {
      console.log('❌ 获取预约详情失败:', error.message, '\n');
    }

    // 测试4: 更新预约
    console.log('✏️ 测试4: 更新预约');
    console.log(`URL: ${baseUrl}/api/v1/booking/${bookingId}`);
    console.log(`Method: PUT`);
    console.log(`Body: ${JSON.stringify(testUpdateData, null, 2)}\n`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const updateResponse = await fetch(`${baseUrl}/api/v1/booking/${bookingId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(testUpdateData)
      });

      console.log(`响应状态: ${updateResponse.status} ${updateResponse.statusText}`);

      if (!updateResponse.ok) {
        throw new Error(`HTTP error! status: ${updateResponse.status}`);
      }

      const updateResult = await updateResponse.json();
      console.log('API响应:');
      console.log(JSON.stringify(updateResult, null, 2));
      console.log('✅ 更新预约成功\n');

    } catch (error) {
      console.log('❌ 更新预约失败:', error.message, '\n');
    }

    // 测试5: 审批预约
    console.log('✅ 测试5: 审批预约');
    console.log(`URL: ${baseUrl}/api/v1/booking/${bookingId}/approve`);
    console.log(`Method: POST`);
    console.log(`Body: ${JSON.stringify(testApproveData, null, 2)}\n`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const approveResponse = await fetch(`${baseUrl}/api/v1/booking/${bookingId}/approve`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testApproveData)
      });

      console.log(`响应状态: ${approveResponse.status} ${approveResponse.statusText}`);

      if (!approveResponse.ok) {
        throw new Error(`HTTP error! status: ${approveResponse.status}`);
      }

      const approveResult = await approveResponse.json();
      console.log('API响应:');
      console.log(JSON.stringify(approveResult, null, 2));
      console.log('✅ 审批预约成功\n');

    } catch (error) {
      console.log('❌ 审批预约失败:', error.message, '\n');
    }

    // 测试6: 改期预约
    console.log('🔄 测试6: 改期预约');
    console.log(`URL: ${baseUrl}/api/v1/booking/${bookingId}/reschedule`);
    console.log(`Method: POST`);
    console.log(`Body: ${JSON.stringify(testRescheduleData, null, 2)}\n`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const rescheduleResponse = await fetch(`${baseUrl}/api/v1/booking/${bookingId}/reschedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testRescheduleData)
      });

      console.log(`响应状态: ${rescheduleResponse.status} ${rescheduleResponse.statusText}`);

      if (!rescheduleResponse.ok) {
        throw new Error(`HTTP error! status: ${rescheduleResponse.status}`);
      }

      const rescheduleResult = await rescheduleResponse.json();
      console.log('API响应:');
      console.log(JSON.stringify(rescheduleResult, null, 2));
      console.log('✅ 改期预约成功\n');

    } catch (error) {
      console.log('❌ 改期预约失败:', error.message, '\n');
    }

    // 测试7: 取消预约
    console.log('❌ 测试7: 取消预约');
    console.log(`URL: ${baseUrl}/api/v1/booking/${bookingId}/cancel`);
    console.log(`Method: POST\n`);

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'identity'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const cancelResponse = await fetch(`${baseUrl}/api/v1/booking/${bookingId}/cancel`, {
        method: 'POST',
        headers
      });

      console.log(`响应状态: ${cancelResponse.status} ${cancelResponse.statusText}`);

      if (!cancelResponse.ok) {
        throw new Error(`HTTP error! status: ${cancelResponse.status}`);
      }

      const cancelResult = await cancelResponse.json();
      console.log('API响应:');
      console.log(JSON.stringify(cancelResult, null, 2));
      console.log('✅ 取消预约成功\n');

    } catch (error) {
      console.log('❌ 取消预约失败:', error.message, '\n');
    }
  } else {
    console.log('⚠️ 无法获取预约ID，跳过后续测试\n');
  }
} catch (error) {
  console.log('❌ 创建预约失败:', error.message, '\n');
}

// 测试8: 获取可用时间段
console.log('🕒 测试8: 获取可用时间段');
console.log(`URL: ${baseUrl}/api/v1/booking/available-slots?date=2025-12-22`);
console.log(`Method: GET\n`);

try {
  const headers = {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'identity'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const slotsResponse = await fetch(`${baseUrl}/api/v1/booking/available-slots?date=2025-12-22`, {
    method: 'GET',
    headers
  });

  console.log(`响应状态: ${slotsResponse.status} ${slotsResponse.statusText}`);

  if (!slotsResponse.ok) {
    throw new Error(`HTTP error! status: ${slotsResponse.status}`);
  }

  const slotsResult = await slotsResponse.json();
  console.log('API响应:');
  console.log(JSON.stringify(slotsResult, null, 2));
  console.log('✅ 获取可用时间段成功\n');

} catch (error) {
  console.log('❌ 获取可用时间段失败:', error.message, '\n');
}

console.log('📅 预约API测试完成');
