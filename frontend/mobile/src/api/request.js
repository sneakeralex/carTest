import axios from 'axios';
import { showNotify } from 'vant';
import router from '../router/index.js';
import * as equipmentMock from '../mock/equipment.js';
import * as maintenanceMock from '../mock/maintenance.js';

// 判断是否使用mock数据
const useMock = import.meta.env.MODE === 'development';

// mock处理函数集合
const mockHandlers = useMock ? { ...equipmentMock, ...maintenanceMock } : {};

// Default proxy base for frontend -> backend proxy
const DEFAULT_BASE = (typeof window !== 'undefined' && window?.__ARTEMIS_PROXY_BASE__) || (import.meta?.env?.VITE_API_BASE) || '/api';

// 创建axios实例 (用于同源 API 调用和 dev mocks)
export const service = axios.create({
  baseURL: DEFAULT_BASE,
  timeout: 15000
});

// 请求拦截器 (axios service)
service.interceptors.request.use(
  config => {
    // 如果是开发环境且有对应的mock处理函数，使用mock数据
    if (useMock) {
      const urlParts = (config.url || '').replace(/^\/api\//, '').split('/');
      const baseResource = urlParts[0] || '';
      const method = (config.method || 'get').toLowerCase();
      let mockKey;

      // 处理不同的URL模式
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

    // NOTE: Do NOT attach Authorization token in frontend headers.
    // Authorization/signing must be performed server-side by the /api proxy.
    // Intentionally left blank to avoid client-side secrets leakage.

    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器 (axios service)
service.interceptors.response.use(
  response => response,
  error => {
    const { response } = error || {};

    if (response) {
      switch (response.status) {
        case 400:
          showNotify({ type: 'danger', message: '请求参数错误' });
          break;
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
          showNotify({ type: 'danger', message: '登录已过期，请重新登录' });
          break;
        case 403:
          showNotify({ type: 'danger', message: '没有权限访问该资源' });
          break;
        case 404:
          showNotify({ type: 'danger', message: '请求的资源不存在' });
          break;
        case 500:
          showNotify({ type: 'danger', message: '服务器内部错误' });
          break;
        default:
          showNotify({ type: 'danger', message: `请求失败: ${response.status}` });
      }
    } else {
      showNotify({ type: 'danger', message: '网络错误，请检查您的网络连接' });
    }

    return Promise.reject(error);
  }
);

// Interceptor registries for fetch-based artemisRequest
const requestInterceptors = [];
const responseInterceptors = [];

export function addRequestInterceptor(fn) {
  if (typeof fn === 'function') requestInterceptors.push(fn);
  return () => { const i = requestInterceptors.indexOf(fn); if (i >= 0) requestInterceptors.splice(i, 1); };
}

export function addResponseInterceptor(fn) {
  if (typeof fn === 'function') responseInterceptors.push(fn);
  return () => { const i = responseInterceptors.indexOf(fn); if (i >= 0) responseInterceptors.splice(i, 1); };
}

// Utility: sleep
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// Exponential backoff with jitter
function backoffDelay(attempt, base = 200) { const exp = Math.min(30000, base * Math.pow(2, attempt)); const jitter = Math.random() * base; return exp + jitter; }

// Normalize response shape returned by this client
function normalizeResponse(status, statusText, headers, data, config = {}) {
  let payload = data;
  if (data && typeof data === 'object') {
    if ('data' in data && (Object.keys(data).length > 1 || data.data === null)) {
      payload = data;
    }
  }
  return { data: payload, status, statusText: statusText || (status ? String(status) : ''), headers: headers || {}, config };
}

// Map errors to a common shape
function mapError(err) {
  const mapped = { message: err?.message || 'Unknown error', isNetworkError: false, isTimeout: false, isAuth: false, status: null, original: err };
  if (err instanceof Error && err.name === 'AbortError') { mapped.isTimeout = true; mapped.message = 'Request timed out'; return mapped; }
  if (err && err.name === 'TypeError' && /failed to fetch/i.test(err.message)) { mapped.isNetworkError = true; mapped.message = 'Network error'; return mapped; }
  if (err && err.response) { mapped.status = err.response.status; mapped.message = err.response.statusText || err.message; if (mapped.status === 401 || mapped.status === 403) mapped.isAuth = true; return mapped; }
  if (err && err.status) { mapped.status = err.status; mapped.message = err.statusText || mapped.message; if (mapped.status === 401 || mapped.status === 403) mapped.isAuth = true; return mapped; }
  return mapped;
}

// Helper: run request/response interceptors
async function runRequestInterceptors(ctx) {
  let cfg = { ...ctx };
  for (const fn of requestInterceptors) {
    const out = await fn(cfg) || cfg;
    cfg = out;
  }
  return cfg;
}

async function runResponseInterceptors(ctx) {
  let res = { ...ctx };
  for (const fn of responseInterceptors) {
    const out = await fn(res) || res;
    res = out;
  }
  return res;
}

// Rewrite logic: convert absolute Artemis URLs and known prefixes to local /artemis proxy
function rewriteToProxy(inputPath) {
  if (!inputPath) return inputPath;

  // Canonical upstream host (absolute) — always use this for Artemis endpoints
  const UPSTREAM_HOST = 'https://cartest.douwifi.cn';

  // Helper to ensure single leading slash on suffix
  const ensureLeading = (s) => s.startsWith('/') ? s : '/' + s;

  // If input is an absolute URL that points to the upstream, normalize and return absolute URL
  try {
    const u = new URL(inputPath, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');
    const hostMatch = /cartest\.douwifi\.cn|artemis/.test(u.hostname);
    if (hostMatch) {
      // Build canonical upstream URL: https://cartest.douwifi.cn/artemis{path...}
      const path = u.pathname || '/';
      const suffix = path.startsWith('/artemis') ? path.slice('/artemis'.length) : path;
      return UPSTREAM_HOST + '/artemis' + ensureLeading(suffix) + (u.search || '');
    }
  } catch (e) {
    // ignore
  }

  // Map known shorthand or prefixed local paths to upstream absolute URLs
  if (inputPath.startsWith('/apiv1')) {
    return UPSTREAM_HOST + '/artemis/api/v1' + inputPath.slice('/apiv1'.length);
  }
  if (inputPath.startsWith('/apiv2')) {
    return UPSTREAM_HOST + '/artemis/api/v2' + inputPath.slice('/apiv2'.length);
  }
  if (inputPath.startsWith('/v1')) {
    return UPSTREAM_HOST + '/artemis/v1' + inputPath.slice('/v1'.length);
  }

  // If starts with /artemis, map to upstream absolute URL and avoid duplicating the segment
  if (inputPath.startsWith('/artemis')) {
    const suffix = inputPath.slice('/artemis'.length);
    return UPSTREAM_HOST + '/artemis' + (suffix || '');
  }

  // Non-artemis paths (same-origin APIs or assets) should remain unchanged
  return inputPath;
}

// Core fetch with timeout + retries
export async function artemisRequest(inputPath, options = {}) {
  const cfg = { method: 'GET', headers: {}, timeout: 12000, retries: 2, retryOn: [429, 502, 503, 504], ...options };
  const intercepted = await runRequestInterceptors({ path: inputPath, options: cfg });
  const path = intercepted.path ?? inputPath;
  const opts = intercepted.options ?? cfg;

  // Intentionally do not add Authorization here. The server proxy will sign/attach credentials.

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