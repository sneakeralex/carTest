import axios from 'axios';

/**
 * HTTP 请求工具模块
 * 
 * 本模块提供两套请求方案：
 * 1. axios service - 用于同源 API 调用和开发环境的 mock 数据
 * 2. artemisRequest - 用于 Artemis API 的请求，支持超时、重试和拦截器
 */

// 导入 node-fetch 以在 Node.js 环境中使用 fetch 函数
if (typeof window === 'undefined' && typeof fetch === 'undefined') {
  try {
    const fetchModule = require('node-fetch');
    globalThis.fetch = fetchModule.default || fetchModule;
  } catch (error) {
    console.error('Error loading node-fetch:', error);
  }
}

import * as equipmentMock from '../mock/equipment.js';
import * as maintenanceMock from '../mock/maintenance.js';

// ==================== 配置常量 ====================

/**
 * 是否使用 mock 数据
 * 仅在开发模式下启用 mock 数据
 */
const useMock = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development') || false;

/**
 * mock 处理函数集合
 */
const mockHandlers = useMock ? { ...equipmentMock, ...maintenanceMock } : {};

/**
 * 默认代理基础路径
 * 优先级：window.__ARTEMIS_PROXY_BASE__ > VITE_API_BASE > '/api'
 */
const DEFAULT_BASE = (typeof window !== 'undefined' && window?.__ARTEMIS_PROXY_BASE__) || (import.meta?.env?.VITE_API_BASE) || '/api';

/**
 * Artemis 上游服务器地址
 */
const UPSTREAM_HOST = 'https://cartest.douwifi.cn';

// ==================== Axios Service (同源 API) ====================

/**
 * 创建 axios 实例
 * 用于同源 API 调用和开发环境的 mock 数据
 */
export const service = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: 15000
});

/**
 * axios 请求拦截器
 * 1. 在开发环境下尝试使用 mock 数据
 * 2. 注意：不要在前端添加 Authorization 头，由服务端代理处理
 */
