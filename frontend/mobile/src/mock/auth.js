// 模拟用户数据
export const mockUsers = [
  {
    userId: '1',
    employeeId: 'EMP20250101001', // 工号
    username: 'admin',
    name: '管理员',
    phone: '13800138000',
    email: 'admin@example.com',
    idCard: '310123199001010101', // 身份证号
    role: 'ADMIN',
    department: '车辆检测中心', // 部门
    position: '高级检测工程师', // 职位
    hireDate: '2025-01-01', // 入职日期
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test_user',
    faceInfo: {
      faceId: 'FACE001',
      faceImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=face_test_user',
      registeredAt: '2025-01-01T09:00:00Z',
      lastUpdatedAt: '2025-04-15T14:30:00Z',
      confidenceScore: 0.98,
      status: 'VERIFIED'
    },
    personalInfo: {
      gender: '男',
      birthDate: '1990-01-01',
      education: '硕士',
      major: '车辆工程',
      graduatedFrom: '上海交通大学',
      graduationYear: '2014',
      address: '上海市浦东新区张江高科技园区智能汽车产业园A栋',
      bloodType: 'A',
      maritalStatus: '已婚',
      emergency: {
        contactName: '王梅',
        contactPhone: '13900139000',
        relationship: '配偶',
        address: '上海市浦东新区世纪大道1号'
      }
    },
    certifications: [
      {
        name: '高级汽车检测工程师证书',
        number: 'CERT20250101001',
        issueDate: '2025-01-01',
        expiryDate: '2028-01-01',
        issuingAuthority: '上海市汽车工程师协会',
        level: '高级',
        score: 92
      },
      {
        name: '新能源汽车技术认证',
        number: 'NEV20240601002',
        issueDate: '2024-06-01',
        expiryDate: '2027-06-01',
        issuingAuthority: '中国汽车工程学会',
        level: '专家级',
        score: 95
      },
      {
        name: 'ADAS系统测试认证',
        number: 'ADAS20230901003',
        issueDate: '2023-09-01',
        expiryDate: '2026-09-01',
        issuingAuthority: '智能网联汽车创新中心',
        level: '高级',
        score: 88
      }
    ],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-04-10T00:00:00Z'
  }
];

// 保存用户登录状态
export const mockAuth = {
  currentUser: null,
  token: null
};

// 默认用户凭证
export const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '123456'
};
