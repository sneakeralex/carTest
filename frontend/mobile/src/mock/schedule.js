// 场地日程安排相关mock数据
import dayjs from 'dayjs';

// 生成指定日期的场地安排数据
export const generateDailySchedule = (date) => {
  const targetDate = dayjs(date);
  const today = dayjs();
  const tomorrow = today.add(1, 'day');
  
  // 今天的安排
  if (targetDate.isSame(today, 'day')) {
    return [
      {
        id: 1,
        testSiteId: 'TS001',
        testSiteName: '德清测试场A区',
        taskName: '车辆碰撞测试',
        timeSlot: '09:00-12:00',
        status: 'OCCUPIED',
        vehiclePlate: null,
        testType: 'CRASH_TEST',
        responsible: '张工程师',
        phone: '13812345678'
      },
      {
        id: 2,
        testSiteId: 'TS002',
        testSiteName: '德清测试场B区',
        taskName: '制动性能测试',
        timeSlot: '14:00-16:00',
        status: 'SCHEDULED',
        vehiclePlate: null,
        testType: 'BRAKE_TEST',
        responsible: '李工程师',
        phone: '13987654321'
      },
      {
        id: 3,
        testSiteId: 'TS003',
        testSiteName: '德清测试场C区',
        taskName: '环保测试',
        timeSlot: '16:30-17:30',
        status: 'AVAILABLE',
        vehiclePlate: null,
        testType: null,
        responsible: null,
        phone: null
      }
    ];
  }
  
  // 明天的安排
  if (targetDate.isSame(tomorrow, 'day')) {
    return [
      {
        id: 4,
        testSiteId: 'TS001',
        testSiteName: '德清测试场A区',
        taskName: '性能综合测试',
        timeSlot: '10:00-15:00',
        status: 'SCHEDULED',
        vehiclePlate: null,
        testType: 'PERFORMANCE_TEST',
        responsible: '王工程师',
        phone: '13765432109'
      },
      {
        id: 5,
        testSiteId: 'TS002',
        testSiteName: '深圳智能汽车测试基地B区',
        taskName: '自动驾驶测试',
        timeSlot: '09:00-11:00',
        status: 'AVAILABLE',
        vehiclePlate: null,
        testType: null,
        responsible: null,
        phone: null
      },
      {
        id: 6,
        testSiteId: 'TS004',
        testSiteName: '北京亦庄新能源汽车测试中心',
        taskName: '电池安全测试',
        timeSlot: '13:00-18:00',
        status: 'SCHEDULED',
        vehiclePlate: null,
        testType: 'BATTERY_SAFETY',
        responsible: '陈工程师',
        phone: '13654321098'
      }
    ];
  }
  
  // 后天的安排
  if (targetDate.isSame(tomorrow.add(1, 'day'), 'day')) {
    return [
      {
        id: 7,
        testSiteId: 'TS003',
        testSiteName: '上海嘉定汽车城测试中心',
        taskName: '噪声测试',
        timeSlot: '09:30-12:30',
        status: 'SCHEDULED',
        vehiclePlate: null,
        testType: 'NOISE_TEST',
        responsible: '孙工程师',
        phone: '13432109876'
      },
      {
        id: 8,
        testSiteId: 'TS002',
        testSiteName: '德清测试场B区',
        taskName: '耐久性测试',
        timeSlot: '14:00-17:00',
        status: 'AVAILABLE',
        vehiclePlate: null,
        testType: null,
        responsible: null,
        phone: null
      }
    ];
  }
  
  // 其他日期的通用安排
  const weekday = targetDate.day(); // 0=周日, 1=周一, ..., 6=周六
  
  // 周末安排较少
  if (weekday === 0 || weekday === 6) {
    return [
      {
        id: 9,
        testSiteId: 'TS002',
        testSiteName: '德清测试场B区',
        taskName: '定期检测',
        timeSlot: '14:00-16:00',
        status: 'AVAILABLE',
        vehiclePlate: null,
        testType: 'ROUTINE_CHECK',
        responsible: null,
        phone: null
      }
    ];
  }
  
  // 工作日的标准安排
  return [
    {
      id: 10,
      testSiteId: 'TS001',
      testSiteName: '德清测试场A区',
      taskName: '车辆检验',
      timeSlot: '09:00-11:00',
      status: 'AVAILABLE',
      vehiclePlate: null,
      testType: 'INSPECTION',
      responsible: null,
      phone: null
    },
    {
      id: 11,
      testSiteId: 'TS002',
      testSiteName: '德清测试场B区',
      taskName: '性能测试',
      timeSlot: '13:00-16:00',
      status: 'AVAILABLE',
      vehiclePlate: null,
      testType: 'PERFORMANCE_TEST',
      responsible: null,
      phone: null
    }
  ];
};

// 场地状态映射
export const scheduleStatusMap = {
  'AVAILABLE': { text: '可预约', type: 'success', color: '#07c160' },
  'SCHEDULED': { text: '已安排', type: 'warning', color: '#ff976a' },
  'OCCUPIED': { text: '占用中', type: 'danger', color: '#ee0a24' },
  'MAINTENANCE': { text: '维护中', type: 'default', color: '#969799' }
};

// 测试类型映射
export const testTypeMap = {
  'CRASH_TEST': { text: '碰撞测试', icon: 'warning-o', color: '#ee0a24' },
  'BRAKE_TEST': { text: '制动测试', icon: 'stop-circle-o', color: '#ff976a' },
  'PERFORMANCE_TEST': { text: '性能测试', icon: 'speed-o', color: '#1989fa' },
  'EMISSION_TEST': { text: '排放测试', icon: 'leaf', color: '#07c160' },
  'NOISE_TEST': { text: '噪声测试', icon: 'volume-o', color: '#ff976a' },
  'BATTERY_SAFETY': { text: '电池安全', icon: 'lightning', color: '#ff976a' },
  'AUTONOMOUS_DRIVING': { text: '自动驾驶', icon: 'guide-o', color: '#1989fa' },
  'INSPECTION': { text: '车辆检验', icon: 'checked', color: '#07c160' },
  'ROUTINE_CHECK': { text: '定期检测', icon: 'clock-o', color: '#969799' }
};

// 获取场地空闲时间段
export const getAvailableTimeSlots = (date, siteId) => {
  const schedule = generateDailySchedule(date);
  const siteSchedule = schedule.filter(item => item.testSiteId === siteId);
  
  // 标准时间段
  const standardSlots = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
    '17:00-18:00'
  ];
  
  // 过滤掉已占用的时间段
  const occupiedSlots = siteSchedule
    .filter(item => item.status === 'OCCUPIED' || item.status === 'SCHEDULED')
    .map(item => item.timeSlot);
  
  return standardSlots.filter(slot => !occupiedSlots.includes(slot));
};

// 场地使用统计
export const generateSiteStatistics = (date) => {
  const schedule = generateDailySchedule(date);
  const stats = {
    total: 0,
    occupied: 0,
    scheduled: 0,
    available: 0,
    maintenance: 0
  };
  
  schedule.forEach(item => {
    stats.total++;
    stats[item.status.toLowerCase()]++;
  });
  
  return {
    ...stats,
    utilizationRate: ((stats.occupied + stats.scheduled) / stats.total * 100).toFixed(1)
  };
};