service.interceptors.request.use(
  config => {
    // 如果是开发环境且有对应的mock处理函数，使用mock数据
    if (useMock) {
      const urlParts = (config.url || '').replace(/^\/api\//, '').split('/');
      const baseResource = urlParts[0] || '';
      const method = (config.method || 'get').toLowerCase();
      let mockKey;

      // 根据 URL 模式匹配对应的 mock 函数
      if (urlParts.length === 1) {
        if (baseResource === 'maintenances') {
          mockKey = 'getMaintenances';
        } else {
          mockKey = `get${baseResource.charAt(0).toUpperCase()}${baseResource.slice(1)}s`;
        }
      } else if (urlParts.length === 2 && !isNaN(urlParts[1])) {
        if (baseResource === 'maintenances') {
          mockKey = 'getMaintenanceById';
        } else {
          mockKey = `get${baseResource.slice(0, -1).charAt(0).toUpperCase()}${baseResource.slice(0, -1).slice(1)}ById`;
        }
      } else if (urlParts[1] === 'applications') {
        mockKey = method === 'get' ? 'getEquipmentApplications' : 'applyEquipment';
      } else if (urlParts[2] === 'status') {
        mockKey = 'updateApplicationStatus';
      } else {
        if (baseResource === 'maintenances') {
          if (method === 'post') mockKey = 'createMaintenance';
          else if (method === 'put') mockKey = 'updateMaintenance';
          else if (method === 'delete') mockKey = 'deleteMaintenance';
        } else {
          mockKey = `${method}${baseResource.charAt(0).toUpperCase()}${baseResource.slice(1)}`;
        }
      }

      if (mockHandlers[mockKey]) {
        return new Promise((resolve) => {
          setTimeout(() => {
            try {
              const result = mockHandlers[mockKey](config);
              if (result && typeof result === 'object' && 'data' in result && 'status' in result) {
                resolve(result);
              } else {
                resolve({ data: result, status: 200, statusText: 'OK', headers: {}, config });
              }
            } catch (error) {
              resolve({ data: { code: error.code || 500, message: error.message || '请求失败' }, status: error.code || 500, statusText: error.message || 'Error', headers: {}, config });
            }
          }, 300);
        });
      }
    }

    // 注意：不要在前端添加 Authorization 头
    // 授权/签名必须由服务端代理处理，避免客户端密钥泄露
    return config;
  },
  error => Promise.reject(error)
);

/**
 * axios 响应拦截器
 * 处理各种 HTTP 错误状态码，提供友好的错误提示
 */
service.interceptors.response.use(
  response => response,
  async error => {
    const { response } = error || {};

    // 仅在浏览器环境中动态导入 UI 组件
    let showNotifyFn = (opts) => { console.warn('notify:', opts && opts.message ? opts.message : opts); };
    let routerModule = null;
    if (typeof window !== 'undefined') {
      try {
        const vant = await import('vant');
        showNotifyFn = vant.showNotify || vant.Notify || showNotifyFn;
      } catch (e) {
        // 忽略错误，降级到 console
      }

      try {
        const mod = await import('../router/index.js');
        routerModule = mod && (mod.default || mod);
      } catch (e) {
        // 忽略错误
      }
    }

    if (response) {
      switch (response.status) {
        case 400:
          showNotifyFn({ type: 'danger', message: '请求参数错误' });
          break;
        case 401:
          // 清除本地存储的认证信息
          try { import('../utils/storage.js').then(module => { module.removeItem('token'); module.removeItem('user'); }); } catch (e) {}
          if (routerModule && typeof routerModule.push === 'function') routerModule.push('/login');
          showNotifyFn({ type: 'danger', message: '登录已过期，请重新登录' });
          break;
        case 403:
          showNotifyFn({ type: 'danger', message: '没有权限访问该资源' });
          break;
        case 404:
          showNotifyFn({ type: 'danger', message: '请求的资源不存在' });
          break;
        case 500:
          showNotifyFn({ type: 'danger', message: '服务器内部错误' });
          break;
        default:
          showNotifyFn({ type: 'danger', message: `请求失败: ${response.status}` });
      }
    } else {
      showNotifyFn({ type: 'danger', message: '网络错误，请检查您的网络连接' });
    }

    return Promise.reject(error);
  }
);

// ==================== Artemis Request (专用请求) ====================

/**
 * 请求拦截器注册表
 */
const requestInterceptors = [];

/**
 * 响应拦截器注册表
 */
const responseInterceptors = [];

/**
 * 添加请求拦截器
 * @param {Function} fn - 拦截器函数
 * @returns {Function} 取消拦截器的函数
 */
export function addRequestInterceptor(fn) {
  if (typeof fn === 'function') requestInterceptors.push(fn);
  return () => { const i = requestInterceptors.indexOf(fn); if (i >= 0) requestInterceptors.splice(i, 1); };
}

/**
 * 添加响应拦截器
 * @param {Function} fn - 拦截器函数
 * @returns {Function} 取消拦截器的函数
 */
export function addResponseInterceptor(fn) {
  if (typeof fn === 'function') responseInterceptors.push(fn);
  return () => { const i = responseInterceptors.indexOf(fn); if (i >= 0) responseInterceptors.splice(i, 1); };
}

// ==================== 工具函数 ====================

/**
 * 延迟函数
 * @param {number} ms - 延迟毫秒数
 */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/**
 * 带抖动的指数退避延迟计算
 * @param {number} attempt - 重试次数
 * @param {number} base - 基础延迟毫秒数
 */
function backoffDelay(attempt, base = 200) {
  const exp = Math.min(30000, base * Math.pow(2, attempt));
  const jitter = Math.random() * base;
  return exp + jitter;
}

/**
 * 规范化响应格式
 */
function normalizeResponse(status, statusText, headers, data, config = {}) {
  let payload = data;
  if (data && typeof data === 'object') {
    if ('data' in data && (Object.keys(data).length > 1 || data.data === null)) {
      payload = data;
    }
  }
  return { data: payload, status, statusText: statusText || (status ? String(status) : ''), headers: headers || {}, config };
}

/**
 * 错误映射，统一错误格式
 */
function mapError(err) {
  const mapped = { message: err?.message || 'Unknown error', isNetworkError: false, isTimeout: false, isAuth: false, status: null, original: err };
  if (err instanceof Error && err.name === 'AbortError') { mapped.isTimeout = true; mapped.message = 'Request timed out'; return mapped; }
  if (err && err.name === 'TypeError' && /failed to fetch/i.test(err.message)) { mapped.isNetworkError = true; mapped.message = 'Network error'; return mapped; }
  if (err && err.response) { mapped.status = err.response.status; mapped.message = err.response.statusText || err.message; if (mapped.status === 401 || mapped.status === 403) mapped.isAuth = true; return mapped; }
  if (err && err.status) { mapped.status = err.status; mapped.message = err.statusText || mapped.message; if (mapped.status === 401 || mapped.status === 403) mapped.isAuth = true; return mapped; }
  return mapped;
}

/**
 * 执行请求拦截器
 */
async function runRequestInterceptors(ctx) {
  let cfg = { ...ctx };
  for (const fn of requestInterceptors) {
    const out = await fn(cfg) || cfg;
    cfg = out;
  }
  return cfg;
}

/**
 * 执行响应拦截器
 */
async function runResponseInterceptors(ctx) {
  let res = { ...ctx };
  for (const fn of responseInterceptors) {
    const out = await fn(res) || res;
    res = out;
  }
  return res;
}

/**
 * 确保路径只有一个前导斜杠
 * @param {string} s - 路径字符串
 * @returns {string} 规范化的路径
 */
const ensureLeadingSlash = (s) => s.startsWith('/') ? s : '/' + s;

/**
 * 规范化 Artemis 路径
 * 将各种格式的路径统一转换为标准的 /artemis/... 格式
 * 
 * @param {string} path - 原始路径
 * @returns {string} 规范化后的路径（不含域名）
 */
function normalizeArtemisPath(path) {
  if (!path) return path;

  // 情况1：路径已经以 /artemis 开头
  if (path.startsWith('/artemis')) {
    return path;
  }

  // 情况2：处理已知的前缀简写
  if (path.startsWith('/apiv1')) {
    return '/artemis/api/v1' + path.slice('/apiv1'.length);
  }
  if (path.startsWith('/apiv2')) {
    return '/artemis/api/v2' + path.slice('/apiv2'.length);
  }
  if (path.startsWith('/v1')) {
    return '/artemis/v1' + path.slice('/v1'.length);
  }

  // 其他情况：保持原样
  return path;
}

/**
 * 路径重写函数
 * 将各种格式的输入路径转换为标准的上游 URL
 * 
 * 支持的输入格式：
 * 1. 绝对 URL：https://cartest.douwifi.cn/artemis/api/v1/test
 * 2. /artemis 前缀：/artemis/api/v1/test
 * 3. 简写前缀：/apiv1/test, /apiv2/test, /v1/test
 * 4. 其他路径：保持原样
 * 
 * @param {string} inputPath - 输入路径
 * @returns {string} 重写后的完整 URL
 */
function rewriteToProxy(inputPath) {
  if (!inputPath) return inputPath;

  // 情况1：输入是指向上游的绝对 URL
  try {
    const u = new URL(inputPath, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const hostMatch = /cartest\.douwifi\.cn|artemis/.test(u.hostname);
    if (hostMatch) {
      // 从完整 URL 中提取路径部分，规范化后重新构建
      const normalizedPath = normalizeArtemisPath(u.pathname || '/');
      return UPSTREAM_HOST + normalizedPath + (u.search || '');
    }
  } catch (e) {
    // 不是有效的 URL，继续处理
  }

  // 情况2：输入是相对路径或前缀路径
  const normalizedPath = normalizeArtemisPath(inputPath);

  // 如果是 Artemis 路径，添加上游域名
  if (normalizedPath.startsWith('/artemis')) {
    return UPSTREAM_HOST + normalizedPath;
  }

  // 非 Artemis 路径（同源 API 或资源）保持不变
  return inputPath;
}

/**
 * Artemis 请求核心函数
 * 支持超时、重试、拦截器等特性
 * 
 * @param {string} inputPath - 请求路径
 * @param {Object} options - 请求选项
 * @returns {Promise} 请求结果
 */
export async function artemisRequest(inputPath, options = {}) {
  const cfg = { method: 'GET', headers: {}, timeout: 12000, retries: 2, retryOn: [429, 502, 503, 504], ...options };
  const intercepted = await runRequestInterceptors({ path: inputPath, options: cfg });
  const path = intercepted.path ?? inputPath;
  const opts = intercepted.options ?? cfg;

  // 注意：不要在这里添加 Authorization 头
  // 服务端代理会处理签名和添加凭据

  const url = rewriteToProxy(path);
  const fetchInit = { method: opts.method, headers: opts.headers || {}, body: opts.body };

  let attempt = 0;
  let lastErr = null;
  while (attempt <= (opts.retries || 0)) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), opts.timeout);
    fetchInit.signal = controller.signal;
    try {
      const response = await fetch(url, fetchInit);
      clearTimeout(timeoutId);
      const headersObj = {};
      response.headers.forEach((v, k) => { headersObj[k] = v; });
      let parsed = null;
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) parsed = await response.json();
      else { try { parsed = await response.text(); } catch (e) { parsed = null; } }

      const normalized = normalizeResponse(response.status, response.statusText, headersObj, parsed, { url, options: opts, attempt });
      const final = await runResponseInterceptors({ request: { url, options: opts }, response: normalized });

      if (!response.ok) {
        if ((opts.retryOn || []).includes(response.status) && attempt < (opts.retries || 0)) {
          const delayMs = backoffDelay(attempt);
          await sleep(delayMs);
          attempt++;
          continue;
        }
        const err = new Error(final.response?.data?.message || `HTTP error ${response.status}`);
        err.status = response.status;
        throw err;
      }

      return final.response || final;
    } catch (err) {
      clearTimeout(timeoutId);
      lastErr = err;
      const isAbort = err && (err.name === 'AbortError' || err.message === 'Request timed out');
      const shouldRetry = (isAbort || err instanceof TypeError || (err && err.status && (opts.retryOn || []).includes(err.status))) && attempt < (opts.retries || 0);
      if (shouldRetry) {
        const delayMs = backoffDelay(attempt);
        await sleep(delayMs);
        attempt++;
        continue;
      }
      const mapped = mapError(err);
      const mappedErr = new Error(mapped.message);
      mappedErr.meta = mapped;
      throw mappedErr;
    }
  }

  const mapped = mapError(lastErr);
  const mappedErr = new Error(mapped.message);
  mappedErr.meta = mapped;
  throw mappedErr;
}

export default service;
