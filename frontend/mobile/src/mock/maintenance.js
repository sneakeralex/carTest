import Mock from 'mockjs';
import { mockResponse } from './utils.js';

// 导入设备mock数据以便关联设备信息
import { mockEquipments } from './equipment.js';

// 生成带有完整设备信息的维护记录数据
const generateMaintenanceWithEquipment = () => {
  const maintenanceRecords = [];
  let idCounter = 1;
  
  // 为每个设备随机生成1-3条维护记录
  mockEquipments.forEach((equipment, index) => {
    const recordCount = Mock.Random.integer(1, 3);
    
    for (let i = 0; i < recordCount; i++) {
      const record = Mock.mock({
        'id': idCounter++, // 使用简单的递增数字ID
        'equipmentId': equipment.equipmentId,
        // 包含完整的设备信息
        'equipment': {
          'equipmentId': equipment.equipmentId,
          'equipmentNo': equipment.equipmentNo,
          'equipmentName': equipment.equipmentName,
          'equipmentType': equipment.equipmentType,
          'specification': equipment.specification,
          'manufacturer': equipment.manufacturer,
          'location': equipment.location,
          'departmentName': equipment.departmentName
        },
        'maintenanceType|1': ['校准', '保养', '维修', '检查', '更换零件'],
        'description': '@cparagraph(1, 2)',
        'maintenanceDate': '@date("yyyy-MM-dd")',
        'completionDate': '@date("yyyy-MM-dd")',
        'status|1': ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        'maintainer': '@cname',
        'cost|1000-10000': 1000,
        'nextMaintenanceDate': '@date("yyyy-MM-dd")',
        'remarks': '@cparagraph(1)',
        'attachments|0-3': ['@image("200x200", "@color", "附件")']
      });
      
      maintenanceRecords.push(record);
    }
  });
  
  // 按日期降序排序
  return maintenanceRecords.sort((a, b) => new Date(b.maintenanceDate) - new Date(a.maintenanceDate));
};

// 生成维护记录列表
const maintenanceList = generateMaintenanceWithEquipment();

// 获取维护记录列表
export function getMaintenances(config) {
  const records = maintenanceList;
  return mockResponse({
    records,
    total: records.length
  });
}

// 为了兼容不同的API调用名称
export function getMaintenanceRecords(config) {
  return getMaintenances(config);
}

// 获取单个维护记录详情
export function getMaintenanceById(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/maintenances\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的维护记录ID');
  }
  const id = parseInt(urlMatch[1]);
  console.log('🔍 查找维护记录ID:', id);
  // 查找维护记录
  let maintenance = maintenanceList.find(item => item.id === id);
  if (!maintenance) {
    // 如果找不到，返回一个默认mock对象而不是报错
    maintenance = {
      id,
      equipmentId: 1,
      equipment: mockEquipments[0],
      maintenanceType: '保养',
      description: '默认mock维护记录',
      maintenanceDate: '2025-09-23',
      completionDate: '2025-09-23',
      status: 'COMPLETED',
      maintainer: '系统管理员',
      cost: 1000,
      nextMaintenanceDate: '2025-12-23',
      remarks: '自动生成mock数据',
      attachments: []
    };
    console.log('🔍 未找到维护记录，返回默认mock:', maintenance);
  } else {
    console.log('🔍 找到的维护记录:', maintenance);
  }
  return mockResponse(maintenance);
}

// 创建维护记录
export function createMaintenance(config) {
  const newMaintenance = {
    ...JSON.parse(config.data),
    id: maintenanceList.length + 1
  };
  maintenanceList.push(newMaintenance);
  
  return mockResponse(newMaintenance);
}

// 更新维护记录
export function updateMaintenance(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/maintenances\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的维护记录ID');
  }
  
  const id = parseInt(urlMatch[1]);
  const updateData = JSON.parse(config.data);
  
  // 查找维护记录索引
  const index = maintenanceList.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('维护记录不存在');
  }
  
  maintenanceList[index] = {
    ...maintenanceList[index],
    ...updateData
  };
  
  return mockResponse(maintenanceList[index]);
}

// 删除维护记录
export function deleteMaintenance(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/maintenances\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的维护记录ID');
  }
  
  const id = parseInt(urlMatch[1]);
  
  // 查找维护记录索引
  const index = maintenanceList.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('维护记录不存在');
  }
  
  maintenanceList.splice(index, 1);
  
  return mockResponse({ message: '删除成功' });
}
