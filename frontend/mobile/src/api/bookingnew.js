import axios from 'axios';

// 配置 axios 实例，禁用自动解压，避免解码错误
const apiClient = axios.create({
  // 禁用 axios 的自动解压（关键配置）
  decompress: false,
  // 强制设置响应类型为 text，避免自动解析二进制数据出错
  responseType: 'text',
  // 超时时间，避免请求挂起
  timeout: 10000
});

// 请求拦截器：确保不会添加任何编码相关的请求头
apiClient.interceptors.request.use(
  (config) => {
    // 清理所有编码相关的请求头
    delete config.headers['Accept-Encoding'];
    if (config.headers.common) {
      delete config.headers.common['Accept-Encoding'];
    }
    
    // 仅保留必要的请求头
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = '*/*';
    
    console.log('[getBookings] URL:', config.baseURL + config.url + '?' + new URLSearchParams(config.params));
    console.log('[getBookings] Headers:', config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器：手动处理响应数据，兼容不同编码格式
apiClient.interceptors.response.use(
  (response) => {
    // 手动解析响应数据（避免自动解析出错）
    try {
      // 尝试将文本转为 JSON
      response.data = JSON.parse(response.data);
    } catch (e) {
      // 如果解析失败，保留原始文本（便于排查问题）
      console.warn('响应数据不是合法 JSON，保留原始文本:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('请求响应错误:', error);
    return Promise.reject(error);
  }
);

// 获取预约列表的核心函数
export async function getBookings() {
  try {
    const response = await apiClient.get(
      'https://cartest.douwifi.cn/artemis/api/v1/booking/list',
      {
        params: {
          // 补充你请求参数中的日期（从日志中看到有日期参数）
          date: '2025-11-01',
          pageSize: 20,
          pageNum: 1,
          userId: 1
        }
      }
    );
    
    console.log('获取预约列表成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('获取预约列表失败:', error);
    // 区分不同错误类型，便于排查
    if (error.message.includes('incorrect header check')) {
      console.error('❌ 核心原因：响应数据解压失败，可能是服务端压缩格式错误');
    }
    throw new Error('获取预约列表失败，请稍后重试');
  }
}