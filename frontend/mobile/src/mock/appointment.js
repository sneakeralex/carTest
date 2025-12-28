// 模拟维修保养预约数据
export const mockAppointments = [
  {
    appointmentId: '1',
    userId: '1',
    vehicleId: '1',
    serviceType: 'MAINTENANCE',
    appointmentTime: '2025-04-15T09:00:00Z',
    description: '年度常规保养',
    notes: '请检查机油和制动系统',
    status: 'PENDING',
    vehicle: {
      licensePlate: '沪A88888',
      brand: '特斯拉',
      model: 'Model 3'
    },
    createdAt: '2025-04-10T08:00:00Z',
    updatedAt: '2025-04-10T08:00:00Z'
  },
  {
    appointmentId: '2',
    userId: '1',
    vehicleId: '2',
    serviceType: 'REPAIR',
    appointmentTime: '2025-04-16T14:00:00Z',
    description: '更换制动片',
    notes: '制动时有异响',
    status: 'CONFIRMED',
    vehicle: {
      licensePlate: '京B99999',
      brand: '比亚迪',
      model: '汉'
    },
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-10T10:00:00Z'
  },
  {
    appointmentId: '3',
    userId: '1',
    vehicleId: '3',
    serviceType: 'INSPECTION',
    appointmentTime: '2025-04-18T10:00:00Z',
    description: '年检服务',
    notes: '请携带相关证件',
    status: 'PENDING',
    vehicle: {
      licensePlate: '沪C12345',
      brand: '小鹏',
      model: 'P7'
    },
    createdAt: '2025-04-10T11:00:00Z',
    updatedAt: '2025-04-10T11:00:00Z'
  },
  {
    appointmentId: '4',
    userId: '1',
    vehicleId: '4',
    serviceType: 'MODIFICATION',
    appointmentTime: '2025-04-20T13:30:00Z',
    description: '升级智能系统',
    notes: '请提前备份数据',
    status: 'CONFIRMED',
    vehicle: {
      licensePlate: '京D54321',
      brand: '理想',
      model: 'L9'
    },
    createdAt: '2025-04-10T12:00:00Z',
    updatedAt: '2025-04-10T12:00:00Z'
  },
  {
    appointmentId: '5',
    userId: '1',
    vehicleId: '5',
    serviceType: 'MAINTENANCE',
    appointmentTime: '2025-04-22T15:00:00Z',
    description: '轮胎更换',
    notes: '四轮均需更换',
    status: 'COMPLETED',
    vehicle: {
      licensePlate: '沪E67890',
      brand: '蔚来',
      model: 'ET7'
    },
    createdAt: '2025-04-10T13:00:00Z',
    updatedAt: '2025-04-10T14:00:00Z'
  }
];

// 服务类型枚举
export const SERVICE_TYPES = {
  MAINTENANCE: '常规保养',
  REPAIR: '维修服务',
  INSPECTION: '车辆检查',
  MODIFICATION: '改装服务'
};

// 预约状态枚举
export const APPOINTMENT_STATUS = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  COMPLETED: '已完成',
  CANCELLED: '已取消'
};
