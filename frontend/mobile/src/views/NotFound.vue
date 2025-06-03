<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <van-image
        width="200"
        height="200"
        :src="notFoundImage"
        fit="contain"
      />
      <h2 class="not-found-title">页面不存在</h2>
      <p class="not-found-desc">您访问的页面不存在或已被删除</p>
      <div class="not-found-actions">
        <van-button type="primary" size="small" @click="goBack">返回上一页</van-button>
        <van-button plain type="primary" size="small" @click="goHome">返回首页</van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 404图片
const notFoundImage = ref('https://fastly.jsdelivr.net/npm/@vant/assets/empty-image-default.png');

// 返回上一页
const goBack = () => {
  router.back();
};

// 返回首页
const goHome = () => {
  router.push('/');
};
</script>

<style lang="less" scoped>
.not-found-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.not-found-title {
  margin-top: 16px;
  margin-bottom: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #323233;
}

.not-found-desc {
  margin-bottom: 24px;
  font-size: 14px;
  color: #969799;
}

.not-found-actions {
  display: flex;
  gap: 16px;
}

// 深色模式样式
:global(.dark) {
  .not-found-title {
    color: #f5f5f5;
  }
  
  .not-found-desc {
    color: #a2a2a2;
  }
}
</style>