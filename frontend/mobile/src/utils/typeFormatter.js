/**
 * 测试类型文本映射
 * @param {string} type - 测试类型编码
 * @returns {string} - 测试类型的中文显示文本
 */
export const getTestTypeText = (type) => {
  const typeMap = {
    'CRASH_TEST': '碰撞测试',
    'DURABILITY_TEST': '耐久性测试',
    'PERFORMANCE_TEST': '性能测试',
    'NOISE_TEST': '噪声测试',
    'BRAKE_TEST': '制动测试',
    'EMISSION_TEST': '排放测试',
    'WIND_TUNNEL_TEST': '风洞测试',
    'ROAD_TEST': '道路测试',
    'VIBRATION_TEST': '振动测试',
    'WATER_RESISTANCE_TEST': '防水测试'
  };
  return typeMap[type] || type;
};

/**
 * 实验类型文本映射
 * @param {string} type - 实验类型编码
 * @returns {string} - 实验类型的中文显示文本
 */
export const getExperimentTypeText = (type) => {
  const typeMap = {
    'CRASH_TEST': '碰撞试验',
    'DURABILITY_TEST': '耐久性试验',
    'PERFORMANCE_TEST': '性能试验',
    'NOISE_TEST': '噪声试验',
    'BRAKE_TEST': '制动试验',
    'EMISSION_TEST': '排放试验',
    'WIND_TUNNEL_TEST': '风洞试验',
    'ROAD_TEST': '道路试验',
    'VIBRATION_TEST': '振动试验',
    'WATER_RESISTANCE_TEST': '防水试验'
  };
  return typeMap[type] || type;
};

/**
 * 难度等级文本映射
 * @param {string} difficulty - 难度等级编码
 * @returns {string} - 难度等级的中文显示文本
 */
export const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    'EASY': '简单',
    'MEDIUM': '中等',
    'HARD': '困难',
    'EXPERT': '专家'
  };
  return difficultyMap[difficulty] || difficulty;
};

/**
 * 难度等级标签类型映射
 * @param {string} difficulty - 难度等级编码
 * @returns {string} - 对应的标签类型
 */
export const getDifficultyType = (difficulty) => {
  const difficultyMap = {
    'EASY': 'success',
    'MEDIUM': 'warning',
    'HARD': 'danger'
  };
  return difficultyMap[difficulty] || 'default';
};

/**
 * 任务状态文本映射
 * @param {string} status - 任务状态编码
 * @returns {string} - 任务状态的中文显示文本
 */
export const getTaskStatusText = (status) => {
  const statusMap = {
    'DRAFT': '草稿',
    'PENDING': '待审核',
    'APPROVED': '已审核',
    'IN_PROGRESS': '进行中',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

/**
 * 任务状态标签类型映射
 * @param {string} status - 任务状态编码
 * @returns {string} - 对应的标签类型
 */
export const getTaskStatusType = (status) => {
  const statusMap = {
    'DRAFT': 'default',
    'PENDING': 'warning',
    'APPROVED': 'primary',
    'IN_PROGRESS': 'processing',
    'COMPLETED': 'success',
    'CANCELLED': 'danger'
  };
  return statusMap[status] || 'default';
};
