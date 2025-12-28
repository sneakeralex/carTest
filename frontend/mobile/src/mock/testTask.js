// 模拟测试任务数据
export const mockTestTasks = {
  content: [
    {
      taskId: 'TT001',
      taskName: '新车型碰撞测试',
      description: '对新开发的车型进行碰撞测试',
      department: '整车性能部',
      testType: 'CRASH_TEST',
      experimentType: 'COLLISION',
      difficulty: 'HIGH',
      status: 'APPROVED',
      startDate: '2025-04-10',
      endDate: '2025-04-20',
      maxParticipants: 10,
      currentParticipants: 5,
      testSite: '德清测试场A区',
      testSiteId: 'TS001',
        monthly: {
    '2025-04': {
      completedTasks: 5,
      totalTests: 12,
      successRate: 0.92,
      utilizationRate: 0.85
    },
    '2025-03': {
      completedTasks: 8,
      totalTests: 15,
      successRate: 0.95,
      utilizationRate: 0.88
    }
  },ion: 24,
      contractInfo: {
        contractNumber: 'CT2025001',
        client: '某汽车制造公司'
      },
      fee: 50000,
      equipment: [
        '高速摄像机',
        '碰撞测试假人',
        '数据采集系统'
      ],
      requirements: [
        '需要具备相关安全测试经验',
        '必须持有相关资质证书',
        '熟悉碰撞测试流程和标准'
      ],
      notes: [
        '测试前需进行详细的设备校准',
        '按照国标要求进行测试'
      ],
      createdAt: '2025-04-01',
      updatedAt: '2025-04-10',
      vehicles: [
        {
          vehicleId: 'V001',
          name: '测试车型A - 京A12345',
          testContent: '前碰撞测试、侧碰撞测试',
          preparationStatus: '已完成'
        }
      ]
    },
    {
      taskId: 'TT002',
      taskName: '制动系统耐久性测试',
      description: '车辆制动系统长期使用可靠性测试',
      department: '底盘测试部',
      testType: 'DURABILITY_TEST',
      experimentType: 'BRAKE_TEST',
      difficulty: 'MEDIUM',
      status: 'APPROVED',
      startDate: '2025-04-15',
      endDate: '2025-04-30',
      maxParticipants: 5,
      currentParticipants: 2,
      testSite: '德清测试场B区',
      testSiteId: 'TS002',
      estimatedDuration: 120,
      contractInfo: {
        contractNumber: 'CT2025002',
        client: '某汽车零部件公司'
      },
      fee: 80000,
      equipment: [
        '制动性能测试仪',
        '温度传感器',
        '数据记录仪'
      ],
      requirements: [
        '需要专业制动系统测试经验',
        '熟悉ABS系统测试方法',
        '具备数据分析能力'
      ],
      notes: [
        '测试过程需要全程记录数据',
        '注意观察制动系统温度变化'
      ],
      createdAt: '2025-04-05',
      updatedAt: '2025-04-10',
      vehicles: [
        {
          vehicleId: 'V002',
          name: '测试车型B - 京B67890',
          testContent: '制动系统耐久性测试',
          preparationStatus: '准备中'
        },
        {
          vehicleId: 'V003',
          name: '测试车型C - 京C11111',
          testContent: '制动性能对比测试',
          preparationStatus: '已完成'
        }
      ]
    },
    {
      taskId: 'TT003',
      taskName: '测试任务',
      description: '测试任务描述',
      department: '测试任务单位',
      testType: 'PERFORMANCE_TEST',
      experimentType: 'PERFORMANCE_TEST',
      difficulty: 'MEDIUM',
      status: 'APPROVED',
      startDate: '2025-04-15',
      endDate: '2025-04-30',
      maxParticipants: 2,
      currentParticipants: 0,
      testSite: '德清测试场A区',
      testSiteId: 'TS001',
      estimatedDuration: 2,
      contractInfo: {
        contractNumber: 'TEST01234',
        client: '蔚来'
      },
      fee: 100,
      equipment: [
        '设备要求'
      ],
      requirements: [
        '任务要求'
      ],
      notes: [
        '备注说明'
      ],
      createdAt: '2025-04-15',
      updatedAt: '2025-04-15',
      vehicles: [
        {
          vehicleId: '5',  // 使用与vehicle.js中一致的ID
          name: '蔚来 ET7',
          testContent: '蔚来ET7测试内容',
          preparationStatus: '已完成'
        }
      ]
    }
  ],
  pageable: {
    sort: {
      sorted: true,
      unsorted: false,
      empty: false
    },
    pageNumber: 0,
    pageSize: 10,
    offset: 0,
    paged: true,
    unpaged: false
  },
  totalPages: 1,
  totalElements: 3,
  last: true,
  sort: {
    sorted: true,
    unsorted: false,
    empty: false
  },
  first: true,
  number: 0,
  numberOfElements: 3,
  size: 10,
  empty: false
};

