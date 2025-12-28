// 模拟车辆数据
export const mockVehicles = [
  {
    vehicleId: 'V001',
    licensePlate: '沪A88888',
    brand: '特斯拉',
    model: 'Model 3',
    year: '2024',
    type: 'NEW_ENERGY',
    category: 'SEDAN',
    color: '珍珠白',
    engineNumber: 'EN123456',
    chassisNumber: 'CN123456',
    status: 'ACTIVE',
    currentMileage: 12500,
    lastMaintenanceDate: '2025-04-01',
    nextMaintenanceDue: '2025-11-15',
    testHistory: [
      {
        testId: 'TT001',
        testType: 'PERFORMANCE_TEST',
        testDate: '2025-04-02',
        result: 'PASSED',
        notes: '电池性能测试通过'
      }
    ],
    specifications: {
      length: 4694,
      width: 1850,
      height: 1443,
      wheelbase: 2875,
      weight: 1840,
      maxSpeed: 225,
      acceleration: 5.6
    },
    features: [
      'AUTO_PILOT',
      'BATTERY_HEATING',
      'FAST_CHARGING'
    ],
    description: '高性能电动汽车，搭载最新自动驾驶系统',
    images: [
      'https://example.com/tesla1.jpg',
      'https://example.com/tesla2.jpg'
    ],
    documents: [
      {
        type: 'INSURANCE',
        number: 'INS202501',
        expireDate: '2026-01-01',
        status: 'VALID'
      },
      {
        type: 'REGISTRATION',
        number: 'REG202501',
        expireDate: '2026-01-01',
        status: 'VALID'
      }
    ],
    userId: 'USER001',
    owner: {
      name: '张三',
      phone: '13800138000',
      email: 'zhangsan@example.com'
    },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z'
  },
  {
    vehicleId: '2',
    licensePlate: '京B99999',
    brand: '比亚迪',
    model: '汉',
    year: '2024',
    color: '黑色',
    engineNumber: 'EN234567',
    chassisNumber: 'CN234567',
    status: 'ACTIVE',
    description: '新能源汽车',
    images: [
      'https://example.com/byd1.jpg',
      'https://example.com/byd2.jpg'
    ],
    userId: '1',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z'
  },
  {
    vehicleId: '3',
    licensePlate: '沪C12345',
    brand: '小鹏',
    model: 'P7',
    year: '2025',
    color: '深海蓝',
    engineNumber: 'EN345678',
    chassisNumber: 'CN345678',
    status: 'ACTIVE',
    description: '智能电动轿车',
    images: [
      'https://example.com/xpeng1.jpg',
      'https://example.com/xpeng2.jpg'
    ],
    userId: '1',
    createdAt: '2025-03-15T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z'
  },
  {
    vehicleId: '4',
    licensePlate: '京D54321',
    brand: '理想',
    model: 'L9',
    year: '2025',
    color: '皓月银',
    engineNumber: 'EN456789',
    chassisNumber: 'CN456789',
    status: 'ACTIVE',
    description: '大型智能SUV',
    images: [
      'https://example.com/li1.jpg',
      'https://example.com/li2.jpg'
    ],
    userId: '1',
    createdAt: '2025-04-20T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z'
  },
  {
    vehicleId: '5',
    licensePlate: '沪E67890',
    brand: '蔚来',
    model: 'ET7',
    year: '2025',
    color: '星云紫',
    engineNumber: 'EN567890',
    chassisNumber: 'CN567890',
    status: 'MAINTENANCE',
    description: '豪华智能轿车',
    images: [
      'https://example.com/nio1.jpg',
      'https://example.com/nio2.jpg'
    ],
    userId: '1',
    createdAt: '2025-05-25T00:00:00Z',
    updatedAt: '2025-09-10T00:00:00Z'
  }
];

// 模拟图片上传响应
export const mockImageUpload = {
  url: 'https://example.com/uploaded-image.jpg',
  filename: 'vehicle-image.jpg',
  size: 1024 * 1024,
  type: 'image/jpeg'
};
