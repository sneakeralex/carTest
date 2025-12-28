// 移动端仪表盘统计信息
export const mockDashboardStats = {
  appointments: {
    total: 15,
    pending: 3,
    confirmed: 8,
    completed: 4
  },
  vehicles: {
    total: 3,
    active: 2,
    maintenance: 1
  },
  testRegistrations: {
    total: 10,
    pending: 2,
    approved: 5,
    completed: 3
  },
  // 添加Home.vue中需要的字段
  pendingBookings: 3, // 待确认预约数
  testScore: 85, // 平均测试分数
  totalBookings: 15, // 总预约数
  completedTests: 3 // 已完成测试数
};

// 最近的测试场预约记录
export const mockRecentBookings = [
  {
    bookingId: 'SB001',
    testSiteName: '德清测试场A区',
    bookingDate: '2025-04-15T09:00:00Z',
    status: 'CONFIRMED',
    serviceType: '制动性能测试',
    vehiclePlateNo: '沪A12345',
    location: '浙江德清测试基地',
    notes: '请提前30分钟到场准备'
  },
  {
    bookingId: 'SB002',
    testSiteName: '深圳智能汽车测试基地B区',
    bookingDate: '2025-04-16T14:00:00Z',
    status: 'PENDING',
    serviceType: '自动驾驶测试',
    vehiclePlateNo: '粤B67890',
    location: '深圳南山智能汽车测试基地',
    notes: '需要携带自动驾驶系统技术文档'
  },
  {
    bookingId: 'SB003',
    testSiteName: '北京亦庄测试场C区',
    bookingDate: '2025-04-17T10:30:00Z',
    status: 'CONFIRMED',
    serviceType: '排放测试',
    vehiclePlateNo: '京Q11111',
    location: '北京亦庄新能源汽车测试中心',
    notes: '环保测试，请确保车辆状态良好'
  },
  {
    bookingId: 'SB004',
    testSiteName: '上海嘉定测试场D区',
    bookingDate: '2025-04-18T08:00:00Z',
    status: 'COMPLETED',
    serviceType: '碰撞安全测试',
    vehiclePlateNo: '沪C98765',
    location: '上海嘉定汽车城测试中心',
    notes: '测试已完成，报告将在3个工作日内发布'
  },
  {
    bookingId: 'SB005',
    testSiteName: '广州花都测试场E区',
    bookingDate: '2025-04-20T15:00:00Z',
    status: 'PENDING',
    serviceType: '整车性能测试',
    vehiclePlateNo: '粤A54321',
    location: '广州花都汽车城测试基地',
    notes: '综合性能评估，预计测试时间4小时'
  }
];