export const mockTestRegistrations = [
  {
    registrationId: 'REG001',
    taskId: 'TT001',
    userId: 'USER001',
    userName: '张工',
    userDepartment: '整车性能部',
    status: 'APPROVED',
    registrationDate: '2025-04-05',
    testDate: '2025-04-12',
    result: null,
    taskName: '新车型碰撞测试',
    difficulty: 'HIGH',
    testLocation: '德清测试场A区',
    estimatedDuration: 24,
    score: null,
    vehicleAssignments: [
      {
        vehicleId: 'V001',
        name: '测试车型A - 京A12345',
        testRole: '主测',
        testItems: ['前碰撞测试', '侧碰撞测试'],
        preparationStatus: '已完成'
      }
    ],
    equipmentAssignments: [
      {
        equipmentId: 'EQ001',
        name: '高速摄像机',
        status: '已准备'
      },
      {
        equipmentId: 'EQ002',
        name: '碰撞测试假人',
        status: '已校准'
      }
    ],
    comments: [
      {
        content: '已审核通过',
        createdAt: '2025-04-06T10:00:00',
        createdBy: 'ADMIN001',
        createdByName: '王管理'
      }
    ],
    createdAt: '2025-04-05T15:30:00',
    updatedAt: '2025-04-06T10:00:00'
  },
  {
    registrationId: 'REG002',
    taskId: 'TT002',
    userId: 'USER002',
    userName: '李工',
    userDepartment: '底盘测试部',
    status: 'PENDING',
    registrationDate: '2025-04-06',
    testDate: null,
    result: null,
    taskName: '制动系统耐久性测试',
    difficulty: 'MEDIUM',
    testLocation: '德清测试场B区',
    estimatedDuration: 120,
    score: null,
    vehicleAssignments: [
      {
        vehicleId: 'V002',
        name: '测试车型B - 京B67890',
        testRole: '主测',
        testItems: ['制动系统耐久性测试'],
        preparationStatus: '准备中'
      },
      {
        vehicleId: 'V003',
        name: '测试车型C - 京C11111',
        testRole: '对比测试',
        testItems: ['制动性能测试'],
        preparationStatus: '已完成'
      }
    ],
    equipmentAssignments: [
      {
        equipmentId: 'EQ003',
        name: '制动性能测试仪',
        status: '待校准'
      }
    ],
    comments: [
      {
        content: '等待审核',
        createdAt: '2025-04-06T16:00:00',
        createdBy: 'SYSTEM',
        createdByName: '系统'
      }
    ],
    createdAt: '2025-04-06T16:00:00',
    updatedAt: '2025-04-06T16:00:00'
  },
  // 添加当前用户的测试任务报名数据
  {
    registrationId: 'REG003',
    taskId: 'TT003',
    userId: '1', // 当前登录用户ID
    userName: '当前用户',
    userDepartment: '测试部',
    status: 'IN_PROGRESS',
    registrationDate: '2025-04-10',
    testDate: '2025-04-12',
    result: null,
    taskName: '车辆性能综合测试',
    difficulty: 'MEDIUM',
    testLocation: '德清测试场A区',
    estimatedDuration: 8,
    score: null,
    vehicleAssignments: [
      {
        vehicleId: 'V004',
        name: '测试车辆001 - 京A88888',
        testRole: '主测',
        testItems: ['加速性能测试', '制动性能测试', '操控性能测试'],
        preparationStatus: '已完成'
      }
    ],
    equipmentAssignments: [
      {
        equipmentId: 'EQ004',
        name: '车载数据采集系统',
        status: '已准备'
      },
      {
        equipmentId: 'EQ005',
        name: 'GPS测速仪',
        status: '已校准'
      }
    ],
    comments: [
      {
        content: '测试进行中，数据采集正常',
        createdAt: '2025-04-12T09:00:00',
        createdBy: 'USER001',
        createdByName: '测试员'
      }
    ],
    createdAt: '2025-04-10T14:30:00',
    updatedAt: '2025-04-12T09:00:00'
  },
  {
    registrationId: 'REG004',
    taskId: 'TT004',
    userId: '1', // 当前登录用户ID
    userName: '当前用户',
    userDepartment: '测试部',
    status: 'SCHEDULED',
    registrationDate: '2025-04-08',
    testDate: '2025-04-15',
    result: null,
    taskName: '环保排放测试',
    difficulty: 'EASY',
    testLocation: '德清测试场C区',
    estimatedDuration: 4,
    score: null,
    vehicleAssignments: [
      {
        vehicleId: 'V005',
        name: '测试车辆002 - 京B99999',
        testRole: '主测',
        testItems: ['尾气排放测试', '噪音测试'],
        preparationStatus: '已完成'
      }
    ],
    equipmentAssignments: [
      {
        equipmentId: 'EQ006',
        name: '尾气分析仪',
        status: '已准备'
      },
      {
        equipmentId: 'EQ007',
        name: '噪音计',
        status: '已校准'
      }
    ],
    comments: [
      {
        content: '测试已安排，等待执行',
        createdAt: '2025-04-11T16:00:00',
        createdBy: 'ADMIN002',
        createdByName: '调度员'
      }
    ],
    createdAt: '2025-04-08T10:20:00',
    updatedAt: '2025-04-11T16:00:00'
  },
  {
    registrationId: 'REG005',
    taskId: 'TT005',
    userId: '1', // 当前登录用户ID
    userName: '当前用户',
    userDepartment: '测试部',
    status: 'COMPLETED',
    registrationDate: '2025-04-01',
    testDate: '2025-04-08',
    result: 'PASSED',
    taskName: '安全气囊测试',
    difficulty: 'HIGH',
    testLocation: '德清测试场A区',
    estimatedDuration: 6,
    score: 95,
    vehicleAssignments: [
      {
        vehicleId: 'V006',
        name: '测试车辆003 - 京C77777',
        testRole: '主测',
        testItems: ['正面碰撞气囊测试', '侧面碰撞气囊测试'],
        preparationStatus: '已完成'
      }
    ],
    equipmentAssignments: [
      {
        equipmentId: 'EQ008',
        name: '碰撞测试台',
        status: '已准备'
      },
      {
        equipmentId: 'EQ009',
        name: '气囊压力传感器',
        status: '已校准'
      }
    ],
    comments: [
      {
        content: '测试完成，结果优秀',
        createdAt: '2025-04-08T18:00:00',
        createdBy: 'USER001',
        createdByName: '测试员'
      }
    ],
    createdAt: '2025-04-01T11:15:00',
    updatedAt: '2025-04-08T18:00:00'
  }
];

