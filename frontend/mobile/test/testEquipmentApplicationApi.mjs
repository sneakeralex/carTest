import {
  getEquipmentApplications,
  getEquipmentApplicationById,
  applyEquipment,
  updateApplicationStatus,
  approveEquipmentRequest,
  cancelEquipmentRequest
} from '/Users/yhan/workspace/carTest/frontend/mobile/src/api/equipment.js';

async function testEquipmentApplicationApi() {
  try {
    console.log('测试设备申请列表 API');
    const params = { page: 1, size: 10 };
    const response = await getEquipmentApplications(params);
    console.log('设备申请列表响应:', JSON.stringify(response, null, 2));

    // 如果有申请记录，测试详情
    if (response.data.content && response.data.content.length > 0) {
      const firstApplicationId = response.data.content[0].applicationId;
      console.log('\n测试获取设备申请详情 API, applicationId:', firstApplicationId);
      const detailResponse = await getEquipmentApplicationById(firstApplicationId);
      console.log('设备申请详情响应:', JSON.stringify(detailResponse, null, 2));
    } else {
      console.log('\n没有申请记录，跳过详情测试');
    }

    // 测试提交新申请
    console.log('\n测试提交设备申请 API');
    const applyData = {
      equipmentId: '1',
      equipmentName: '压力测试仪',
      equipmentNo: 'EQAB1234',
      applicantId: '1',
      applicantName: '张三',
      applyType: 'BORROW',
      expectedStartTime: '2024-12-25 09:00:00',
      expectedEndTime: '2024-12-25 17:00:00',
      purpose: '测试设备申请功能'
    };
    const applyResponse = await applyEquipment(applyData);
    console.log('提交设备申请响应:', JSON.stringify(applyResponse, null, 2));

    // 如果创建成功，测试审批
    if (applyResponse.data && applyResponse.data.applicationId) {
      const newApplicationId = applyResponse.data.applicationId;
      console.log('\n测试审批设备申请 API, applicationId:', newApplicationId);
      const approveData = {
        approveRemarks: '同意申请，请按时归还'
      };
      const approveResponse = await approveEquipmentRequest(newApplicationId, approveData);
      console.log('审批设备申请响应:', JSON.stringify(approveResponse, null, 2));

      // 测试取消申请（如果还没审批）
      // 或者测试更新状态
      console.log('\n测试更新申请状态 API');
      const statusData = {
        status: 'COMPLETED'
      };
      const statusResponse = await updateApplicationStatus(newApplicationId, statusData);
      console.log('更新申请状态响应:', JSON.stringify(statusResponse, null, 2));
    }

    console.log('\n设备申请API测试完成！');
  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testEquipmentApplicationApi();
