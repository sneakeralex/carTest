<template>
  <div class="register-container">
    <h2>注册新账号</h2>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="form.username" name="username" label="用户名" placeholder="请输入用户名" :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="form.password" type="password" name="password" label="密码" placeholder="请输入密码" :rules="[{ required: true, validator: validatePassword, message: '密码不符合安全要求' }]" />
        <p class="password-hint">密码必须至少8位，包含大写字母、小写字母、数字和特殊字符。</p>
        <van-field v-model="form.confirmPassword" type="password" name="confirmPassword" label="确认密码" placeholder="请再次输入密码" :rules="[{ required: true, validator: validateConfirmPassword, message: '两次输入的密码不一致' }]" />
        <van-field v-model="form.email" name="email" label="邮箱" placeholder="请输入邮箱" :rules="[{ required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }]" />
      </van-cell-group>
      <van-button block type="primary" native-type="submit" :loading="loading">注册</van-button>
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
const loading = ref(false);

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
  email: ''
});

const validatePassword = (value) => {
  if (!value) return false;
  
  // 密码长度至少8位
  if (value.length < 8) {
    return false;
  }
  
  // 必须包含至少一个大写字母
  if (!/[A-Z]/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个小写字母
  if (!/[a-z]/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个数字
  if (!/\d/.test(value)) {
    return false;
  }
  
  // 必须包含至少一个特殊字符
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
    return false;
  }
  
  return true;
};

const validateConfirmPassword = (value) => {
  return value === form.value.password;
};

const onSubmit = async () => {
  loading.value = true;
  try {
    const userData = { ...form.value };
    delete userData.confirmPassword; // 移除确认密码字段
    console.log('form value' + userData);
    await authStore.register(userData);
    showNotify({ type: 'success', message: '注册成功' });
    router.push('/login');
  } catch (error) {
    showNotify({ type: 'danger', message: error || '注册失败' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  padding: 32px;
}

.password-hint {
  color: #666;
  font-size: 12px;
  margin-top: 5px;
}

.password-hint {
  margin: 8px 16px;
  color: #969799;
  font-size: 12px;
  line-height: 1.4;
}
</style>