import { 
  getAppointments,
  getAppointmentById,
  createAppointment
} from '../src/api/appointment.js';
import { SERVICE_TYPES, APPOINTMENT_STATUS } from '../src/mock/appointment.js';

async function testAppointmentApi() {
  try {
    console.log('1. 可用的服务类型');
    console.log('服务类型列表:', SERVICE_TYPES);
    console.log('预约状态列表:', APPOINTMENT_STATUS);

    console.log('\n2. 测试创建预约');
    const appointmentData = {
      vehicleId: '1',
      serviceType: 'MAINTENANCE',
      appointmentTime: '2025-09-15T14:00:00Z',
      description: '常规保养',
      notes: '请准备好保养配件'
    };
    const createResponse = await createAppointment(appointmentData);
    console.log('创建预约响应:', JSON.stringify(createResponse.data, null, 2));

    console.log('\n3. 测试获取预约列表');
    const appointmentsResponse = await getAppointments();
    console.log('预约列表:', JSON.stringify(appointmentsResponse.data, null, 2));

    console.log('\n4. 测试获取预约详情');
    const appointmentId = createResponse.data.appointmentId;
    const detailResponse = await getAppointmentById(appointmentId);
    console.log('预约详情:', JSON.stringify(detailResponse.data, null, 2));

    console.log('\n5. 测试根据状态筛选预约');
    const pendingAppointments = await getAppointments({ status: 'PENDING' });
    console.log('待处理预约:', JSON.stringify(pendingAppointments.data, null, 2));

    console.log('\n6. 测试根据服务类型筛选预约');
    const maintenanceAppointments = await getAppointments({ serviceType: 'MAINTENANCE' });
    console.log('保养预约:', JSON.stringify(maintenanceAppointments.data, null, 2));

  } catch (err) {
    console.error('测试失败:', err);
  }
}

// 运行测试
testAppointmentApi();