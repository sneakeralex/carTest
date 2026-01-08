// No mock appointments — frontend will render empty state when backend has no appointments.
export const mockAppointments = [];

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
