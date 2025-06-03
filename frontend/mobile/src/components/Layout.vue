<template>
  <div class="layout-container">
    <!-- 主内容区域 -->
    <div class="content-container">
      <router-view />
    </div>
    
    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item 
        v-for="(item, index) in tabbarItems" 
        :key="index"
        :to="item.path"
        :icon="item.icon"
      >
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 底部导航栏项目
const tabbarItems = [
  { title: '首页', icon: 'home-o', path: '/' },
  { title: '车辆', icon: 'logistics', path: '/vehicles' },
  { title: '预约', icon: 'calendar-o', path: '/appointments' },
  { title: '维修', icon: 'setting-o', path: '/maintenance' },
  { title: '我的', icon: 'contact', path: '/profile' }
];

// 当前激活的标签页
const activeTab = computed(() => {
  // 根据当前路由路径匹配对应的标签页索引
  const currentPath = route.path;
  const index = tabbarItems.findIndex(item => 
    currentPath === item.path || 
    (item.path !== '/' && currentPath.startsWith(item.path))
  );
  return index >= 0 ? index : 0;
});
</script>

<style lang="less" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.content-container {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 50px; // 为底部导航栏留出空间
}
</style>