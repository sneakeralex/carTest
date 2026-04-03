import { mockTestTasks } from './testTask.js';

// 预约状态
export const BOOKING_STATUS = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
  RESCHEDULED: '已改期'
};

// No mock bookings — frontend will render empty state when backend has no bookings.
export const mockBookings = [];

// 生成可用时间段
export function generateAvailableTimeSlots(date) {
  const slots = [];
  const startHour = 9; // 早上9点开始
  const endHour = 17; // 下午5点结束
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push({
      startTime: `${String(hour).padStart(2, '0')}:00`,
      endTime: `${String(hour + 1).padStart(2, '0')}:00`,
      available: Math.random() > 0.3 // 70%的概率可用
    });
  }
  
  return slots;
}

// generateRandomBooking removed — mock bookings no longer include generated vehicle data.

// 检查时间段是否可用
export function checkTimeSlotAvailability(testSiteId, date, period) {
  // 检查是否有冲突的预约
  const hasConflict = mockBookings.some(booking =>
    booking.testSiteId === testSiteId &&
    booking.date === date &&
    booking.period === period &&
    booking.status !== 'CANCELLED'
  );
  
  return !hasConflict;
}
