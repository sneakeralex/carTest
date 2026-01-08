import Mock from 'mockjs';
import { getQueryParams, mockResponse, MockApiError } from './utils.js';

// No mock equipments — UI will render empty state when backend has no equipment data.
export const mockEquipments = [];
export const mockEquipmentApplications = [];

// 生成测试设备数据
const generateEquipmentList = (params = {}) => {
  const pageSize = params.size || 20;
  const page = params.page || 1;
  const total = 85; // 总记录数

  // 生成所有设备数据
  const allEquipments = Mock.mock({
    [`list|${total}`]: [{
      'equipmentId|+1': 1,
      'equipmentNo': /EQ[A-Z]{2}\d{4}/,
      'equipmentName': '@ctitle(3, 8)',
      'equipmentType|1': ['压力测试仪', '温度检测仪', '电压表', '万用表', '示波器', '信号发生器', '专用工具', '其他设备'],
      'specification': '@string("upper", 2, 2)@natural(100, 999)',
      'manufacturer': '@ctitle(3, 8)科技有限公司',
      'purchaseDate': '@date("yyyy-MM-dd")',
      'status|1': ['IN_USE', 'IDLE', 'MAINTENANCE', 'RETIRED'],
      'location': '@ctitle(5, 10)实验室',
      'departmentName': '@ctitle(3, 6)部',
      'description': '@cparagraph(1, 2)',
      'maintenanceCycle': '@integer(30, 180)',
      'lastMaintenanceDate': '@date("yyyy-MM-dd")',
      'responsiblePerson': '@cname',
      'contactInfo': /1[3-9]\d{9}/,
      'purchasePrice': '@float(1000, 100000, 2, 2)'
    }]
  }).list;

  // 应用筛选
  let filteredList = [...allEquipments];
  
  if (params.status) {
    filteredList = filteredList.filter(item => item.status === params.status);
  }
  
  if (params.type) { // Changed from equipmentType to type to match frontend params
    filteredList = filteredList.filter(item => item.equipmentType === params.type);
  }
  
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    filteredList = filteredList.filter(item => 
      item.equipmentName.toLowerCase().includes(keyword) ||
      item.equipmentNo.toLowerCase().includes(keyword)
    );
  }

  // 计算分页
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const records = filteredList.slice(start, end);

  return {
    records: records,
    total: filteredList.length,
    page: page,
    pageSize: pageSize
  };
};

// 生成测试设备申请记录数据
const equipmentApplicationList = Mock.mock({
  'list|15-30': [{
    'id|+1': 1,
    'equipmentId|1-20': 1,
    'equipmentName|1': [
      '高精度示波器',
      '电池测试系统',
      '动力测试台',
      '环境测试箱',
      '噪音测试仪',
      '振动测试台',
      '电机测试仪',
      '续航里程测试仪'
    ],
    'equipmentCode': /EQ[A-Z]{2}\d{4}/,
    'applyType|1': ['BORROW', 'USE'],
    'duration|1-7': 1,
    'startTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'endTime': function() {
      const start = new Date(this.startTime);
      const end = new Date(start);
      end.setDate(start.getDate() + this.duration);
      return end.toISOString().split('.')[0].replace('T', ' ');
    },
    'location|1': [
      '新能源实验室',
      '动力系统实验室',
      '电池测试实验室',
      '整车测试场',
      '环境模拟实验室',
      '性能测试实验室'
    ],
    'purpose|1': [
      '新能源汽车动力系统测试',
      '电池性能测试与分析',
      '整车性能测试',
      '环境适应性测试',
      '噪声与振动测试',
      '续航能力测试'
    ],
    'remarks': function() {
      return `预计使用${this.duration}天，用于${this.purpose}项目`;
    },
    'status': function() {
      const statuses = [
        { value: 'PENDING', weight: 3 },
        { value: 'APPROVED', weight: 4 },
        { value: 'REJECTED', weight: 1 },
        { value: 'CANCELLED', weight: 1 }
      ];
      const totalWeight = statuses.reduce((sum, status) => sum + status.weight, 0);
      let random = Math.random() * totalWeight;
      
      for (const status of statuses) {
        random -= status.weight;
        if (random <= 0) {
          return status.value;
        }
      }
      return statuses[0].value;
    },
    'applicantId': '@natural(1, 100)',
    'applicantName': '@cname',
    'applyTime': '@datetime("yyyy-MM-dd HH:mm:ss")',
    'approverName': '@cname',
    'approveTime': function() {
      const applyTime = new Date(this.applyTime);
      const approve = new Date(applyTime);
      approve.setHours(applyTime.getHours() + Mock.Random.natural(1, 48));
      return approve.toISOString().split('.')[0].replace('T', ' ');
    },
    'approveRemarks|1': [
      '同意申请，请按时归还',
      '批准使用，注意安全操作',
      '已审核通过，请遵守使用规范',
      '申请未通过，设备已被预约',
      '设备正在维护中，暂不可用',
      '申请信息不完整，请补充'
    ]
  }]
}).list;

// 获取设备列表
export function getEquipments(config) {
  const params = getQueryParams(config.url);
  const result = generateEquipmentList(params);
  return mockResponse(result);
}

// 获取单个设备详情
export function getEquipmentById(config) {
  const id = parseInt(config.url.match(/\/equipments\/(\d+)/)[1]);
  const equipment = equipmentList.find(item => item.equipmentId === id);
  
  if (!equipment) {
    throw new MockApiError('设备不存在', 404);
  }
  
  return mockResponse(equipment);
}

