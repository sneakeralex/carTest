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
    
    <!-- 管理员导航菜单 -->
    <div class="admin-nav" v-if="isAdmin">
      <van-popup v-model:show="showAdminMenu" position="right" :style="{ width: '200px' }">
        <div class="admin-nav-header">
          <h3>管理员菜单</h3>
          <van-icon name="cross" @click="showAdminMenu = false" />
        </div>
        <van-cell-group>
          <van-cell 
            v-for="(item, index) in adminNavItems" 
            :key="index"
            :title="item.title"
            :icon="item.icon"
            @click="navigateTo(item.path)"
          />
        </van-cell-group>
      </van-popup>
      <van-icon name="setting-o" class="admin-nav-btn" @click="showAdminMenu = true" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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
    { title: '合同', icon: 'description-o', path: '/contracts' },
  ];
  
  // 管理员显示人员管理菜单
  if (isAdmin.value) {
    items.splice(3, 0, { title: '人员', icon: 'friends-o', path: '/staff' });
  }
  
  // 添加我的页面
  items.push({ title: '我的', icon: 'contact-o', path: '/profile' });
  
  return items;
});

// 侧边导航栏项目（仅超级管理员可见）
const adminNavItems = computed(() => {
  const items = [];
  
  // 超级管理员显示日志管理菜单
  if (isAdmin.value) {
    items.push({ title: '系统日志', icon: 'info-o', path: '/logs' });
  }
  
  return items;
});

// 当前激活的标签页 (可写 ref，与路由同步)
const activeTab = ref(0);
// 管理员菜单显示状态
const showAdminMenu = ref(false);

function updateActiveTabFromRoute() {
  const currentPath = route.path;
  const index = navItems.value.findIndex(item => {
    if (item.path === '/') return currentPath === '/';
    if (item.path === '/bookings') return currentPath.startsWith('/booking') || currentPath.startsWith('/bookings');
    return currentPath.startsWith(item.path);
  });
  // 即使找不到匹配的路径，也保持activeTab为0（首页），确保底部导航栏始终显示
  activeTab.value = index >= 0 ? index : 0;
}

// 初始化并在路由变化时同步
updateActiveTabFromRoute();
watch(() => route.path, () => { updateActiveTabFromRoute(); });

// 处理标签页切换
const onTabChange = (index) => {
  const path = navItems.value[index].path;
  // 无论当前路径是什么，点击底部导航栏的项目都应该跳转到对应的路径
  router.push(path);
  // ensure activeTab stays in sync
  activeTab.value = index;
};

// 导航到指定路径
const navigateTo = (path) => {
  router.push(path);
  showAdminMenu.value = false;
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

.admin-nav {
  position: fixed;
  bottom: 60px;
  right: 20px;
  z-index: 1000;
}

.admin-nav-btn {
  font-size: 32px;
  color: #1989fa;
  background-color: #fff;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

.admin-nav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.admin-nav-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
}

.admin-nav-header .van-icon {
  font-size: 20px;
  cursor: pointer;
}
</style>