// 通知列表
export const mockNotifications = [
  // 审批类消息
  {
    id: '1',
    type: 'APPROVAL',
    category: 'approval',
    title: '测试任务审批通过',
    content: '您申请的"车辆制动性能测试"任务已通过审批，请按时参加测试。测试时间：2025年9月15日 14:00-16:00',
    priority: 'high',
    read: false,
    createdAt: '2025-04-12T08:30:00Z',
    relatedId: 'TT001',
    relatedType: 'TEST_TASK',
    actionRequired: true,
    actions: [
      { label: '查看详情', action: 'view_detail' },
      { label: '确认参加', action: 'confirm_attendance' }
    ]
  },
  {
    id: '2',
    type: 'APPROVAL',
    category: 'approval',
    title: '设备申请审批结果',
    content: '您申请的"高精度GPS定位设备"申请已被驳回。驳回原因：设备当前正在维护中，预计9月20日可用。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-12T07:15:00Z',
    relatedId: 'EA002',
    relatedType: 'EQUIPMENT_APPLICATION',
    actionRequired: true,
    actions: [
      { label: '重新申请', action: 'reapply' },
      { label: '查看原因', action: 'view_reason' }
    ]
  },
  {
    id: '3',
    type: 'APPROVAL',
    category: 'approval',
    title: '车辆年检审批完成',
    content: '您的车辆年检申请(车牌：沪A12345)已通过审核，年检证书已生成，请及时下载打印。',
    priority: 'medium',
    read: true,
    createdAt: '2025-04-11T14:20:00Z',
    relatedId: 'VI001',
    relatedType: 'VEHICLE_INSPECTION',
    actionRequired: true,
    actions: [
      { label: '下载证书', action: 'download_certificate' },
      { label: '查看详情', action: 'view_detail' }
    ]
  },
  {
    id: '4',
    type: 'APPROVAL',
    category: 'approval',
    title: '合同审批进度更新',
    content: '您提交的测试服务合同(合同号: CT-2024-089)已完成技术部门审核，正在等待财务部门审批。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-10T15:20:00Z',
    relatedId: 'CT089',
    relatedType: 'CONTRACT',
    actionRequired: false,
    approvalProgress: [
      { department: '技术部', status: 'approved', date: '2025-04-10' },
      { department: '财务部', status: 'pending', date: null },
      { department: '法务部', status: 'waiting', date: null }
    ]
  },
  {
    id: '5',
    type: 'APPROVAL',
    category: 'approval',
    title: '费用减免申请审批',
    content: '您申请的测试费用减免(申请金额：5000元)已通过初审，正在等待主管审批。预计3个工作日内完成。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-09T11:30:00Z',
    relatedId: 'FR001',
    relatedType: 'FEE_REDUCTION',
    actionRequired: false,
    estimatedProcessTime: '3个工作日'
  },

  // 场地类消息
  {
    id: '6',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '测试场地变更通知',
    content: '德清测试场A区因设备升级，9月14日-9月16日暂停使用，已安排的测试将调整至B区进行。',
    priority: 'high',
    read: false,
    createdAt: '2025-04-11T16:20:00Z',
    relatedId: 'TS001',
    relatedType: 'TEST_SITE',
    actionRequired: false,
    affectedBookings: ['BK001', 'BK002', 'BK003']
  },
  {
    id: '7',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '场地预约提醒',
    content: '您预约的德清测试场B区明天(9月13日)09:00-12:00的时段即将开始，请提前30分钟到达现场。',
    priority: 'medium',
    read: true,
    createdAt: '2025-04-11T20:00:00Z',
    relatedId: 'BK004',
    relatedType: 'BOOKING',
    actionRequired: false,
    reminderTime: '2025-04-13T08:30:00Z'
  },
  {
    id: '8',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '新测试场地开放',
    content: '德清测试场D区新建完成并通过验收，现已开放预约。该场地专门用于新能源汽车充电桩测试，配备最新设备。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-09T09:00:00Z',
    relatedId: 'TS004',
    relatedType: 'TEST_SITE',
    actionRequired: false,
    actions: [
      { label: '查看场地', action: 'view_site' },
      { label: '立即预约', action: 'book_now' }
    ]
  },
  {
    id: '9',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '场地维护完成通知',
    content: '德清测试场C区维护工作已完成，从9月13日起恢复正常使用。新增了自动驾驶测试专用跑道。',
    priority: 'low',
    read: true,
    createdAt: '2025-04-08T16:30:00Z',
    relatedId: 'TS003',
    relatedType: 'TEST_SITE',
    actionRequired: false
  },
  {
    id: '10',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '恶劣天气场地关闭',
    content: '受台风"小犬"影响，德清测试场所有区域9月12日下午暂停使用，相关预约将自动延期至天气恢复后。',
    priority: 'urgent',
    read: false,
    createdAt: '2025-04-12T06:00:00Z',
    relatedId: 'WEATHER_001',
    relatedType: 'WEATHER_ALERT',
    actionRequired: false,
    affectedBookings: ['BK005', 'BK006', 'BK007', 'BK008']
  },

  // 设备类消息
  {
    id: '11',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备归还提醒',
    content: '您借用的"数据采集设备(编号: DC-2024-001)"将于明天(9月13日)到期，请及时归还。逾期将产生额外费用。',
    priority: 'urgent',
    read: false,
    createdAt: '2025-04-12T06:00:00Z',
    relatedId: 'EQ001',
    relatedType: 'EQUIPMENT_BORROW',
    actionRequired: true,
    dueDate: '2025-04-13T18:00:00Z',
    actions: [
      { label: '确认归还', action: 'confirm_return' },
      { label: '申请延期', action: 'request_extension' }
    ]
  },
  {
    id: '12',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备维护完成通知',
    content: '您关注的"碰撞测试假人设备"维护已完成，现已可正常预约使用。设备性能已升级，精度提高20%。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-10T11:45:00Z',
    relatedId: 'EQ002',
    relatedType: 'EQUIPMENT_MAINTENANCE',
    actionRequired: false,
    actions: [
      { label: '立即预约', action: 'book_equipment' }
    ]
  },
  {
    id: '13',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备预约冲突提醒',
    content: '您预约的"高速摄像设备"与其他用户的预约时间存在冲突，系统已自动为您调整至9月15日 10:00-12:00。',
    priority: 'medium',
    read: true,
    createdAt: '2025-04-07T13:10:00Z',
    relatedId: 'EQ003',
    relatedType: 'EQUIPMENT_BOOKING_CONFLICT',
    actionRequired: true,
    originalTime: '2025-04-15T09:00:00Z',
    newTime: '2025-04-15T10:00:00Z',
    actions: [
      { label: '接受调整', action: 'accept_change' },
      { label: '重新预约', action: 'reschedule' }
    ]
  },
  {
    id: '14',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备校准提醒',
    content: '您正在使用的"振动测试设备"需要进行定期校准，请在使用完毕后联系技术人员进行校准。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-06T10:20:00Z',
    relatedId: 'EQ004',
    relatedType: 'EQUIPMENT_CALIBRATION',
    actionRequired: true,
    actions: [
      { label: '联系技术员', action: 'contact_technician' },
      { label: '安排校准', action: 'schedule_calibration' }
    ]
  },
  {
    id: '15',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '新设备到货通知',
    content: '您申请的"激光雷达测试设备"已到货并完成安装调试，现已加入设备库，可正常预约使用。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-05T14:15:00Z',
    relatedId: 'EQ005',
    relatedType: 'EQUIPMENT_ARRIVAL',
    actionRequired: false,
    actions: [
      { label: '查看设备', action: 'view_equipment' },
      { label: '立即预约', action: 'book_equipment' }
    ]
  },

  // 系统通知
  {
    id: '16',
    type: 'SYSTEM_NOTIFICATION',
    category: 'system',
    title: '系统维护通知',
    content: '为提升用户体验，系统将于9月15日02:00-06:00进行维护升级，期间可能影响部分功能使用。',
    priority: 'medium',
    read: true,
    createdAt: '2025-04-10T18:00:00Z',
    relatedId: 'SYS001',
    relatedType: 'SYSTEM_MAINTENANCE',
    actionRequired: false,
    maintenanceWindow: {
      start: '2025-04-15T02:00:00Z',
      end: '2025-04-15T06:00:00Z'
    }
  },
  {
    id: '17',
    type: 'SYSTEM_NOTIFICATION',
    category: 'system',
    title: '功能更新通知',
    content: '新版本已发布！新增智能预约推荐、实时设备状态监控等功能。立即更新体验新功能。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-08T12:00:00Z',
    relatedId: 'UPD001',
    relatedType: 'SYSTEM_UPDATE',
    actionRequired: false,
    version: 'v2.1.0',
    actions: [
      { label: '查看更新', action: 'view_update' },
      { label: '立即更新', action: 'update_now' }
    ]
  },

  // 财务通知
  {
    id: '18',
    type: 'FINANCIAL_NOTIFICATION',
    category: 'financial',
    title: '费用缴纳提醒',
    content: '您的测试服务费用(订单号: PAY-2024-156)共计8500元，请在9月20日前完成缴费，逾期将影响后续服务。',
    priority: 'high',
    read: false,
    createdAt: '2025-04-11T09:30:00Z',
    relatedId: 'PAY156',
    relatedType: 'PAYMENT',
    actionRequired: true,
    amount: 8500,
    dueDate: '2025-04-20T23:59:59Z',
    actions: [
      { label: '立即缴费', action: 'pay_now' },
      { label: '查看账单', action: 'view_bill' }
    ]
  },
  {
    id: '19',
    type: 'FINANCIAL_NOTIFICATION',
    category: 'financial',
    title: '发票开具完成',
    content: '您申请的发票(发票号: INV-2024-789)已开具完成，电子发票已发送至您的邮箱，请注意查收。',
    priority: 'low',
    read: true,
    createdAt: '2025-04-09T16:45:00Z',
    relatedId: 'INV789',
    relatedType: 'INVOICE',
    actionRequired: false,
    actions: [
      { label: '下载发票', action: 'download_invoice' }
    ]
  },

  // 培训通知
  {
    id: '20',
    type: 'TRAINING_NOTIFICATION',
    category: 'training',
    title: '安全培训提醒',
    content: '根据规定，您需要参加年度安全培训。培训时间：9月18日 14:00-17:00，地点：培训中心201室。',
    priority: 'high',
    read: false,
    createdAt: '2025-04-10T08:15:00Z',
    relatedId: 'TRN001',
    relatedType: 'TRAINING',
    actionRequired: true,
    trainingDate: '2025-04-18T14:00:00Z',
    location: '培训中心201室',
    actions: [
      { label: '确认参加', action: 'confirm_training' },
      { label: '申请调换', action: 'reschedule_training' }
    ]
  },

  // 更多场地类消息
  {
    id: '21',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '场地紧急维修通知',
    content: '深圳智能汽车测试基地B区发现安全隐患，紧急停止使用进行维修。已预约该场地的用户请联系客服改期。',
    priority: 'urgent',
    read: false,
    createdAt: '2025-04-12T10:30:00Z',
    relatedId: 'TS002',
    relatedType: 'EMERGENCY_MAINTENANCE',
    actionRequired: true,
    affectedBookings: ['SB002', 'SB006', 'SB007'],
    actions: [
      { label: '联系客服', action: 'contact_service' },
      { label: '查看替代场地', action: 'view_alternatives' }
    ]
  },
  {
    id: '22',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '场地设备升级完成',
    content: '上海嘉定汽车城测试中心碰撞测试区设备升级完成，新增高速摄像系统，测试精度提升40%。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-11T14:00:00Z',
    relatedId: 'TS003',
    relatedType: 'EQUIPMENT_UPGRADE',
    actionRequired: false,
    upgradeDetails: {
      equipment: '高速摄像系统',
      improvement: '测试精度提升40%',
      availableFrom: '2025-04-13T00:00:00Z'
    },
    actions: [
      { label: '查看详情', action: 'view_upgrade_details' },
      { label: '预约体验', action: 'book_upgraded_facility' }
    ]
  },
  {
    id: '23',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '场地收费标准调整',
    content: '根据运营成本变化，自10月1日起，部分测试场地收费标准将进行调整。详情请查看新版价格表。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-10T16:00:00Z',
    relatedId: 'PRICING_001',
    relatedType: 'PRICING_UPDATE',
    actionRequired: false,
    effectiveDate: '2025-10-01T00:00:00Z',
    actions: [
      { label: '查看价格表', action: 'view_pricing' },
      { label: '提前预约', action: 'advance_booking' }
    ]
  },
  {
    id: '24',
    type: 'SITE_NOTIFICATION',
    category: 'site',
    title: '周末特殊开放通知',
    content: '应客户需求，北京亦庄新能源汽车测试中心本周六(9月14日)特殊开放，提供加班测试服务。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-09T18:20:00Z',
    relatedId: 'TS004',
    relatedType: 'SPECIAL_HOURS',
    actionRequired: false,
    specialHours: {
      date: '2025-04-14',
      hours: '09:00-15:00',
      surcharge: '加班费50%'
    },
    actions: [
      { label: '立即预约', action: 'book_weekend' }
    ]
  },

  // 更多设备类消息
  {
    id: '25',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备预约即将开始',
    content: '您预约的"电磁兼容测试设备"将于今天下午2点开始，请提前15分钟到达实验室进行设备检查。',
    priority: 'high',
    read: false,
    createdAt: '2025-04-12T12:00:00Z',
    relatedId: 'EQ006',
    relatedType: 'EQUIPMENT_REMINDER',
    actionRequired: false,
    appointmentTime: '2025-04-12T14:00:00Z',
    location: '电磁兼容实验室A303',
    actions: [
      { label: '查看路线', action: 'view_directions' },
      { label: '联系技术员', action: 'contact_technician' }
    ]
  },
  {
    id: '26',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备故障报告',
    content: '您上次使用的"转鼓试验台设备"在检查中发现异常，已暂停使用。如影响您的测试计划请联系客服。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-11T09:15:00Z',
    relatedId: 'EQ007',
    relatedType: 'EQUIPMENT_MALFUNCTION',
    actionRequired: false,
    faultDescription: '传感器读数异常',
    expectedRepairTime: '2-3个工作日',
    actions: [
      { label: '查看替代设备', action: 'view_alternatives' },
      { label: '联系客服', action: 'contact_service' }
    ]
  },
  {
    id: '27',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备使用培训通知',
    content: '新引进的"激光雷达标定设备"需要专业培训后才能使用。培训时间：9月16日上午9:00。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-10T08:45:00Z',
    relatedId: 'EQ008',
    relatedType: 'EQUIPMENT_TRAINING',
    actionRequired: true,
    trainingInfo: {
      date: '2025-04-16T09:00:00Z',
      duration: '2小时',
      location: '培训室B201',
      instructor: '张工程师'
    },
    actions: [
      { label: '报名参加', action: 'register_training' },
      { label: '查看课程大纲', action: 'view_curriculum' }
    ]
  },
  {
    id: '28',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备借用延期申请审批',
    content: '您申请延期使用"声学测试设备"的申请已通过，延期至9月20日。请按时归还避免影响其他用户。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-09T16:30:00Z',
    relatedId: 'EQ009',
    relatedType: 'EXTENSION_APPROVED',
    actionRequired: false,
    newReturnDate: '2025-04-20T17:00:00Z',
    actions: [
      { label: '确认知晓', action: 'acknowledge' }
    ]
  },
  {
    id: '29',
    type: 'EQUIPMENT_REMINDER',
    category: 'equipment',
    title: '设备预约取消通知',
    content: '由于设备临时故障，您预约的"碰撞试验台"(9月15日 10:00-12:00)已取消，费用将自动退还。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-08T14:20:00Z',
    relatedId: 'EQ010',
    relatedType: 'BOOKING_CANCELLED',
    actionRequired: false,
    refundAmount: 1500,
    refundMethod: '原路退回',
    actions: [
      { label: '重新预约', action: 'reschedule' },
      { label: '查看退款状态', action: 'check_refund' }
    ]
  },

  // 更多系统通知
  {
    id: '30',
    type: 'SYSTEM_NOTIFICATION',
    category: 'system',
    title: '移动应用更新提醒',
    content: '检测到新版本移动应用，包含性能优化和新功能。建议更新以获得更好的使用体验。',
    priority: 'low',
    read: false,
    createdAt: '2025-04-07T10:00:00Z',
    relatedId: 'APP_UPDATE_001',
    relatedType: 'APP_UPDATE',
    actionRequired: false,
    updateInfo: {
      version: 'v2.1.2',
      size: '12.5MB',
      newFeatures: ['通知推送优化', '界面美化', '性能提升'],
      bugFixes: 3
    },
    actions: [
      { label: '立即更新', action: 'update_app' },
      { label: '查看更新日志', action: 'view_changelog' }
    ]
  },

  // 更多财务通知
  {
    id: '31',
    type: 'FINANCIAL_NOTIFICATION',
    category: 'financial',
    title: '月度账单已生成',
    content: '您的9月份服务账单已生成，总金额12,350元。包含测试费用、设备租用费等，请及时查看。',
    priority: 'medium',
    read: false,
    createdAt: '2025-04-01T09:00:00Z',
    relatedId: 'BILL_2025_09',
    relatedType: 'MONTHLY_BILL',
    actionRequired: false,
    billDetails: {
      totalAmount: 12350,
      testingFees: 8500,
      equipmentRental: 2850,
      additionalServices: 1000
    },
    actions: [
      { label: '查看详单', action: 'view_bill_detail' },
      { label: '立即缴费', action: 'pay_bill' }
    ]
  },
  {
    id: '32',
    type: 'FINANCIAL_NOTIFICATION',
    category: 'financial',
    title: '优惠活动通知',
    content: '国庆节特惠活动：10月1日-10月7日期间，所有测试服务享受8.5折优惠，新用户更有额外折扣！',
    priority: 'low',
    read: false,
    createdAt: '2025-04-06T15:30:00Z',
    relatedId: 'PROMO_2025_10',
    relatedType: 'PROMOTION',
    actionRequired: false,
    promotionDetails: {
      discount: '15%',
      period: '2025-10-01至2025-10-07',
      newUserDiscount: '20%',
      terms: '不与其他优惠同享'
    },
    actions: [
      { label: '查看详情', action: 'view_promotion' },
      { label: '立即预约', action: 'book_with_discount' }
    ]
  }
];

