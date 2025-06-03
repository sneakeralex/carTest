<template>
  <div class="login-container">
    <div class="login-header">
      <img src="../assets/logo.svg" alt="Logo" class="logo" />
      <h1 class="title">车辆管理系统</h1>
    </div>
    
    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>
      
      <div class="form-actions">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
        >
          登录
        </van-button>
        
        <div class="register-link">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// 表单数据
const username = ref('');
const password = ref('');
const loading = ref(false);

// 提交表单
const onSubmit = async () => {
  loading.value = true;
  
  try {
    await authStore.login(username.value, password.value);
    showNotify({ type: 'success', message: '登录成功' });
    router.push('/');
  } catch (error) {
    showNotify({ type: 'danger', message: error || '登录失败，请检查用户名和密码' });
  } finally {
    loading.value = false;
  }
};
</script>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.login-header {
  margin-top: 60px;
  margin-bottom: 40px;
  text-align: center;
  
  .logo {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
  }
  
  .title {
    font-size: 24px;
    font-weight: 600;
    color: #323233;
  }
}

.login-form {
  width: 100%;
}

.form-actions {
  margin: 24px 16px 16px;
}

.register-link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  
  a {
    color: #1989fa;
    text-decoration: none;
  }
}
</style>