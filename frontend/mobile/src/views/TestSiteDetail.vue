<template>
  <div class="test-site-detail">
    <!-- 导航栏 -->
    <van-nav-bar
      title="测试场详情"
      left-text="返回"
      left-arrow
      @click-left="goBack"
    />

    <!-- 加载状态 -->
    <van-loading v-if="loading" class="loading-container" vertical>
      加载中...
    </van-loading>

    <!-- 测试场详情内容 -->
    <div v-else-if="testSite" class="detail-content">
      <!-- 测试场基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-cell title="测试场名称" :value="testSite.name" />
        <van-cell title="地址" :value="testSite.address" />
        <van-cell title="联系电话" :value="testSite.phone" />
        <van-cell title="营业时间" :value="testSite.businessHours" />
        <van-cell title="状态">
          <template #value>
            <van-tag :type="getStatusType(testSite.status)">
              {{ getStatusText(testSite.status) }}
            </van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 测试场设施 -->
      <van-cell-group inset title="测试设施" v-if="testSite.facilities">
        <van-cell
          v-for="facility in testSite.facilities"
          :key="facility.id"
          :title="facility.name"
          :label="facility.description"
        >
          <template #right-icon>
            <van-tag v-if="facility.available" type="success">可用</van-tag>
            <van-tag v-else type="danger">不可用</van-tag>
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 测试项目 -->
      <van-cell-group inset title="可测试项目" v-if="testSite.testItems">
        <van-cell
          v-for="item in testSite.testItems"
          :key="item.id"
          :title="item.name"
          :label="item.description"
          :value="`¥${item.price}`"
        />
      </van-cell-group>

      <!-- 预约按钮 -->
      <div class="action-buttons">
        <van-button
          type="primary"
          size="large"
          block
          @click="makeAppointment"
          :disabled="testSite.status !== 'ACTIVE'"
        >
          立即预约
        </van-button>
      </div>
    </div>

    <!-- 错误状态 -->
    <van-empty v-else description="测试场信息不存在" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTestSiteStore } from '../stores/testSite';
import { showToast } from 'vant';

const route = useRoute();
const router = useRouter();
const testSiteStore = useTestSiteStore();

// 响应式数据
const loading = ref(true);
const testSite = ref(null);

// 获取测试场详情
const fetchTestSiteDetail = async () => {
  try {
    loading.value = true;
    const siteId = route.params.id;
    const data = await testSiteStore.fetchTestSiteDetail(siteId);
    testSite.value = data;
  } catch (error) {
    console.error('获取测试场详情失败:', error);
    showToast('获取测试场详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回上一页
const goBack = () => {
  router.back();
};

// 获取状态类型
const getStatusType = (status) => {
  const statusMap = {
    'ACTIVE': 'success',
    'INACTIVE': 'warning',
    'MAINTENANCE': 'danger'
  };
  return statusMap[status] || 'default';
};

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'ACTIVE': '正常营业',
    'INACTIVE': '暂停营业',
    'MAINTENANCE': '维护中'
  };
  return statusMap[status] || '未知';
};

// 预约测试场
const makeAppointment = () => {
  router.push({
    name: 'NewTestConsultationAppointment',
    query: { testSiteId: testSite.value.id }
  });
};

// 组件挂载时获取数据
onMounted(() => {
  fetchTestSiteDetail();
});
</script>

<style lang="less" scoped>
.test-site-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.detail-content {
  padding-bottom: 80px;
}

.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #fff;
  border-top: 1px solid #ebedf0;
}
</style>
