import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getContracts, getContractById } from '../api/contract.js';

export const useContractStore = defineStore('contract', () => {
  // 状态
  const contracts = ref([]);
  const currentContract = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const hideSensitive = ref(true); // 添加敏感信息显示控制状态

  // 获取合同列表
  const fetchContracts = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getContracts({ hideSensitive: hideSensitive.value });
      contracts.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取合同列表失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 获取合同详情
  const fetchContractById = async (contractId) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getContractById(contractId, hideSensitive.value);
      currentContract.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取合同详情失败';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // 格式化金额显示
  const formatAmount = (amount) => {
    if (amount === '***') return amount;
    return typeof amount === 'number' 
      ? `¥${amount.toLocaleString()}` 
      : amount;
  };

  // 格式化折扣显示
  const formatDiscount = (discount) => {
    if (discount === '***') return discount;
    return typeof discount === 'number'
      ? `${(discount * 100).toFixed(0)}%`
      : discount;
  };

  // 切换敏感信息显示状态
  const toggleSensitive = async () => {
    hideSensitive.value = !hideSensitive.value;
    if (currentContract.value) {
      await fetchContractById(currentContract.value.id);
    } else {
      await fetchContracts();
    }
  };

  return {
    contracts,
    currentContract,
    loading,
    error,
    hideSensitive,
    fetchContracts,
    fetchContractById,
    formatAmount,
    formatDiscount,
    toggleSensitive
  };
});
