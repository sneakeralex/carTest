// 场地模拟数据

export const mockGrounds = [
  {
    id: 1,
    name: '主测试场地A',
    type: '测试场地',
    status: '可用',
    location: '东区',
    description: '主要测试场地，用于车辆性能测试',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: '辅助测试场地B',
    type: '测试场地',
    status: '可用',
    location: '西区',
    description: '辅助测试场地，用于小型车辆测试',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: '高温测试场地',
    type: '特殊测试场地',
    status: '维护中',
    location: '南区',
    description: '高温环境测试场地',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

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
  let filteredGrounds = [...mockGrounds];

  if (params.provingGroundId) {
    // 过滤特定试验场的场地
    filteredGrounds = filteredGrounds.filter(ground => ground.id <= params.provingGroundId);
  }

  return mockResponse(filteredGrounds);
}

/**
 * 根据ID获取场地详情
 */
export function getGroundById(groundId) {
  const ground = mockGrounds.find(g => g.id === parseInt(groundId));
  return mockResponse(ground || null);
}
