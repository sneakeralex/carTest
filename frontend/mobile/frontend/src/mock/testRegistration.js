// 测试报名相关mock数据

// 我的测试报名记录
export const mockMyTestRegistrations = [
  {
    id: 1,
    registrationId: 'REG001',
    taskId: 'T001',
    taskName: '车辆性能测试',
    description: '全面的车辆性能评估测试，包括动力性能、燃油经济性、制动性能等多项指标的综合测试',
    taskType: 'PERFORMANCE',
    difficulty: 'MEDIUM',
    status: 'APPROVED',
    registrationTime: '2025-09-10T14:30:00Z',
    scheduledTime: '2025-09-20T09:00:00Z',
    testLocation: '德清测试场A区',
    estimatedDuration: 4,
    fee: 5000,
    requirements: ['携带车辆行驶证', '车辆状态良好', '提前30分钟到场'],
    testItems: [
      { name: '最高速度测试', description: '测试车辆最高速度性能' },
      { name: '加速性能测试', description: '0-100km/h加速时间测试' },
      { name: '制动距离测试', description: '100-0km/h制动距离测试' }
    ],
    vehicles: [
      { vehicleId: 'V001', licensePlate: '沪A12345', brand: '特斯拉', model: 'Model 3' }
    ],
    contactPerson: '张工程师',
    contactPhone: '13812345678'
  },
  {
    id: 2,
    registrationId: 'REG002',
    taskId: 'T002',
    taskName: '安全性能测试',
    description: '车辆安全系统全面检测，包括主动安全和被动安全系统的综合评估',
    taskType: 'SAFETY',
    difficulty: 'HARD',
    status: 'IN_PROGRESS',
    registrationTime: '2025-09-08T10:15:00Z',
    scheduledTime: '2025-09-18T14:00:00Z',
    testLocation: '上海嘉定汽车城测试中心',
    estimatedDuration: 6,
    fee: 8000,
    requirements: ['携带安全设备', '专业技术人员陪同', '签署安全协议'],
    testItems: [
      { name: '碰撞测试', description: '车辆碰撞安全性能测试' },
      { name: 'ABS测试', description: '防抱死制动系统测试' },
      { name: '安全气囊测试', description: '安全气囊触发性能测试' }
    ],
    vehicles: [
      { vehicleId: 'V002', licensePlate: '京B67890', brand: '比亚迪', model: '汉EV' }
    ],
    contactPerson: '李工程师',
    contactPhone: '13987654321',
    currentProgress: 60,
    nextStep: '等待碰撞测试安排'
  },
  {
    id: 3,
    registrationId: 'REG003',
    taskId: 'T003',
    taskName: '排放测试',
    description: '车辆尾气排放标准检测，符合国家环保要求的排放标准测试',
    taskType: 'EMISSION',
    difficulty: 'EASY',
    status: 'COMPLETED',
    registrationTime: '2025-09-05T16:20:00Z',
    scheduledTime: '2025-09-15T11:00:00Z',
    completedTime: '2025-09-15T13:00:00Z',
    testLocation: '北京亦庄新能源汽车测试中心',
    estimatedDuration: 2,
    fee: 2000,
    requirements: ['车辆预热充分', '携带车辆技术资料'],
    testItems: [
      { name: 'CO排放测试', description: '一氧化碳排放量测试' },
      { name: 'HC排放测试', description: '碳氢化合物排放量测试' },
      { name: 'NOx排放测试', description: '氮氧化物排放量测试' }
    ],
    vehicles: [
      { vehicleId: 'V003', licensePlate: '粤C98765', brand: '广汽埃安', model: 'AION V' }
    ],
    contactPerson: '王工程师',
    contactPhone: '13765432109',
    testResult: 'PASSED',
    testScore: 95,
    resultDetails: {
      co: { measured: 0.8, standard: 1.0, unit: 'g/km', result: 'PASS' },
      hc: { measured: 0.05, standard: 0.1, unit: 'g/km', result: 'PASS' },
      nox: { measured: 0.03, standard: 0.06, unit: 'g/km', result: 'PASS' }
    },
    certificate: {
      number: 'CERT-2025-001',
      issueDate: '2025-09-15',
      validUntil: '2026-09-15'
    }
  },
  {
    id: 4,
    registrationId: 'REG004',
    taskId: 'T004',
    taskName: '电池安全测试',
    description: '新能源车辆电池安全性能测试，包括热失控、过充过放等安全测试',
    taskType: 'BATTERY_SAFETY',
    difficulty: 'HARD',
    status: 'PENDING',
    registrationTime: '2025-09-12T09:45:00Z',
    scheduledTime: null,
    testLocation: '待安排',
    estimatedDuration: 8,
    fee: 12000,
    requirements: ['专业技术团队', '安全防护设备', '紧急处理预案'],
    testItems: [
      { name: '热失控测试', description: '电池热失控安全性测试' },
      { name: '过充测试', description: '电池过充保护测试' },
      { name: '穿刺测试', description: '电池穿刺安全测试' }
    ],
    vehicles: [
      { vehicleId: 'V004', licensePlate: '川A11111', brand: '理想', model: 'L9' }
    ],
    contactPerson: '陈工程师',
    contactPhone: '13654321098',
    approvalStatus: 'PENDING',
    approvalComments: '等待技术委员会审核'
  },
  {
    id: 5,
    registrationId: 'REG005',
    taskId: 'T005',
    taskName: '自动驾驶测试',
    description: '智能网联汽车自动驾驶功能测试，包括感知、决策、控制等系统测试',
    taskType: 'AUTONOMOUS_DRIVING',
    difficulty: 'HIGH',
    status: 'SCHEDULED',
    registrationTime: '2025-09-11T11:20:00Z',
    scheduledTime: '2025-09-25T08:00:00Z',
    testLocation: '深圳智能汽车测试基地B区',
    estimatedDuration: 10,
    fee: 15000,
    requirements: ['测试驾驶员', '安全员', '专业测试设备', '测试许可证'],
    testItems: [
      { name: '感知系统测试', description: '摄像头、雷达等感知设备测试' },
      { name: '决策算法测试', description: '自动驾驶决策算法测试' },
      { name: '执行系统测试', description: '转向、制动、加速执行系统测试' }
    ],
    vehicles: [
      { vehicleId: 'V005', licensePlate: '粤B88888', brand: '小鹏', model: 'P7' }
    ],
    contactPerson: '赵工程师',
    contactPhone: '13543210987',
    testEnvironments: ['城市道路', '高速公路', '停车场景'],
    safetyMeasures: ['安全员监控', '紧急接管', '实时数据记录']
  },
  {
    id: 6,
    registrationId: 'REG006',
    taskId: 'T006',
    taskName: '噪声测试',
    description: '车辆噪声水平测试，包括车内噪声和车外噪声的综合评估',
    taskType: 'NOISE',
    difficulty: 'MEDIUM',
    status: 'CANCELLED',
    registrationTime: '2025-09-09T15:10:00Z',
    scheduledTime: '2025-09-19T13:00:00Z',
    testLocation: '上海嘉定汽车城测试中心',
    estimatedDuration: 3,
    fee: 3000,
    requirements: ['安静环境', '标准测试路面', '专业噪声测试设备'],
    testItems: [
      { name: '怠速噪声测试', description: '车辆怠速状态噪声测试' },
      { name: '加速噪声测试', description: '车辆加速过程噪声测试' },
      { name: '车内噪声测试', description: '驾驶舱内部噪声测试' }
    ],
    vehicles: [
      { vehicleId: 'V006', licensePlate: '浙A66666', brand: '吉利', model: '星越L' }
    ],
    contactPerson: '孙工程师',
    contactPhone: '13432109876',
    cancellationReason: '设备故障',
    cancellationTime: '2025-09-14T10:30:00Z',
    refundStatus: 'PROCESSED'
  }
];

