<template>
  <div class="layout-container">
    <!-- 主内容区域 -->
    <div class="content-container">
      <router-view />
    </div>
    
    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" @change="onTabChange">
      <van-tabbar-item 
        v-for="(item, index) in navItems" 
        :key="index"
        :icon="item.icon"
      >
        {{ item.title }}
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// 判断是否为管理员
const isAdmin = computed(() => {
  const userInfo = authStore.getCurrentUser();
  return userInfo?.role === 'ADMIN'
});

// 底部导航栏项目
const navItems = computed(() => {
  const items = [
    { title: '首页', icon: 'home-o', path: '/' },
    { title: '车辆', icon: 'logistics', path: '/vehicles' },
    { title: '预约', icon: 'calendar-o', path: '/bookings' },
    { title: '测试', icon: 'medal-o', path: '/test-tasks' },
    { title: '合同', icon: 'description', path: '/contracts' },
  ];
  
  // 管理员显示人员管理菜单
  if (isAdmin.value) {
    items.splice(3, 0, { title: '人员', icon: 'friends-o', path: '/staff' });
  }
  
  // 添加我的页面
  items.push({ title: '我的', icon: 'contact', path: '/profile' });
  
  return items;
});

// 当前激活的标签页
const activeTab = computed(() => {
  const currentPath = route.path;
  const index = navItems.value.findIndex(item => {
    // 如果是根路径，需要精确匹配
    if (item.path === '/') {
      return currentPath === '/';
    }
    // 预约路径特殊处理
    if (item.path === '/bookings') {
      return currentPath.startsWith('/booking') || currentPath.startsWith('/bookings');
    }
    // 其他路径检查是否以该路径开头
    return currentPath.startsWith(item.path);
  });
  return index >= 0 ? index : 0;
});

// 处理标签页切换
const onTabChange = (index) => {
  const path = navItems.value[index].path;
  if (route.path !== path) {
    router.push(path);
  }
};
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