export const mockTestStats = {
  tasks: {
    total: 10,
    byStatus: {
      PENDING: 3,
      IN_PROGRESS: 3,
      COMPLETED: 5,
      CANCELLED: 2
    },
    byType: {
      CRASH_TEST: 3,
      DURABILITY_TEST: 2,
      PERFORMANCE_TEST: 2,
      NOISE_TEST: 2,
      BRAKE_TEST: 1
    },
    byDepartment: {
      '整车性能部': 4,
      '底盘测试部': 3,
      '车身测试部': 3
    },
    byDifficulty: {
      EASY: 3,
      MEDIUM: 4,
      HARD: 3
    }
  },
  registrations: {
    total: 25,
    byStatus: {
      PENDING: 8,
      APPROVED: 15,
      REJECTED: 2
    },
    byDepartment: {
      '整车性能部': 10,
      '底盘测试部': 8,
      '车身测试部': 7
    }
  },
  testSites: {
    total: 5,
    inUse: 3,
    maintenance: 1,
    available: 1
  },
  vehicles: {
    total: 15,
    inTest: 8,
    available: 5,
    maintenance: 2
  },
  equipment: {
    total: 50,
    inUse: 30,
    available: 15,
    maintenance: 5
  },
  monthlyStats: {
    '2025-04': {
      completedTasks: 5,
      totalTests: 12,
      successRate: 0.92,
      utilizationRate: 0.85
    },
    '2025-03': {
      completedTasks: 8,
      totalTests: 15,
      successRate: 0.95,
      utilizationRate: 0.88
    }
  },
  performance: {
    avgTaskDuration: 72, // 小时
    avgPreparationTime: 24, // 小时
    avgCompletionRate: 0.93,
    resourceUtilization: 0.86
  }
};
