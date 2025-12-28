import Mock from 'mockjs';
import { mockResponse } from './utils.js';

// 生成合同mock数据
const generateContractData = () => {
  const contracts = [];
  
  for (let i = 1; i <= 15; i++) {
    const contract = Mock.mock({
      'id': i,
      'contractNumber': `CT2025${String(i).padStart(3, '0')}`,
      'contractName': '@ctitle(5, 15)',
      'contractType|1': ['服务合同', '采购合同', '租赁合同', '维护合同', '技术支持合同'],
      'clientName': '@ctitle(3, 8)@pick(["科技有限公司", "实业有限公司", "贸易有限公司", "工程有限公司"])',
      'contactPerson': '@cname',
      'contactPhone': /1[3-9]\d{9}/,
      'contactEmail': '@email',
      'startDate': '@date("yyyy-MM-dd")',
      'endDate': '@date("yyyy-MM-dd")',
      'totalAmount': '@integer(50000, 1000000)',
      'paidAmount': '@integer(0, 50000)',
      'remainingAmount': function() {
        return this.totalAmount - this.paidAmount;
      },
      'discount|0.1': 0.85,
      'status|1': ['DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'EXPIRED'],
      'paymentTerms': '@pick(["月付", "季付", "半年付", "年付", "一次性付清"])',
      'description': '@cparagraph(1, 3)',
      'createdAt': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'updatedAt': '@datetime("yyyy-MM-dd HH:mm:ss")',
      'createdBy': '@cname',
      'department': '@ctitle(3, 6)部',
      'priority|1': ['HIGH', 'MEDIUM', 'LOW'],
      'attachments|0-5': [{
        'fileName': '@ctitle(3, 10).@pick(["pdf", "doc", "docx", "xlsx"])',
        'fileSize': '@integer(100, 5000)KB',
        'uploadDate': '@date("yyyy-MM-dd")'
      }],
      'milestones|1-5': [{
        'id|+1': 1,
        'name': '@ctitle(5, 10)',
        'dueDate': '@date("yyyy-MM-dd")',
        'status|1': ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        'amount': '@integer(5000, 50000)'
      }]
    });
    
    contracts.push(contract);
  }
  
  return contracts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// 生成合同列表
const contractList = generateContractData();

// 隐藏敏感信息的函数
const hideSensitiveInfo = (contract, hideSensitive = true) => {
  if (!hideSensitive) {
    return contract;
  }
  
  return {
    ...contract,
    totalAmount: '***',
    paidAmount: '***',
    remainingAmount: '***',
    discount: '***',
    contactPhone: contract.contactPhone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
    contactEmail: contract.contactEmail.replace(/(.{2}).*(@.*)/, '$1***$2')
  };
};

// 获取合同列表
export function getContracts(config) {
  const params = config.params || {};
  const hideSensitive = params.hideSensitive !== false; // 默认隐藏敏感信息
  
  const processedContracts = contractList.map(contract => 
    hideSensitiveInfo(contract, hideSensitive)
  );
  
  return mockResponse({
    data: processedContracts,
    total: processedContracts.length
  });
}

// 获取单个合同详情
export function getContractById(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/contracts\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的合同ID');
  }
  
  const id = parseInt(urlMatch[1]);
  const params = config.params || {};
  const hideSensitive = params.hideSensitive !== false; // 默认隐藏敏感信息
  
  console.log('🔍 查找合同ID:', id);
  
  // 查找合同
  const contract = contractList.find(item => item.id === id);
  
  console.log('🔍 找到的合同:', contract ? '存在' : '不存在');
  if (!contract) {
    console.log('🔍 可用的合同ID列表:', contractList.map(item => item.id).slice(0, 10));
    throw new Error('合同不存在');
  }
  
  const processedContract = hideSensitiveInfo(contract, hideSensitive);
  
  return mockResponse(processedContract);
}

// 创建合同
export function createContract(config) {
  const newContract = {
    ...JSON.parse(config.data),
    id: contractList.length + 1,
    contractNumber: `CT2025${String(contractList.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  
  contractList.push(newContract);
  
  return mockResponse(newContract);
}

// 更新合同
export function updateContract(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/contracts\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的合同ID');
  }
  
  const id = parseInt(urlMatch[1]);
  const updateData = JSON.parse(config.data);
  
  // 查找合同索引
  const index = contractList.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('合同不存在');
  }
  
  contractList[index] = {
    ...contractList[index],
    ...updateData,
    updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  
  return mockResponse(contractList[index]);
}

// 删除合同
export function deleteContract(config) {
  // 从URL中提取ID
  const urlMatch = config.url.match(/\/contracts\/([^/]+)/);
  if (!urlMatch) {
    throw new Error('无效的合同ID');
  }
  
  const id = parseInt(urlMatch[1]);
  
  // 查找合同索引
  const index = contractList.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('合同不存在');
  }
  
  contractList.splice(index, 1);
  
  return mockResponse({ message: '删除成功' });
}
