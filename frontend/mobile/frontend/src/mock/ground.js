// 场地模拟数据

// No mock grounds — UI will render empty state when backend has no ground data.
export const mockGrounds = [];

// Mock response format
const mockResponse = (data) => ({
  data,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {}
});

/**
 * 获取场地列表
 */
export function getGrounds(params = {}) {
  return mockResponse([]);
}

/**
 * 根据ID获取场地详情
 */
export function getGroundById(groundId) {
  return mockResponse(null);
}
