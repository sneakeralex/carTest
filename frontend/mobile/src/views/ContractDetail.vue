<template>
  <div class="contract-detail-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="合同详情"
      left-arrow
      @click-left="$router.back()"
    >
      <template #right>
        <van-switch
          :model-value="!contractStore.hideSensitive"
          size="24"
          @update:model-value="contractStore.toggleSensitive"
        >
          <template #node>
            <van-icon :name="contractStore.hideSensitive ? 'eye-o' : 'eye'" />
          </template>
        </van-switch>
      </template>
    </van-nav-bar>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" size="24px">加载中...</van-loading>
    </div>

    <!-- 合同详情 -->
    <template v-else-if="contract">
      <!-- 基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="合同编号" :value="contract.id" />
        <van-cell title="合同名称" :value="contract.name" />
        <van-cell title="合同类型" :value="getContractTypeText(contract.type)" />
        <van-cell title="签约单位" :value="contract.companyName" />
        <van-cell title="签约日期" :value="contract.signedAt" />
        <van-cell title="签约人" :value="contract.signedBy" />
        <van-cell title="生效日期" :value="contract.startDate" />
        <van-cell title="到期日期" :value="contract.endDate" />
        <van-cell title="合同状态">
          <template #default>
            <van-tag :type="getStatusType(contract.status)">
              {{ getStatusText(contract.status) }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 金额信息 -->
      <van-cell-group inset title="金额信息">
        <van-cell title="合同总额" :value="contractStore.formatAmount(contract.totalAmount)" />
        <van-cell title="折扣" :value="contractStore.formatDiscount(contract.discount)" />
      </van-cell-group>

      <!-- 服务条款 -->
      <van-cell-group inset title="服务条款">
        <van-cell
          v-for="(term, index) in contract.terms"
          :key="index"
          :title="term.item"
          :value="contractStore.formatAmount(term.price)"
        />
      </van-cell-group>

      <!-- 备注信息 -->
      <van-cell-group inset title="备注">
        <van-cell :value="contract.remarks || '无'" />
      </van-cell-group>
    </template>

    <!-- 空状态 -->
    <van-empty v-else description="未找到合同信息" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useContractStore } from '@/stores/contract';
import { showToast } from 'vant';

const route = useRoute();
const contractStore = useContractStore();

// 状态变量
const loading = ref(false);
const contract = computed(() => contractStore.currentContract);

// 获取合同详情
const fetchContractDetail = async () => {
  try {
    loading.value = true;
    const contractId = route.params.id;
    await contractStore.fetchContractById(contractId);
  } catch (error) {
    console.error('获取合同详情失败:', error);
    showToast('获取合同详情失败');
  } finally {
    loading.value = false;
  }
};

// 获取合同类型文本
const getContractTypeText = (type) => {
  const typeMap = {
    'SERVICE': '服务合同',
    'TEST': '测试合同',
    'PURCHASE': '采购合同'
  };
  return typeMap[type] || type;
};

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    'ACTIVE': 'success',
    'EXPIRED': 'warning',
    'TERMINATED': 'danger'
  };
  return typeMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    'ACTIVE': '生效中',
    'EXPIRED': '已到期',
    'TERMINATED': '已终止'
  };
  return textMap[status] || status;
};

// 初始化
fetchContractDetail();
</script>

<style lang="less" scoped>
.contract-detail-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

:deep(.van-cell-group) {
  margin: 12px 16px;
}

.van-switch {
  margin-right: 8px;
}
</style>
