// 测试试验任务和统计相关接口

// 动态导入模块，处理可能的模块加载问题
const loadModules = async () => {
  try {
    // 导入试验任务相关API
    const testTaskModule = await import('../src/api/testTask.js');
    const { 
      getTestTasks, getTestTaskById, getTestRegistrations, getTestRegistrationById, 
      createTestRegistration, updateTestRegistration, cancelTestRegistration, 
      scheduleTest, completeTest, getUserTestRegistrations, getTaskRegistrations, 
      getTestStats, createTestTask,
      getExperimentTasks, getExperimentTaskById, createExperimentTask, 
      updateExperimentTask, deleteExperimentTask, submitExperimentTaskForApproval, 
      approveExperimentTask, startExperimentTask, completeExperimentTask, cancelExperimentTask 
    } = testTaskModule;
    
    // 导入统计相关API
    const dashboardModule = await import('../src/api/dashboard.js');
    const { getEquipmentStats, getTestTaskStats, getStaffStats, getBookingStats, getAlertStats, getSystemStats } = dashboardModule;
    
    return {
      getTestTasks, getTestTaskById, getTestRegistrations, getTestRegistrationById, 
      createTestRegistration, updateTestRegistration, cancelTestRegistration, 
      scheduleTest, completeTest, getUserTestRegistrations, getTaskRegistrations, 
      getTestStats, createTestTask,
      getExperimentTasks, getExperimentTaskById, createExperimentTask, 
      updateExperimentTask, deleteExperimentTask, submitExperimentTaskForApproval, 
      approveExperimentTask, startExperimentTask, completeExperimentTask, cancelExperimentTask,
      getEquipmentStats, getTestTaskStats, getStaffStats, getBookingStats, getAlertStats, getSystemStats
    };
  } catch (error) {
    console.error('加载模块失败:', error);
    throw error;
  }
};

// 测试试验任务相关接口
const testExperimentTasks = async (api) => {
  console.log('=== 开始测试试验任务相关接口 ===');
  
  try {
    // 1. 获取试验任务列表
    console.log('1. 测试获取试验任务列表');
    const tasksResponse = await api.getExperimentTasks({ page: 0, size: 10 });
    console.log('试验任务列表:', JSON.stringify(tasksResponse.data, null, 2));
    
    // 2. 获取试验任务详情
    if (tasksResponse.data.content && tasksResponse.data.content.length > 0) {
      const taskId = tasksResponse.data.content[0].taskId || tasksResponse.data.content[0].id;
      console.log('\n2. 测试获取试验任务详情');
      const taskDetailResponse = await api.getExperimentTaskById(taskId);
      console.log('试验任务详情:', JSON.stringify(taskDetailResponse.data, null, 2));
      
      // 3. 测试更新试验任务
      console.log('\n3. 测试更新试验任务');
      try {
        const updateResponse = await api.updateExperimentTask(taskId, {
          taskName: 'Updated Test Task',
          description: 'Updated task description'
        });
        console.log('更新试验任务结果:', JSON.stringify(updateResponse.data, null, 2));
      } catch (error) {
        console.log('更新试验任务可能需要权限，跳过测试:', error.message);
      }
      
      // 4. 测试其他操作（可选）
      console.log('\n4. 测试试验任务操作接口');
      try {
        // 注意：这些操作可能需要权限或特定条件，谨慎执行
        console.log('测试提交试验任务审核');
        const submitResponse = await api.submitExperimentTaskForApproval(taskId);
        console.log('提交审核结果:', JSON.stringify(submitResponse.data, null, 2));
      } catch (error) {
        console.log('提交审核可能需要权限，跳过测试:', error.message);
      }
    } else {
      console.log('\n2. 暂无试验任务数据，跳过详情测试');
    }
    
    // 5. 测试创建试验任务
    console.log('\n5. 测试创建试验任务');
    try {
      const createResponse = await api.createExperimentTask({
        taskName: 'Test Experiment Task',
        description: 'Test task description',
        testType: 'PERFORMANCE',
        experimentType: 'DYNAMIC',
        department: 'Engineering',
        difficulty: 'MEDIUM',
        estimatedDuration: 120,
        testSite: 'Test Site A'
      });
      console.log('创建试验任务结果:', JSON.stringify(createResponse.data, null, 2));
    } catch (error) {
      console.log('创建试验任务可能需要权限，跳过测试:', error.message);
    }
    
  } catch (error) {
    console.error('测试试验任务接口失败:', error);
  }
  
  console.log('=== 试验任务相关接口测试结束 ===\n');
};

