<template>
  <div class="login-container">
    <div class="login-header">
      <img src="../assets/logo.svg" alt="Logo" class="logo" />
      <h1 class="title">车辆管理系统</h1>
    </div>

    <van-form class="login-form">
      <!-- 登录方式选择 -->
      <van-cell-group inset>
        <van-radio-group v-model="loginMethod" class="login-method-selector">
          <van-radio name="password" icon-size="20">手机号密码登录</van-radio>
          <van-radio name="verification" icon-size="20">手机号验证码登录</van-radio>
        </van-radio-group>
      </van-cell-group>

      <van-cell-group inset>
        <van-field v-model="phoneNumber" name="phoneNumber" label="手机号" placeholder="请输入手机号"
          :rules="[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }]" />
        
        <!-- 密码输入框（仅密码登录时显示） -->
        <van-field v-if="loginMethod === 'password'" v-model="password" type="password" name="password" label="密码" placeholder="请输入密码（默认手机号后四位）"
          :rules="[{ required: true, message: '请输入密码' }]" />
        
        <!-- 验证码输入框（验证码登录时或密码登录失败次数过多时显示） -->
        <van-field v-if="loginMethod === 'verification' || passwordLoginFailedCount >= maxFailedAttempts" v-model="verificationCode" name="verificationCode" label="验证码" placeholder="请输入验证码"
          :rules="[{ required: true, message: '请输入验证码' }]">
          <template #button>
            <van-button size="small" :disabled="countdown > 0" @click="sendVerificationCode">
              {{ countdown > 0 ? `${countdown}秒后重新发送` : '发送验证码' }}
            </van-button>
          </template>
        </van-field>
      </van-cell-group>

      <div class="form-actions">
        <van-button v-if="loginMethod === 'password'" round block type="primary" @click="onPasswordSubmit" :loading="loading">
          登录
        </van-button>
        <van-button v-else round block type="primary" @click="onVerificationSubmit" :loading="loading">
          验证码登录
        </van-button>

        <div class="register-link" v-if="false">
          <span>还没有账号？请联系管理员开通账号</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showNotify } from 'vant';
import { useAuthStore } from '../stores/auth';
import { getItem, setItem, removeItem } from '../utils/storage.js';

const router = useRouter();
const authStore = useAuthStore();

// 登录方式：password - 密码登录，verification - 验证码登录
const loginMethod = ref('password');
// 表单数据
const phoneNumber = ref('');
const password = ref('');
const verificationCode = ref('');
const countdown = ref(0);
const loading = ref(false);

// 密码登录失败次数
const passwordLoginFailedCount = ref(parseInt(getItem('passwordLoginFailedCount', '0')) || 0);
// 最大失败尝试次数
const maxFailedAttempts = 3;

// 判断微信环境方法有重复
function isWeixin() {
  console.log("is weixin function")
  return /micromessenger/i.test(navigator.userAgent);
}

function isMiniProgram() {
  // 微信官方推荐判断方式
  const isEnv = window.__wxjs_environment === 'miniprogram';
  const ua = navigator.userAgent || '';
  const isUA = ua.indexOf('miniProgram') > -1;
  // 微信 JS SDK 推荐
  let isSDK = false;
  if (typeof wx !== 'undefined' && wx?.miniProgram?.getEnv) {
    wx.miniProgram.getEnv(function(res) {
      console.log('[微信SDK] wx.miniProgram.getEnv:', res);
      isSDK = res.miniprogram;
    });
  }
  console.log('[isMiniProgram] window.__wxjs_environment:', window.__wxjs_environment);
  console.log('[isMiniProgram] userAgent:', ua);
  console.log('[isMiniProgram] isEnv:', isEnv, 'isUA:', isUA, 'isSDK:', isSDK);
  return isEnv || isUA || isSDK;
}

