<template>
  <div class="contracts-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="合同管理"
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

    <!-- 搜索栏 -->
    <div class="search-bar">
      <van-search
        v-model="searchKeyword"
        placeholder="搜索合同名称或单位"
        @search="onSearch"
      />
    </div>

    <!-- 合同列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell-group inset v-for="contract in filteredContracts" :key="contract.id">
          <van-cell
            :title="contract.contractName || contract.name"
            :label="contract.partyB || '合同乙方'"
            is-link
            @click="goToDetail(contract)"
          >
            <template #value>
              <van-tag :type="getStatusType(contract.status)">
                {{ getStatusText(contract.status) }}
              </van-tag>
            </template>
          </van-cell>
          <van-cell title="合同类型" :value="contract.templateTypeName || contract.typeName || contract.type" />
          <van-cell title="甲方" :value="contract.partyA" />
          <van-cell title="创建时间">
            <template #value>
              {{ formatDateTime(contract.createTime) }}
            </template>
          </van-cell>
        </van-cell-group>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useContractStore } from '@/stores/contract';
import { showToast } from 'vant';

const router = useRouter();
const contractStore = useContractStore();

// 状态变量
const searchKeyword = ref('');
const refreshing = ref(false);
const loading = ref(false);
const finished = ref(false);

// 获取合同列表
const fetchContracts = async () => {
  try {
    loading.value = true;
    await contractStore.fetchContracts();
  } catch (error) {
    console.error('获取合同列表失败:', error);
    showToast('获取合同列表失败');
  } finally {
    loading.value = false;
    finished.value = true;
  }
};

// 计算过滤后的合同列表
const filteredContracts = computed(() => {
  const contracts = contractStore.contracts;
  if (!searchKeyword.value) return contracts;
  
  const keyword = searchKeyword.value.toLowerCase();
  return contracts.filter(contract =>
    (contract.contractName && contract.contractName.toLowerCase().includes(keyword)) ||
    (contract.name && contract.name.toLowerCase().includes(keyword)) ||
    (contract.partyA && contract.partyA.toLowerCase().includes(keyword)) ||
    (contract.partyB && contract.partyB.toLowerCase().includes(keyword))
  );
});

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
    'TERMINATED': '已终止',
    '1': '生效中',
    '0': '已失效'
  };
  return textMap[status] || status || '未知状态';
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 跳转到详情页
const goToDetail = (contract) => {
  router.push(`/contract/${contract.id}`);
};

// 搜索
const onSearch = () => {
  // 搜索通过 computed 属性自动完成
};

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  try {
    await fetchContracts();
  } finally {
    refreshing.value = false;
  }
};

// 加载更多
const onLoad = async () => {
  if (!contractStore.contracts.length) {
    await fetchContracts();
  }
  finished.value = true;
};

// 初始化
onLoad();
</script>

<style lang="less" scoped>
.contracts-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.search-bar {
  padding: 8px;
  background-color: #fff;
}

:deep(.van-cell-group) {
  margin: 8px 16px;
}

.van-switch {
  margin-right: 8px;
}
</style>