// 测试测试任务相关接口
const testTestTasks = async (api) => {
  console.log('=== 开始测试测试任务相关接口 ===');
  
  try {
    // 1. 获取测试任务列表
    console.log('1. 测试获取测试任务列表');
    const tasksResponse = await api.getTestTasks({ page: 0, size: 10 });
    console.log('测试任务列表:', JSON.stringify(tasksResponse.data, null, 2));
    
    // 2. 获取测试任务详情
    if (tasksResponse.data.content && tasksResponse.data.content.length > 0) {
      const taskId = tasksResponse.data.content[0].taskId || tasksResponse.data.content[0].id;
      console.log('\n2. 测试获取测试任务详情');
      const taskDetailResponse = await api.getTestTaskById(taskId);
      console.log('测试任务详情:', JSON.stringify(taskDetailResponse.data, null, 2));
    } else {
      console.log('\n2. 暂无测试任务数据，跳过详情测试');
    }
    
    // 3. 获取测试报名列表
    console.log('\n3. 测试获取测试报名列表');
    const registrationsResponse = await api.getTestRegistrations({ page: 0, size: 10 });
    console.log('测试报名列表:', JSON.stringify(registrationsResponse.data, null, 2));
    
    // 4. 获取测试统计信息
    console.log('\n4. 测试获取测试统计信息');
    const statsResponse = await api.getTestStats();
    console.log('测试统计信息:', JSON.stringify(statsResponse.data, null, 2));
    
  } catch (error) {
    console.error('测试测试任务接口失败:', error);
  }
  
  console.log('=== 测试任务相关接口测试结束 ===\n');
};

// 测试统计相关接口
const testStatsApis = async (api) => {
  console.log('=== 开始测试统计相关接口 ===');
  
  try {
    // 1. 获取设备统计
    console.log('1. 测试获取设备统计');
    const equipmentStats = await api.getEquipmentStats();
    console.log('设备统计:', JSON.stringify(equipmentStats.data, null, 2));
    
    // 2. 获取测试任务统计
    console.log('\n2. 测试获取测试任务统计');
    const testTaskStats = await api.getTestTaskStats();
    console.log('测试任务统计:', JSON.stringify(testTaskStats.data, null, 2));
    
    // 3. 获取人员统计
    console.log('\n3. 测试获取人员统计');
    const staffStats = await api.getStaffStats();
    console.log('人员统计:', JSON.stringify(staffStats.data, null, 2));
    
    // 4. 获取预约统计
    console.log('\n4. 测试获取预约统计');
    const bookingStats = await api.getBookingStats();
    console.log('预约统计:', JSON.stringify(bookingStats.data, null, 2));
    
    // 5. 获取告警统计
    console.log('\n5. 测试获取告警统计');
    const alertStats = await api.getAlertStats();
    console.log('告警统计:', JSON.stringify(alertStats.data, null, 2));
    
    // 6. 获取系统统计
    console.log('\n6. 测试获取系统统计');
    const systemStats = await api.getSystemStats();
    console.log('系统统计:', JSON.stringify(systemStats.data, null, 2));
    
  } catch (error) {
    console.error('测试统计接口失败:', error);
  }
  
  console.log('=== 统计相关接口测试结束 ===\n');
};

// 运行测试
const runTests = async () => {
  try {
    const api = await loadModules();
    await testTestTasks(api);
    await testExperimentTasks(api);
    await testStatsApis(api);
  } catch (error) {
    console.error('运行测试失败:', error);
  }
};

runTests().catch(console.error);