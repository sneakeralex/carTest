import * as contractMock from '../mock/contract.js';
import { artemisRequest } from './request';
import { CONTRACT_API } from './config.js';
// import { generateArtemisAuthHeaders } from '../../artemis_sign.js';

// 判断是否使用mock数据
const useMock = false; // Changed to false to prefer real API

// 模拟API响应延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock response format
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

/**
 * 获取合同列表
 * @param {Object} params - 查询参数
 * @param {boolean} params.hideSensitive - 是否隐藏敏感信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getContracts(params = {}) {
  if (useMock) {
    console.log('🔄 合同API: 使用Mock数据获取列表');
    await delay(300);
    try {
      const result = contractMock.getContracts({ 
        url: '/contracts', 
        method: 'get',
        params 
      });
      console.log('✅ 合同API: Mock列表数据返回', result);
      // Transform mock response to match real API format
      return {
        data: {
          content: result.data.data || [],
          totalElements: result.data.total || 0,
          totalPages: Math.ceil((result.data.total || 0) / (params.pageSize || 20)),
          number: (params.pageNum || 1) - 1,
          size: params.pageSize || 20,
          first: (params.pageNum || 1) === 1,
          last: (params.pageNum || 1) >= Math.ceil((result.data.total || 0) / (params.pageSize || 20))
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    } catch (error) {
      console.error('❌ 合同API: Mock列表数据错误', error);
      return {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    }
  }

  try {
    const requestBody = {
      contractName: params.contractName || '',
      partyA: params.partyA || '',
      partyB: params.partyB || '',
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 20
    };

    // Use centralized artemisRequest to route via local proxy and apply Authorization
    const res = await artemisRequest(CONTRACT_API.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(requestBody)
    });

    const result = res?.data;

    console.log('获取合同列表原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取合同列表失败');
    }

    // Transform response to expected format based on actual API response
    const contracts = (result.data?.list || result.data?.contracts || result.data || []).map(contract => ({
      id: contract.id,
      name: contract.contractName || contract.name,
      contractName: contract.contractName,
      contractNumber: contract.contractNumber,
      title: contract.contractName || contract.title,
      type: contract.templateType || contract.type,
      typeName: contract.templateTypeName || contract.typeName,
      status: contract.status || 'ACTIVE',
      amount: contract.amount,
      totalAmount: contract.totalAmount || contract.amount,
      startDate: contract.startDate,
      endDate: contract.endDate,
      partyA: contract.partyA,
      partyB: contract.partyB,
      companyName: contract.partyA || contract.companyName,
      templateId: contract.templateId,
      description: contract.description,
      createBy: contract.createBy,
      createTime: contract.createTime,
      updateBy: contract.updateBy,
      updateTime: contract.updateTime,
      createdAt: contract.createTime || contract.createdAt,
      updatedAt: contract.updateTime || contract.updatedAt,
      dataValid: contract.dataValid,
      // Hide sensitive info if requested
      ...(params.hideSensitive ? {} : {
        sensitiveData: contract.sensitiveData
      })
    }));

    return {
      data: contracts,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取合同列表失败，使用mock数据:', error);
    // Fallback to mock
    console.log('🔄 合同API: 使用Mock数据获取列表');
    await delay(300);
    try {
      const result = contractMock.getContracts({ 
        url: '/contracts', 
        method: 'get',
        params 
      });
      console.log('✅ 合同API: Mock列表数据返回', result);
      // Transform mock response to match real API format
      return {
        data: {
          content: result.data.data || [],
          totalElements: result.data.total || 0,
          totalPages: Math.ceil((result.data.total || 0) / (params.pageSize || 20)),
          number: (params.pageNum || 1) - 1,
          size: params.pageSize || 20,
          first: (params.pageNum || 1) === 1,
          last: (params.pageNum || 1) >= Math.ceil((result.data.total || 0) / (params.pageSize || 20))
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    } catch (mockError) {
      console.error('❌ 合同API: Mock列表数据错误', mockError);
      return {
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {}
      };
    }
  }
}

/**
 * 根据ID获取合同详情
 * @param {number|string} contractId - 合同ID
 * @param {boolean} hideSensitive - 是否隐藏敏感信息
 * @returns {Promise} - 返回Promise对象
 */
export async function getContractById(contractId, hideSensitive = true) {
  if (useMock) {
    console.log('🔄 合同API: 获取详情使用Mock数据, ID:', contractId);
    await delay(300);
    try {
      const result = contractMock.getContractById({ 
        url: `/contracts/${contractId}`, 
        method: 'get',
        params: { hideSensitive }
      });
      console.log('✅ 合同API: Mock详情数据返回', result);
      return result;
    } catch (error) {
      console.error('❌ 合同API: Mock详情数据错误', error);
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {}
      };
    }
  }

  try {
    const requestBody = {
      id: contractId
    };

    const res = await artemisRequest(CONTRACT_API.DETAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        'Accept-Encoding': 'identity'
      },
      body: JSON.stringify(requestBody)
    });

    const result = res?.data;

    console.log('获取合同详情原始API响应:', JSON.stringify(result, null, 2));

    if (result.code !== '0' && result.code !== 200) {
      throw new Error(result.msg || '获取合同详情失败');
    }

    // Transform response
    const contract = result.data;
    const transformedContract = {
      id: contract.id || contract.contractId,
      contractNumber: contract.contractNumber,
      title: contract.title,
      type: contract.type,
      status: contract.status,
      amount: contract.amount,
      startDate: contract.startDate,
      endDate: contract.endDate,
      partyA: contract.partyA,
      partyB: contract.partyB,
      description: contract.description,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      // Hide sensitive info if requested
      ...(hideSensitive ? {} : {
        sensitiveData: contract.sensitiveData
      })
    };

    return {
      data: transformedContract,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取合同详情失败，使用mock数据:', error);
    // Fallback to mock
    console.log('🔄 合同API: 获取详情使用Mock数据, ID:', contractId);
    await delay(300);
    try {
      const result = contractMock.getContractById({ 
        url: `/contracts/${contractId}`, 
        method: 'get',
        params: { hideSensitive }
      });
      console.log('✅ 合同API: Mock详情数据返回', result);
      return result;
    } catch (mockError) {
      console.error('❌ 合同API: Mock详情数据错误', mockError);
      return {
        data: null,
        status: 404,
        statusText: 'Not Found',
        headers: {},
        config: {}
      };
    }
  }
}
