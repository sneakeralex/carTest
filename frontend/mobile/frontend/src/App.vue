<template>
  <div class="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive :exclude="noCacheComponents">
        <component :is="Component" :key="routeKey" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const routeKey = ref(Math.random());
const noCacheComponents = ref([]);

// 强制刷新逻辑
const forceRefresh = () => {
  // 生成新的key，强制组件重新渲染
  routeKey.value = Math.random();
  console.log('页面强制刷新');
};

// 监听路由变化，进入页面时强制刷新
watch(
  () => route.path,
  (newPath, oldPath) => {
    // 每次路由变化时强制刷新
    forceRefresh();
  },
  { immediate: true }
);

// 页面加载时强制刷新
onMounted(() => {
  forceRefresh();
  
  // 检测是否在小程序环境中
  const isInMiniProgram = () => {
    // 微信小程序
    if (typeof wx !== 'undefined' && wx.miniProgram) {
      return true;
    }
    // 其他小程序环境检测
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes('miniprogram') || ua.includes('wechat') || ua.includes('alipay');
  };
  
  if (isInMiniProgram()) {
    console.log('在小程序环境中，启用强制刷新机制');
    
    // 额外的刷新机制：在页面显示时刷新
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          console.log('页面变为可见，强制刷新');
          forceRefresh();
        }
      });
    }
  }
});
</script>

<style lang="less">
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f7f8fa;
  color: #323233;
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>