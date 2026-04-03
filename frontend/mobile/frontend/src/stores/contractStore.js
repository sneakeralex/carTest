import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getContracts, getContractById } from '../api/contract';

export const useContractStore = defineStore('contract', () => {
  const contracts = ref([]);
  const currentContract = ref(null);
  const isLoading = ref(false);
  const hideSensitive = ref(true);

  // 格式化金额
  const formatAmount = (amount) => {
    if (hideSensitive.value && amount !== '***') {
      return '***';
    }
    return typeof amount === 'number' 
      ? `¥${amount.toLocaleString('zh-CN')}` 
      : amount;
  };

  // 格式化折扣
  const formatDiscount = (discount) => {
    if (hideSensitive.value && discount !== '***') {
      return '***';
    }
    return typeof discount === 'number'
      ? `${(discount * 100).toFixed(1)}%`
      : discount;
  };

  // 获取合同列表
  const fetchContracts = async () => {
    try {
      isLoading.value = true;
      const response = await getContracts({ hideSensitive: hideSensitive.value });
      contracts.value = response.data;
    } catch (error) {
      console.error('获取合同列表失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 获取合同详情
  const fetchContractById = async (id) => {
    try {
      isLoading.value = true;
      const response = await getContractById(id, hideSensitive.value);
      currentContract.value = response.data;
    } catch (error) {
      console.error('获取合同详情失败:', error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // 切换敏感信息显示状态
  const toggleSensitiveInfo = () => {
    hideSensitive.value = !hideSensitive.value;
    // 重新获取数据以更新显示
    if (currentContract.value) {
      fetchContractById(currentContract.value.id);
    } else {
      fetchContracts();
    }
  };

  return {
    contracts,
    currentContract,
    isLoading,
    hideSensitive,
    formatAmount,
    formatDiscount,
    fetchContracts,
    fetchContractById,
    toggleSensitiveInfo
  };
});