// 快捷操作列表
export const mockQuickActions = [
  {
    id: '1',
    name: '预约保养',
    icon: 'calendar',
    route: '/new-appointment'
  },
  {
    id: '2',
    name: '故障报修',
    icon: 'tool',
    route: '/new-maintenance'
  },
  {
    id: '3',
    name: '测试申请',
    icon: 'experiment',
    route: '/test-tasks'
  }
];

// 天气信息
export const mockWeatherInfo = {
  temperature: 25,
  tempMin: 18,
  tempMax: 30,
  feelsLike: 27,
  weather: '晴',
  weatherCode: 'sunny',
  description: '晴朗无云，适合户外测试',
  humidity: 65,
  windSpeed: 12,
  windDirection: '东南风',
  windLevel: '3级',
  pressure: 1013,
  visibility: 15,
  uvIndex: 6,
  uvLevel: '强',
  aqi: 45,
  aqiLevel: '优',
  precipitation: 0,
  precipitationProbability: 5,
  sunrise: '06:15',
  sunset: '18:45',
  city: '上海',
  district: '浦东新区',
  updateTime: '2025-04-12T08:00:00Z',
  suitable: true,
  suitabilityReason: '天气晴朗，温度适宜，非常适合进行汽车测试',
  alerts: [],
  hourlyForecast: [
    { time: '09:00', temp: 22, weather: '晴', windSpeed: 10 },
    { time: '12:00', temp: 28, weather: '晴', windSpeed: 15 },
    { time: '15:00', temp: 30, weather: '多云', windSpeed: 18 },
    { time: '18:00', temp: 26, weather: '多云', windSpeed: 12 },
    { time: '21:00', temp: 21, weather: '晴', windSpeed: 8 }
  ],
  dailyForecast: [
    { 
      date: '2025-04-12', 
      tempMin: 18, 
      tempMax: 30, 
      weather: '晴', 
      suitable: true,
      description: '适合测试'
    },
    { 
      date: '2025-04-13', 
      tempMin: 20, 
      tempMax: 28, 
      weather: '多云', 
      suitable: true,
      description: '适合测试'
    },
    { 
      date: '2025-04-14', 
      tempMin: 16, 
      tempMax: 24, 
      weather: '小雨', 
      suitable: false,
      description: '不适合测试'
    }
  ]
};