onMounted(async () => {
  const token = getItem('token');
  console.log('judge if is weixin -> ', isWeixin());
  // if (isWeixin()) {
  //   if (token) {
  //     router.replace('/');  // 已登录直接跳转
  //     return;
  //   }
  //   // 检查微信回调 code
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code');
  //   if (code) {
  //     loading.value = true;
  //     try {
  //       // 向后台提交 code，后台返回 jwt token
  //       const token = await authStore.wxLogin(code);
  //       setItem('token', token);
  //       showNotify({ type: 'success', message: '微信登录成功' });
  //       router.replace('/'); // 去首页
  //     } catch (error) {
  //       showNotify({ type: 'danger', message: error || '微信登录失败' });
  //     } finally {
  //       loading.value = false;
  //     }
  //   } else {
  //     // 没有 code，发起微信授权
  //     const appid = 'wxb1eb783a5e2bd94c';
  //     console.log('发起获取code')
  //     const redirectUri = encodeURIComponent(window.location.href);
  //     window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
  //   }
  // }
  if (isMiniProgram()) {
    if (token) {
      router.replace('/');
      return;
    }
    // 调用小程序 login API 获取 code
    if (typeof wx !== 'undefined' && wx.login) {
      wx.login({
        success: async (res) => {
          if (res.code) {
            loading.value = true;
            try {
              // 向后台提交 code，后台返回 jwt token
              const token = await authStore.wxMiniProgramLogin(res.code);
              setItem('token', token);
              showNotify({ type: 'success', message: '微信小程序登录成功' });
              router.replace('/');
            } catch (error) {
              showNotify({ type: 'danger', message: error || '微信小程序登录失败' });
            } finally {
              loading.value = false;
            }
          } else {
            showNotify({ type: 'danger', message: '获取微信 code 失败' });
          }
        }
      });
    }
    return;
  }
});

// 发送验证码
const sendVerificationCode = async () => {
  if (!phoneNumber.value || !/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    showNotify({ type: 'danger', message: '请输入正确的手机号' });
    return;
  }

  try {
    await authStore.sendVerificationCode(phoneNumber.value);
    showNotify({ type: 'success', message: '验证码已发送' });
    
    // 开始倒计时
    countdown.value = 60;
    const timer = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        clearInterval(timer);
      }
    }, 1000);
  } catch (error) {
    let msg = '';
    if (!error) msg = '发送验证码失败';
    else if (typeof error === 'string') msg = error;
    else if (error.message) msg = error.message;
    else msg = String(error);

    showNotify({ type: 'danger', message: msg });
  }
};

// 验证码登录提交
const onVerificationSubmit = async () => {
  if (!phoneNumber.value || !/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    showNotify({ type: 'danger', message: '请输入正确的手机号' });
    return;
  }

  if (!verificationCode.value) {
    showNotify({ type: 'danger', message: '请输入验证码' });
    return;
  }

  loading.value = true;

  try {
    await authStore.loginWithVerificationCode(phoneNumber.value, verificationCode.value);
    // 登录成功，重置失败次数
    passwordLoginFailedCount.value = 0;
    removeItem('passwordLoginFailedCount');
    showNotify({ type: 'success', message: '登录成功' });
  } catch (error) {
    let msg = '';
    if (!error) msg = '登录失败，请检查验证码';
    else if (typeof error === 'string') msg = error;
    else if (error.message) msg = error.message;
    else msg = String(error);

    showNotify({ type: 'danger', message: msg });
  } finally {
    loading.value = false;
  }
};

// 密码登录提交
const onPasswordSubmit = async () => {
  if (!phoneNumber.value || !/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    showNotify({ type: 'danger', message: '请输入正确的手机号' });
    return;
  }

  if (!password.value) {
    showNotify({ type: 'danger', message: '请输入密码' });
    return;
  }

  // 检查是否需要验证码
  if (passwordLoginFailedCount.value >= maxFailedAttempts && !verificationCode.value) {
    showNotify({ type: 'danger', message: '请输入验证码' });
    return;
  }

  loading.value = true;

  try {
    await authStore.login(phoneNumber.value, password.value, verificationCode.value);
    // 登录成功，重置失败次数
    passwordLoginFailedCount.value = 0;
    removeItem('passwordLoginFailedCount');
    showNotify({ type: 'success', message: '登录成功' });
  } catch (error) {
    // 登录失败，增加失败次数
    passwordLoginFailedCount.value++;
    setItem('passwordLoginFailedCount', passwordLoginFailedCount.value.toString());
    
    let msg = '';
    if (!error) msg = '登录失败，请检查手机号和密码';
    else if (typeof error === 'string') msg = error;
    else if (error.message) msg = error.message;
    else msg = String(error);

    // 显示失败次数提示
    if (passwordLoginFailedCount.value >= maxFailedAttempts) {
      msg += '，您已连续失败' + passwordLoginFailedCount.value + '次，接下来需要输入验证码';
    } else {
      msg += '，您已连续失败' + passwordLoginFailedCount.value + '次，还有' + (maxFailedAttempts - passwordLoginFailedCount.value) + '次机会';
    }

    showNotify({ type: 'danger', message: msg });
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

.login-method-selector {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid #ebedf0;

  .van-radio {
    font-size: 16px;
    font-weight: 500;
  }
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