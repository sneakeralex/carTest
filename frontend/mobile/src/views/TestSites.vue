<template>
  <div class="test-sites-container">
    <!-- 搜索栏 -->
    <van-search
      v-model="searchKeyword"
      placeholder="搜索测试场"
      @search="onSearch"
      @clear="onClear"
    />
    
    <!-- 筛选条件 -->
    <div class="filter-bar">
      <van-dropdown-menu>
        <van-dropdown-item v-model="selectedCity" :options="cityOptions" @change="onFilterChange" />
        <van-dropdown-item v-model="selectedDistrict" :options="districtOptions" @change="onFilterChange" />
        <van-dropdown-item v-model="selectedTestType" :options="testTypeOptions" @change="onFilterChange" />
      </van-dropdown-menu>
    </div>
    
    <!-- 测试场列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="test-site-list">
          <van-card
            v-for="testSite in testSites"
            :key="testSite.siteId"
            :title="testSite.name"
            :desc="testSite.address"
            class="test-site-card"
            @click="goToTestSiteDetail(testSite.siteId)"
          >
            <template #thumb>
              <van-image
                width="100"
                height="80"
                fit="cover"
                :src="getTestSiteImage(testSite)"
              />
            </template>
            <template #tags>
              <van-tag 
                v-for="testType in testSite.testTypes" 
                :key="testType"
                plain 
                type="primary" 
                size="small"
                style="margin-right: 4px;"
              >
                {{ testType }}
              </van-tag>
            </template>
            <template #footer>
              <div class="test-site-info">
                <div class="info-row">
                  <van-icon name="location-o" />
                  <span>{{ testSite.district }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="clock-o" />
                  <span>{{ testSite.operatingHours }}</span>
                </div>
                <div class="info-row">
                  <van-icon name="star-o" />
                  <span>{{ testSite.rating || '暂无评分' }}</span>
                </div>
              </div>
              <div class="action-buttons">
                <van-button 
                  size="small" 
                  type="primary" 
                  @click.stop="bookTestSite(testSite)"
                >
                  立即预约
                </van-button>
              </div>
            </template>
          </van-card>
        </div>
      </van-list>
    </van-pull-refresh>
    
    <!-- 空状态 -->
    <van-empty v-if="!loading && testSites.length === 0" description="暂无测试场信息" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTestSiteStore } from '../stores/testSite';
import { showToast } from 'vant';

const router = useRouter();
const testSiteStore = useTestSiteStore();

// 响应式数据
const searchKeyword = ref('');
const testSites = ref([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

// 筛选条件
const selectedCity = ref('');
const selectedDistrict = ref('');
const selectedTestType = ref('');

// 筛选选项
const cityOptions = ref([
  { text: '全部城市', value: '' },
  { text: '北京', value: '北京' },
  { text: '上海', value: '上海' },
  { text: '广州', value: '广州' },
  { text: '深圳', value: '深圳' }
]);

const districtOptions = ref([
  { text: '全部区域', value: '' },
  { text: '朝阳区', value: '朝阳区' },
  { text: '海淀区', value: '海淀区' },
  { text: '丰台区', value: '丰台区' },
  { text: '昌平区', value: '昌平区' }
]);

const testTypeOptions = ref([
  { text: '全部类型', value: '' },
  { text: '性能测试', value: '性能测试' },
  { text: '安全测试', value: '安全测试' },
  { text: '环保测试', value: '环保测试' }
]);

// 分页参数
const pagination = reactive({
  page: 0,
  size: 10
});

// 获取测试场列表
const fetchTestSites = async (isRefresh = false) => {
  if (isRefresh) {
    pagination.page = 0;
    finished.value = false;
  }
  
  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      keyword: searchKeyword.value,
      city: selectedCity.value,
      district: selectedDistrict.value,
      testType: selectedTestType.value
    };
    
    const response = await testSiteStore.fetchTestSites(params);
    
    if (isRefresh) {
      testSites.value = response.content || [];
    } else {
      testSites.value.push(...(response.content || []));
    }
    
    // 检查是否还有更多数据
    if (!response.content || response.content.length < pagination.size) {
      finished.value = true;
    } else {
      pagination.page++;
    }
  } catch (error) {
    console.error('获取测试场列表失败:', error);
    showToast('获取测试场列表失败');
  }
};

// 页面加载
onMounted(() => {
  fetchTestSites(true);
});

// 下拉刷新
const onRefresh = async () => {
  refreshing.value = true;
  await fetchTestSites(true);
  refreshing.value = false;
};

// 上拉加载
const onLoad = async () => {
  if (finished.value) return;
  loading.value = true;
  await fetchTestSites();
  loading.value = false;
};

// 搜索
const onSearch = () => {
  fetchTestSites(true);
};

// 清空搜索
const onClear = () => {
  searchKeyword.value = '';
  fetchTestSites(true);
};

// 筛选条件变化
const onFilterChange = () => {
  fetchTestSites(true);
};

// 获取测试场图片
const getTestSiteImage = (testSite) => {
  // 这里可以根据测试场类型返回不同的图片
  return 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg';
};

// 跳转到测试场详情
const goToTestSiteDetail = (siteId) => {
  router.push(`/test-sites/${siteId}`);
};

// 预约测试场
const bookTestSite = (testSite) => {
  router.push({
    path: '/bookings/new',
    query: { testSiteId: testSite.siteId }
  });
};
</script>

<style lang="less" scoped>
.test-sites-container {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.filter-bar {
  background-color: #fff;
  border-bottom: 1px solid #ebedf0;
}

.test-site-list {
  padding: 16px;
}

.test-site-card {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  
  .test-site-info {
    margin-top: 8px;
    
    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      font-size: 12px;
      color: #969799;
      
      .van-icon {
        margin-right: 4px;
      }
    }
  }
  
  .action-buttons {
    margin-top: 12px;
    text-align: right;
  }
}
</style>