// 测试任务状态映射
export const testRegistrationStatusMap = {
  'PENDING': { text: '待审核', color: '#ff976a', type: 'warning' },
  'APPROVED': { text: '已通过', color: '#07c160', type: 'success' },
  'REJECTED': { text: '已拒绝', color: '#ee0a24', type: 'danger' },
  'SCHEDULED': { text: '已安排', color: '#1989fa', type: 'primary' },
  'IN_PROGRESS': { text: '进行中', color: '#ff976a', type: 'warning' },
  'COMPLETED': { text: '已完成', color: '#07c160', type: 'success' },
  'CANCELLED': { text: '已取消', color: '#969799', type: 'default' }
};

// 测试类型映射
export const testTypeMap = {
  'PERFORMANCE': { text: '性能测试', icon: 'speed-o', color: '#1989fa' },
  'SAFETY': { text: '安全测试', icon: 'shield-o', color: '#ee0a24' },
  'EMISSION': { text: '排放测试', icon: 'leaf', color: '#07c160' },
  'NOISE': { text: '噪声测试', icon: 'volume-o', color: '#ff976a' },
  'BATTERY_SAFETY': { text: '电池安全', icon: 'lightning', color: '#ff976a' },
  'AUTONOMOUS_DRIVING': { text: '自动驾驶', icon: 'guide-o', color: '#1989fa' }
};

// 难度等级映射
export const difficultyMap = {
  'EASY': { text: '简单', color: '#07c160', level: 1 },
  'MEDIUM': { text: '中等', color: '#ff976a', level: 2 },
  'HARD': { text: '困难', color: '#ee0a24', level: 3 },
  'HIGH': { text: '很难', color: '#ee0a24', level: 4 }
};