// 创建设备
export function createEquipment(config) {
  const maxId = Math.max(...equipmentList.map(e => e.equipmentId));
  const newEquipment = {
    ...JSON.parse(config.data),
    equipmentId: maxId + 1,
    equipmentNo: `EQ${Mock.Random.string('upper', 2)}${String(maxId + 1).padStart(4, '0')}`
  };
  equipmentList.push(newEquipment);
  
  return mockResponse(newEquipment);
}

// 更新设备
export function updateEquipment(config) {
  const id = parseInt(config.url.match(/\/equipments\/(\d+)/)[1]);
  const updateData = JSON.parse(config.data);
  const index = equipmentList.findIndex(item => item.equipmentId === id);
  
  if (index === -1) {
    throw new MockApiError('设备不存在', 404);
  }
  
  equipmentList[index] = {
    ...equipmentList[index],
    ...updateData
  };
  
  return mockResponse(equipmentList[index]);
}

// 获取设备申请记录列表
export function getEquipmentApplications(config) {
  const { page = 1, pageSize = 10, status, applicantId } = getQueryParams(config.url);
  let filteredList = [...equipmentApplicationList];
  
  // 按状态筛选
  if (status) {
    filteredList = filteredList.filter(item => item.status === status);
  }
  
  // 按申请人筛选
  if (applicantId) {
    filteredList = filteredList.filter(item => item.applicantId === parseInt(applicantId));
  }
  
  // 按时间倒序排序
  filteredList.sort((a, b) => new Date(b.applyTime) - new Date(a.applyTime));
  
  const total = filteredList.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return mockResponse({
    records: filteredList.slice(start, end),
    total,
    page: Number(page),
    pageSize: Number(pageSize)
  });
}

// 获取单个设备申请记录详情
export function getEquipmentApplicationById(config) {
  const id = parseInt(config.url.match(/\/equipment-applications\/(\d+)/)[1]);
  const application = equipmentApplicationList.find(item => item.id === id);
  
  if (!application) {
    throw new MockApiError('申请记录不存在', 404);
  }
  
  return mockResponse(application);
}

// 提交设备申请
export function applyEquipment(config) {
  const applyData = JSON.parse(config.data);
  const equipment = equipmentList.find(item => item.id === applyData.equipmentId);
  
  if (!equipment) {
    throw new Error('设备不存在');
  }
  
  if (equipment.status !== 'IDLE') {
    throw new Error('设备当前不可申请');
  }
  
  const newApplication = {
    ...applyData,
    id: equipmentApplicationList.length + 1,
    equipmentName: equipment.name,
    equipmentCode: equipment.code,
    status: 'PENDING',
    applicantId: 1, // 当前登录用户ID
    applicantName: '张三', // 当前登录用户名
    applyTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
  };
  
  equipmentApplicationList.push(newApplication);
  equipment.status = 'IN_USE';
  
  return mockResponse(newApplication);
}

// 更新申请状态
export function updateApplicationStatus(config) {
  const id = parseInt(config.url.match(/\/equipment-applications\/(\d+)\/status/)[1]);
  const { status, remarks } = JSON.parse(config.data);
  const application = equipmentApplicationList.find(item => item.id === id);
  
  if (!application) {
    throw new Error('申请记录不存在');
  }
  
  application.status = status;
  application.approveRemarks = remarks;
  application.approverName = '李四'; // 当前审批人
  application.approveTime = Mock.Random.datetime('yyyy-MM-dd HH:mm:ss');
  
  // 如果拒绝或取消申请，将设备状态改回空闲
  if (status === 'REJECTED' || status === 'CANCELLED') {
    const equipment = equipmentList.find(item => item.id === application.equipmentId);
    if (equipment) {
      equipment.status = 'IDLE';
    }
  }
  
  return mockResponse(application);
}

// 创建设备申请记录
export function createEquipmentApplication(config) {
  const data = JSON.parse(config.data);
  const newApplication = {
    ...data,
    id: equipmentApplicationList.length + 1,
    status: 'PENDING',
    applyTime: new Date().toISOString().split('.')[0].replace('T', ' ')
  };
  
  equipmentApplicationList.push(newApplication);
  return mockResponse(newApplication);
}

// 更新设备申请记录状态
export function updateEquipmentApplicationStatus(config) {
  const id = parseInt(config.url.match(/\/equipment-applications\/(\d+)\/status/)[1]);
  const { status, approveRemarks } = JSON.parse(config.data);
  const index = equipmentApplicationList.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new MockApiError('申请记录不存在', 404);
  }
  
  equipmentApplicationList[index] = {
    ...equipmentApplicationList[index],
    status,
    approveRemarks,
    approveTime: new Date().toISOString().split('.')[0].replace('T', ' ')
  };
  
  return mockResponse(equipmentApplicationList[index]);
}

// 注册Mock接口
Mock.mock(/\/api\/equipments(\?.*)?$/, 'get', getEquipments);
Mock.mock(/\/api\/equipments\/\d+$/, 'get', getEquipmentById);
Mock.mock('/api/equipments', 'post', createEquipment);
Mock.mock(/\/api\/equipments\/\d+$/, 'put', updateEquipment);
Mock.mock(/\/api\/equipment-applications(\?.*)?$/, 'get', getEquipmentApplications);
Mock.mock(/\/api\/equipment-applications\/\d+$/, 'get', getEquipmentApplicationById);
Mock.mock('/api/equipment-applications', 'post', createEquipmentApplication);
Mock.mock(/\/api\/equipment-applications\/\d+\/status$/, 'put', updateEquipmentApplicationStatus);
