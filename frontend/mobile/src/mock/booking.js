import { mockVehicles } from './vehicle.js';
import { generateId, randomDate, randomElement } from './utils.js';
import { mockTestTasks } from './testTask.js';
import dayjs from 'dayjs';

// 预约状态
export const BOOKING_STATUS = {
  PENDING: '待确认',
  CONFIRMED: '已确认',
  COMPLETED: '已完成',
  CANCELLED: '已取消',
  RESCHEDULED: '已改期'
};

// 模拟预约数据
export const mockBookings = [
  {
    id: generateId(),
    taskId: mockTestTasks.content[0].taskId,
    testSiteId: mockTestTasks.content[0].testSiteId,
    date: '2025-04-11',
    period: 'AM',
    startTime: '2025-04-11T09:00:00.000Z',
    endTime: '2025-04-11T12:00:00.000Z',
    vehicle: mockVehicles[0],
    vehicleId: mockVehicles[0].id,
    status: 'CONFIRMED',
    notes: '常规测试',
    createdAt: '2025-04-10T08:00:00.000Z',
    updatedAt: '2025-04-10T08:00:00.000Z',
    task: mockTestTasks.content[0]
  },
  {
    id: generateId(),
    taskId: mockTestTasks.content[1].taskId,
    testSiteId: mockTestTasks.content[1].testSiteId,
    date: '2025-04-12',
    period: 'PM',
    startTime: '2025-04-12T13:00:00.000Z',
    endTime: '2025-04-12T17:00:00.000Z',
    vehicle: mockVehicles[1],
    vehicleId: mockVehicles[1].id,
    status: 'PENDING',
    notes: '新车检测',
    createdAt: '2025-04-10T08:00:00.000Z',
    updatedAt: '2025-04-10T08:00:00.000Z',
    task: mockTestTasks.content[1]
  },
  {
    id: generateId(),
    taskId: 'TT003', // 测试任务 (性能测试)
    testSiteId: 'TS001', // 德清测试场A区
    date: '2025-04-09',
    period: 'AM', // 上午 (09:00-12:00)
    startTime: '2025-04-09T09:00:00.000Z',
    endTime: '2025-04-09T12:00:00.000Z',
    vehicle: mockVehicles[4], // 蔚来 ET7 (vehicleId: '5')
    vehicleId: '5',
    status: 'RESCHEDULED', // 待确认状态，因为天气不适合测试
    notes: '新增预约，天气预报情况不适合测试，如果实际小雨，则取消。\n原定4月13日上午，因天气原因改期至4月15日下午。',
    createdAt: '2025-04-08T16:30:00.000Z',
    updatedAt: '2025-04-08T16:30:00.000Z',
    task: mockTestTasks.content[2], // 对应 TT003 测试任务
    originalDate: '2025-04-13', // 原定日期
    originalPeriod: 'AM', // 原定时间段
    rescheduleReason: '天气不适宜测试',
    rescheduleTime: '2025-04-12T15:30:00.000Z',
    weatherCondition: {
      condition: '小雨',
      temperature: 18,
      windSpeed: 4,
      precipitation: 60,
      suitable: false
    }
  },
//   {
//     id: generateId(),
//     taskId: 'TT001', // 测试任务 (安全性测试)
//     testSiteId: 'TS002', // 德清测试场B区
//     date: '2025-04-15',
//     period: 'PM', // 下午 (13:00-17:00)
//     startTime: '2025-04-15T13:00:00.000Z',
//     endTime: '2025-04-15T17:00:00.000Z',
//     vehicle: mockVehicles[2], // 理想 ONE (vehicleId: '3')
//     vehicleId: '3',
//     status: 'RESCHEDULED', // 已改期状态
//     notes: '原定4月13日上午，因天气原因改期至4月15日下午。',
//     createdAt: '2025-04-12T10:00:00.000Z',
//     updatedAt: '2025-04-12T15:30:00.000Z',
//     task: mockTestTasks.content[0], // 对应 TT001 测试任务
//     originalDate: '2025-04-13', // 原定日期
//     originalPeriod: 'AM', // 原定时间段
//     rescheduleReason: '天气不适宜测试',
//     rescheduleTime: '2025-04-12T15:30:00.000Z'
//   }
];

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

// 生成随机预约
export function generateRandomBooking(data = {}) {
  const task = randomElement(mockTestTasks.content);
  const vehicle = randomElement(mockVehicles);
  const period = randomElement(['AM', 'PM']);
  const date = dayjs().format('YYYY-MM-DD');
  
  // 根据period生成对应的startTime和endTime
  const baseDate = dayjs(date);
  let startTime, endTime;
  
  if (period === 'AM') {
    startTime = baseDate.hour(9).minute(0).second(0).toISOString();
    endTime = baseDate.hour(12).minute(0).second(0).toISOString();
  } else {
    startTime = baseDate.hour(13).minute(0).second(0).toISOString();
    endTime = baseDate.hour(17).minute(0).second(0).toISOString();
  }
  
  return {
    id: generateId(),
    taskId: task.taskId,
    testSiteId: task.testSiteId,
    date,
    period,
    startTime,
    endTime,
    vehicle,
    vehicleId: vehicle.id,
    status: 'PENDING',
    notes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    task,
    ...data
  };
}

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
