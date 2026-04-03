// 模拟测试场数据
export const mockTestSites = [
  {
    siteId: 'TS001',
    siteName: '德清测试场A区',
    siteCode: 'DQTCA',
    address: '浙江省湖州市德清县测试大道1000号',
    location: {
      city: '湖州市',
      district: '德清县',
      longitude: 119.9667,
      latitude: 30.5433
    },
    capacity: {
      maxVehicles: 20,
      currentVehicles: 15,
      maxSimultaneousTests: 5
    },
    contacts: [
      {
        name: '王站长',
        title: '站点负责人',
        phone: '021-12345678',
        mobile: '13912345678',
        email: 'station.manager@shatc.com'
      },
      {
        name: '李工程师',
        title: '技术主管',
        phone: '021-12345679',
        mobile: '13912345679',
        email: 'tech.supervisor@shatc.com'
      }
    ],
    schedule: {
      operatingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      operatingHours: {
        start: '09:00',
        end: '17:00'
      },
      holidays: ['2025-04-01', '2025-04-05', '2025-04-29'],
      maintenanceDays: ['SUNDAY']
    },
    testCapabilities: {
      types: [
        {
          code: 'CRASH_TEST',
          name: '碰撞测试',
          maxSimultaneous: 1,
          equipment: ['碰撞测试墙', '高速摄像机', '假人']
        },
        {
          code: 'BRAKE_TEST',
          name: '制动测试',
          maxSimultaneous: 2,
          equipment: ['制动性能测试仪', '路面附着系数测试仪']
        },
        {
          code: 'PERFORMANCE_TEST',
          name: '性能测试',
          maxSimultaneous: 3,
          equipment: ['底盘测功机', '排放分析仪']
        }
      ],
      certifications: [
        {
          type: 'ISO',
          number: 'ISO9001:2025',
          validUntil: '2026-12-31'
        },
        {
          type: 'CNAS',
          number: 'CNAS-L1234',
          validUntil: '2026-12-31'
        }
      ]
    },
    facilities: [
      {
        name: '碰撞测试区',
        area: 10000,
        equipment: ['碰撞墙', '高速摄像机组', '数据采集系统'],
        status: 'OPERATIONAL'
      },
      {
        name: '制动测试跑道',
        area: 15000,
        equipment: ['制动性能测试系统', 'ABS测试设备'],
        status: 'OPERATIONAL'
      },
      {
        name: '噪声测试室',
        area: 5000,
        equipment: ['半消音室', '噪声测试系统'],
        status: 'MAINTENANCE'
      }
    ],
    status: 'AVAILABLE',
    currentTests: [
      {
        testId: 'TT001',
        testType: 'CRASH_TEST',
        startTime: '2025-04-11T09:00:00Z',
        endTime: '2025-04-11T12:00:00Z',
        facility: '碰撞测试区'
      }
    ],
    statistics: {
      totalTestsCompleted: 1250,
      totalTestsThisYear: 180,
      successRate: 0.98,
      utilizationRate: 0.85,
      averageTestDuration: 4.5
    },
    weather: {
      temperature: 25,
      humidity: 65,
      windSpeed: 3.5,
      precipitation: 0,
      updatedAt: '2025-04-11T08:00:00Z'
    },
    description: '德清智能汽车测试基地A区，提供全方位的汽车测试服务，配备先进的碰撞测试设备和性能测试跑道',
    totalArea: 50000,
    indoorArea: 20000,
    outdoorArea: 30000,
    images: [
      {
        url: 'https://example.com/dqtca1.jpg',
        description: '德清A区碰撞测试区全景',
        type: 'FACILITY'
      },
      {
        url: 'https://example.com/dqtca2.jpg',
        description: '德清A区制动测试跑道',
        type: 'FACILITY'
      }
    ],
    rating: {
      overall: 4.8,
      equipment: 4.9,
      service: 4.7,
      safety: 5.0
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-04-11T08:00:00Z'
  },
  {
    siteId: 'TS002',
    siteName: '深圳智能汽车测试基地B区',
    siteCode: 'SZITB',
    address: '广东省深圳市南山区科技园路2000号',
    location: {
      city: '深圳市',
      district: '南山区',
      longitude: 113.9547,
      latitude: 22.5485
    },
    capacity: {
      maxVehicles: 25,
      currentVehicles: 18,
      maxSimultaneousTests: 6
    },
    contacts: [
      {
        name: '张经理',
        title: '基地负责人',
        phone: '0755-12345678',
        mobile: '13812345678',
        email: 'manager@szatc.com'
      }
    ],
    schedule: {
      operatingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      operatingHours: {
        start: '08:30',
        end: '17:30'
      },
      holidays: ['2025-04-03', '2025-04-04', '2025-04-05'],
      maintenanceDays: ['SATURDAY']
    },
    testCapabilities: {
      types: [
        {
          code: 'AUTONOMOUS_DRIVING',
          name: '自动驾驶测试',
          maxSimultaneous: 2,
          equipment: ['高精度GPS', '激光雷达', '感知系统']
        },
        {
          code: 'PERFORMANCE_TEST',
          name: '性能测试',
          maxSimultaneous: 3,
          equipment: ['底盘测功机', '排放分析仪', '动力测试台']
        },
        {
          code: 'DURABILITY_TEST',
          name: '耐久性测试',
          maxSimultaneous: 2,
          equipment: ['四立柱试验台', '振动台', '环境仓']
        }
      ],
      certifications: [
        {
          type: 'ISO',
          number: 'ISO9001:2025',
          validUntil: '2026-12-31'
        }
      ]
    },
    facilities: [
      {
        name: '自动驾驶测试区',
        area: 20000,
        equipment: ['智能交通信号系统', '模拟道路环境', '5G通信基站'],
        status: 'OPERATIONAL'
      },
      {
        name: '新能源测试中心',
        area: 8000,
        equipment: ['充电桩测试设备', '电池测试系统', '电机测试台'],
        status: 'OPERATIONAL'
      }
    ],
    status: 'AVAILABLE',
    currentTests: [],
    statistics: {
      totalTestsCompleted: 980,
      totalTestsThisYear: 150,
      successRate: 0.96,
      utilizationRate: 0.82,
      averageTestDuration: 5.2
    },
    weather: {
      temperature: 28,
      humidity: 75,
      windSpeed: 2.8,
      precipitation: 0,
      updatedAt: '2025-04-11T08:00:00Z'
    },
    description: '深圳智能汽车测试基地B区，专注于新能源汽车和自动驾驶技术测试，配备业界领先的智能测试设备',
    totalArea: 60000,
    indoorArea: 25000,
    outdoorArea: 35000,
    images: [
      {
        url: 'https://example.com/szitb1.jpg',
        description: '深圳B区自动驾驶测试道路',
        type: 'FACILITY'
      }
    ],
    rating: {
      overall: 4.7,
      equipment: 4.8,
      service: 4.6,
      safety: 4.9
    },
    testTypes: ['自动驾驶测试', '新能源测试', '性能测试'],
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2025-04-11T08:00:00Z'
  },
  {
    siteId: 'TS003',
    siteName: '上海嘉定汽车城测试中心',
    siteCode: 'SJATC',
    address: '上海市嘉定区汽车城大道1800号',
    location: {
      city: '上海市',
      district: '嘉定区',
      longitude: 121.2633,
      latitude: 31.3806
    },
    capacity: {
      maxVehicles: 30,
      currentVehicles: 22,
      maxSimultaneousTests: 8
    },
    contacts: [
      {
        name: '陈主任',
        title: '测试中心主任',
        phone: '021-59123456',
        mobile: '13712345678',
        email: 'director@sjatc.com'
      }
    ],
    schedule: {
      operatingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
      operatingHours: {
        start: '08:00',
        end: '18:00'
      },
      holidays: ['2025-04-06', '2025-04-07', '2025-04-08'],
      maintenanceDays: ['SUNDAY']
    },
    testCapabilities: {
      types: [
        {
          code: 'CRASH_TEST',
          name: '碰撞安全测试',
          maxSimultaneous: 2,
          equipment: ['碰撞测试墙', '高速摄像机', '碰撞假人', 'EDR设备']
        },
        {
          code: 'EMISSION_TEST',
          name: '排放测试',
          maxSimultaneous: 4,
          equipment: ['排放分析仪', 'CVS稀释通道', '颗粒物测量系统']
        },
        {
          code: 'NOISE_TEST',
          name: '噪声测试',
          maxSimultaneous: 2,
          equipment: ['半消音室', '噪声测试系统', '声学摄像机']
        }
      ],
      certifications: [
        {
          type: 'ISO',
          number: 'ISO9001:2025',
          validUntil: '2026-12-31'
        },
        {
          type: 'CNAS',
          number: 'CNAS-L5678',
          validUntil: '2026-12-31'
        }
      ]
    },
    facilities: [
      {
        name: '碰撞安全测试区',
        area: 15000,
        equipment: ['可变形障碍墙', '多角度碰撞测试台', '生物力学测试设备'],
        status: 'OPERATIONAL'
      },
      {
        name: '排放测试实验室',
        area: 6000,
        equipment: ['转鼓试验台', '环境舱', '气体分析仪'],
        status: 'OPERATIONAL'
      },
      {
        name: '噪声测试中心',
        area: 4000,
        equipment: ['全消音室', '混响室', '车内噪声测试系统'],
        status: 'OPERATIONAL'
      }
    ],
    status: 'AVAILABLE',
    currentTests: [
      {
        testId: 'TT003',
        testType: 'EMISSION_TEST',
        startTime: '2025-04-12T09:00:00Z',
        endTime: '2025-04-12T17:00:00Z',
        facility: '排放测试实验室'
      }
    ],
    statistics: {
      totalTestsCompleted: 2150,
      totalTestsThisYear: 280,
      successRate: 0.99,
      utilizationRate: 0.88,
      averageTestDuration: 6.8
    },
    weather: {
      temperature: 24,
      humidity: 68,
      windSpeed: 4.2,
      precipitation: 0,
      updatedAt: '2025-04-11T08:00:00Z'
    },
    description: '上海嘉定汽车城测试中心，中国领先的汽车安全和环保测试基地，具备完整的整车认证测试能力',
    totalArea: 85000,
    indoorArea: 35000,
    outdoorArea: 50000,
    images: [
      {
        url: 'https://example.com/sjatc1.jpg',
        description: '上海嘉定碰撞测试区',
        type: 'FACILITY'
      }
    ],
    rating: {
      overall: 4.9,
      equipment: 5.0,
      service: 4.8,
      safety: 5.0
    },
    testTypes: ['碰撞安全测试', '排放测试', '噪声测试'],
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2025-04-11T08:00:00Z'
  },
  {
    siteId: 'TS004',
    siteName: '北京亦庄新能源汽车测试中心',
    siteCode: 'BYNEVTC',
    address: '北京市大兴区亦庄经济技术开发区科创十街1号',
    location: {
      city: '北京市',
      district: '大兴区',
      longitude: 116.5133,
      latitude: 39.7817
    },
    capacity: {
      maxVehicles: 22,
      currentVehicles: 16,
      maxSimultaneousTests: 5
    },
    contacts: [
      {
        name: '李博士',
        title: '技术总监',
        phone: '010-67891234',
        mobile: '13612345678',
        email: 'tech.director@bynevtc.com'
      }
    ],
    schedule: {
      operatingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      operatingHours: {
        start: '09:00',
        end: '17:00'
      },
      holidays: ['2025-04-06', '2025-04-07', '2025-04-08'],
      maintenanceDays: ['SATURDAY', 'SUNDAY']
    },
    testCapabilities: {
      types: [
        {
          code: 'EV_BATTERY_TEST',
          name: '电池测试',
          maxSimultaneous: 3,
          equipment: ['电池测试系统', '热管理测试台', '安全性测试设备']
        },
        {
          code: 'CHARGING_TEST',
          name: '充电测试',
          maxSimultaneous: 4,
          equipment: ['直流充电桩', '交流充电桩', '无线充电测试平台']
        },
        {
          code: 'ENVIRONMENTAL_TEST',
          name: '环境适应性测试',
          maxSimultaneous: 2,
          equipment: ['高低温试验箱', '盐雾试验箱', '振动台']
        }
      ],
      certifications: [
        {
          type: 'CQC',
          number: 'CQC-EV-2025',
          validUntil: '2026-12-31'
        }
      ]
    },
    facilities: [
      {
        name: '电池测试实验室',
        area: 8000,
        equipment: ['电池包测试台', '单体电池测试系统', '热失控测试装置'],
        status: 'OPERATIONAL'
      },
      {
        name: '充电设施测试区',
        area: 5000,
        equipment: ['多标准充电桩', '充电兼容性测试设备', '电磁兼容测试室'],
        status: 'OPERATIONAL'
      }
    ],
    status: 'AVAILABLE',
    currentTests: [],
    statistics: {
      totalTestsCompleted: 850,
      totalTestsThisYear: 125,
      successRate: 0.97,
      utilizationRate: 0.79,
      averageTestDuration: 4.8
    },
    weather: {
      temperature: 22,
      humidity: 55,
      windSpeed: 3.8,
      precipitation: 0,
      updatedAt: '2025-04-11T08:00:00Z'
    },
    description: '北京亦庄新能源汽车测试中心，专业的新能源汽车测试基地，聚焦电动汽车关键技术验证和认证',
    totalArea: 45000,
    indoorArea: 20000,
    outdoorArea: 25000,
    images: [
      {
        url: 'https://example.com/bynevtc1.jpg',
        description: '北京亦庄电池测试实验室',
        type: 'FACILITY'
      }
    ],
    rating: {
      overall: 4.6,
      equipment: 4.7,
      service: 4.5,
      safety: 4.8
    },
    testTypes: ['电池测试', '充电测试', '环境测试'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-04-11T08:00:00Z'
  },
  {
    siteId: 'TS005',
    siteName: '重庆两江汽车试验场',
    siteCode: 'CQLJATF',
    address: '重庆市两江新区创新大道888号',
    location: {
      city: '重庆市',
      district: '两江新区',
      longitude: 106.6308,
      latitude: 29.7183
    },
    capacity: {
      maxVehicles: 18,
      currentVehicles: 12,
      maxSimultaneousTests: 4
    },
    contacts: [
      {
        name: '王场长',
        title: '试验场场长',
        phone: '023-67891234',
        mobile: '13512345678',
        email: 'director@cqljatf.com'
      }
    ],
    schedule: {
      operatingDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
      operatingHours: {
        start: '08:30',
        end: '17:00'
      },
      holidays: ['2025-04-06', '2025-04-07', '2025-04-08'],
      maintenanceDays: ['SUNDAY']
    },
    testCapabilities: {
      types: [
        {
          code: 'MOUNTAIN_TEST',
          name: '山地道路测试',
          maxSimultaneous: 2,
          equipment: ['坡度测试道', '弯道测试区', '高原模拟设备']
        },
        {
          code: 'DURABILITY_TEST',
          name: '耐久性测试',
          maxSimultaneous: 3,
          equipment: ['耐久性跑道', '恶劣路况模拟', '振动测试台']
        }
      ],
      certifications: [
        {
          type: 'ISO',
          number: 'ISO9001:2025',
          validUntil: '2026-12-31'
        }
      ]
    },
    facilities: [
      {
        name: '山地测试道',
        area: 25000,
        equipment: ['坡度可调跑道', '弯道测试区', '制动距离测试区'],
        status: 'OPERATIONAL'
      },
      {
        name: '综合耐久测试区',
        area: 30000,
        equipment: ['比利时路', '搓板路', '扭曲路'],
        status: 'OPERATIONAL'
      }
    ],
    status: 'AVAILABLE',
    currentTests: [],
    statistics: {
      totalTestsCompleted: 675,
      totalTestsThisYear: 95,
      successRate: 0.94,
      utilizationRate: 0.75,
      averageTestDuration: 7.2
    },
    weather: {
      temperature: 26,
      humidity: 78,
      windSpeed: 2.5,
      precipitation: 5,
      updatedAt: '2025-04-11T08:00:00Z'
    },
    description: '重庆两江汽车试验场，山地特色测试基地，提供独特的坡道和复杂路况测试条件',
    totalArea: 120000,
    indoorArea: 15000,
    outdoorArea: 105000,
    images: [
      {
        url: 'https://example.com/cqljatf1.jpg',
        description: '重庆两江山地测试道',
        type: 'FACILITY'
      }
    ],
    rating: {
      overall: 4.5,
      equipment: 4.4,
      service: 4.6,
      safety: 4.7
    },
    testTypes: ['山地道路测试', '耐久性测试', '制动测试'],
    createdAt: '2023-09-01T00:00:00Z',
    updatedAt: '2025-04-11T08:00:00Z'
  }
];

// 模拟可用时间段数据
export const mockTimeSlots = {
  morning: [
    { id: '1', time: '09:00-10:00', available: true },
    { id: '2', time: '10:00-11:00', available: true },
    { id: '3', time: '11:00-12:00', available: false }
  ],
  afternoon: [
    { id: '4', time: '13:00-14:00', available: true },
    { id: '5', time: '14:00-15:00', available: false },
    { id: '6', time: '15:00-16:00', available: true }
  ]
};

// 模拟预约数据
export const mockBookings = [
  {
    bookingId: '1',
    userId: '1',
    vehicleId: '1',
    testSiteId: '1',
    bookingDate: '2025-04-15',
    timeSlot: '09:00-10:00',
    serviceType: '碰撞测试',
    status: 'CONFIRMED',
    notes: '首次碰撞测试',
    createdAt: '2025-04-10T08:00:00Z',
    updatedAt: '2025-04-10T08:00:00Z'
  },
  {
    bookingId: '2',
    userId: '1',
    vehicleId: '2',
    testSiteId: '2',
    bookingDate: '2025-04-16',
    timeSlot: '13:00-14:00',
    serviceType: '性能测试',
    status: 'PENDING',
    notes: '年度性能测试',
    createdAt: '2025-04-10T09:00:00Z',
    updatedAt: '2025-04-10T09:00:00Z'
  }
];

// 模拟预约统计数据
export const mockBookingStats = {
  totalBookings: 50,
  confirmedBookings: 30,
  pendingBookings: 15,
  cancelledBookings: 5,
  todayBookings: 8,
  weeklyBookings: 35,
  monthlyBookings: 120,
  popularTimeSlots: [
    { timeSlot: '09:00-10:00', count: 25 },
    { timeSlot: '14:00-15:00', count: 20 }
  ],
  popularServices: [
    { service: '碰撞测试', count: 30 },
    { service: '性能测试', count: 25 }
  ]
};
