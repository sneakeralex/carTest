import { getTestTasks, createTestRegistration, getTestRegistrationById, updateTestRegistration } from '../src/api/testTask.js';

async function runTests() {
  try {
    console.log('测试1: 获取测试任务列表');
    const tasksResult = await getTestTasks();
    console.log('任务列表:', JSON.stringify(tasksResult.data, null, 2));

    console.log('\n测试2: 创建测试报名');
    const newRegistration = await createTestRegistration({
      taskId: '1',
      userId: '123',
      notes: '测试报名'
    });
    console.log('新建报名:', JSON.stringify(newRegistration.data, null, 2));

    console.log('\n测试3: 获取报名详情');
    const registrationDetail = await getTestRegistrationById(newRegistration.data.registrationId);
    console.log('报名详情:', JSON.stringify(registrationDetail.data, null, 2));

    console.log('\n测试4: 更新报名状态');
    const updatedRegistration = await updateTestRegistration(registrationDetail.data.registrationId, {
      status: 'APPROVED'
    });
    console.log('更新后的报名:', JSON.stringify(updatedRegistration.data, null, 2));

  } catch (error) {
    console.error('测试出错:', error);
  }
}

runTests();
