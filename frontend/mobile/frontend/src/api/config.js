/**
 * API 配置文件
 * 
 * 统一管理所有 API 端点路径，便于维护和环境切换
 */

// ==================== 基础配置 ====================

/**
 * Artemis API 基础路径前缀
 */
export const ARTEMIS_PREFIX = '/artemis';

// ==================== 认证相关 API ====================

export const AUTH_API = {
  /** 登录 */
  LOGIN: `${ARTEMIS_PREFIX}/login`,
  /** 修改密码 */
  CHANGE_PASSWORD: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/changePassword`,
  /** 获取用户信息 */
  GET_USER_INFO: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/getUserInfo`,
  /** 获取访问令牌 */
  GET_ACCESS_TOKEN: `${ARTEMIS_PREFIX}/v1/tgt/login`,
  /** 验证验证码 */
  // VERIFY_CODE: `${ARTEMIS_PREFIX}/sms/verify`,
  VERIFY_CODE: '/sms/verify',
  /** 发送验证码 */
  SEND_CODE: '/sms/send',
};

// ==================== 员工相关 API ====================

export const STAFF_API = {
  /** 员工列表 */
  LIST: `${ARTEMIS_PREFIX}/api/v1/staff`,
  /** 保存员工 */
  SAVE: `${ARTEMIS_PREFIX}/api/v1/saveStaff`,
  /** 根据ID获取员工 */
  GET_BY_ID: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/getUserById`,
  /** 创建用户 */
  CREATE: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/createUser`,
  /** 更新用户 */
  UPDATE: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/updateUser`,
  /** 删除用户 */
  DELETE: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/deleteUser`,
  /** 上传文档 */
  UPLOAD_DOCUMENT: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/uploadDocument`,
  /** 删除文档 */
  DELETE_DOCUMENT: `${ARTEMIS_PREFIX}/api/manage/auth/v2/manage/userService/deleteDocument`,
};

// ==================== 司机相关 API ====================

export const DRIVER_API = {
  /** 司机列表 */
  LIST: `${ARTEMIS_PREFIX}/api/v1/driver/list`,
  /** 根据ID获取司机 */
  GET_BY_ID: `${ARTEMIS_PREFIX}/api/v1/driver`,
  /** 创建司机 */
  CREATE: `${ARTEMIS_PREFIX}/api/v1/driver`,
  /** 更新司机 */
  UPDATE: `${ARTEMIS_PREFIX}/api/v1/driver`,
  /** 删除司机 */
  DELETE: `${ARTEMIS_PREFIX}/api/v1/driver`,
};

// ==================== 设备相关 API ====================

export const EQUIPMENT_API = {
  /** 设备分页列表 */
  PAGE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/page`,
  /** 设备详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/iotrm/v1/device`,
  /** 创建设备 */
  CREATE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device`,
  /** 更新设备 */
  UPDATE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device`,
  /** 删除设备 */
  DELETE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device`,
  /** 可租用设备列表 */
  RENTABLE_LIST: `${ARTEMIS_PREFIX}/api/device/list`,
  /** 设备申请分页列表 */
  APPLICATION_PAGE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application/page`,
  /** 设备申请详情 */
  APPLICATION_DETAIL: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application`,
  /** 提交设备申请 */
  APPLICATION_CREATE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application`,
  /** 更新设备申请状态 */
  APPLICATION_UPDATE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application`,
  /** 审批设备申请 */
  APPLICATION_APPROVE: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application`,
  /** 取消设备申请 */
  APPLICATION_CANCEL: `${ARTEMIS_PREFIX}/api/iotrm/v1/device/application`,
};

// ==================== 车辆相关 API ====================

export const VEHICLE_API = {
  /** 车辆列表 */
  LIST: `${ARTEMIS_PREFIX}/api/resource/v1/vehicle/vehicleList`,
  /** 高级车辆列表 */
  ADVANCE_LIST: `${ARTEMIS_PREFIX}/api/resource/v2/vehicle/advance/vehicleList`,
};

// ==================== 仪表板相关 API ====================

export const DASHBOARD_API = {
  /** 移动端统计 */
  MOBILE_STATS: `${ARTEMIS_PREFIX}/api/dashboard/v1/mobile/stats`,
  /** 快速操作 */
  QUICK_ACTIONS: `${ARTEMIS_PREFIX}/api/dashboard/v1/quick-actions`,
  /** 设备统计 */
  EQUIPMENT_STATS: `${ARTEMIS_PREFIX}/api/v1/equipment/stats`,
  /** 测试任务统计 */
  TEST_TASK_STATS: `${ARTEMIS_PREFIX}/api/v1/test-task/stats`,
  /** 员工统计 */
  STAFF_STATS: `${ARTEMIS_PREFIX}/api/v1/staff/stats`,
  /** 预约统计 */
  BOOKING_STATS: `${ARTEMIS_PREFIX}/api/v1/booking/stats`,
  /** 告警统计 */
  ALERT_STATS: `${ARTEMIS_PREFIX}/api/v1/alert/stats`,
  /** 系统统计 */
  SYSTEM_STATS: `${ARTEMIS_PREFIX}/api/v1/system/stats`,
};

// ==================== 预约相关 API ====================

export const BOOKING_API = {
  /** 预约列表 */
  LIST: `${ARTEMIS_PREFIX}/api/v1/booking/list`,
  /** 添加预约 */
  ADD: `${ARTEMIS_PREFIX}/api/v1/booking/add`,
  /** 预约详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/v1/booking/detail`,
  /** 更新预约 */
  UPDATE: `${ARTEMIS_PREFIX}/api/v1/booking/update`,
  /** 取消预约 */
  CANCEL: `${ARTEMIS_PREFIX}/api/v1/booking/cancel`,
  /** 可用时段 */
  AVAILABLE_SLOTS: `${ARTEMIS_PREFIX}/api/v1/booking/available-slots`,
  /** 审批预约 */
  APPROVE: `${ARTEMIS_PREFIX}/api/v1/booking/approve`,
  /** 重新安排预约 */
  RESCHEDULE: `${ARTEMIS_PREFIX}/api/v1/booking/reschedule`,
  /** 获取VIN列表 */
  GET_VIN_LIST: `${ARTEMIS_PREFIX}/api/v1/booking/getVinList`,
  /** 获取预约编号 */
  GET_BOOKING_NO: `${ARTEMIS_PREFIX}/api/v1/booking/getBookingNo`,
  /** 场地列表 */
  GROUND_LIST: `${ARTEMIS_PREFIX}/api/v1/booking/groundList`,
  /** 测试项目 */
  TEST_ITEM: `${ARTEMIS_PREFIX}/api/v1/ground/testItem`,
  /** 场地调度 */
  GROUND_SCHEDULING: `${ARTEMIS_PREFIX}/api/v1/ground/scheduling`,
};

// ==================== 测试任务相关 API ====================

export const TEST_TASK_API = {
  /** 测试任务列表 */
  LIST: `${ARTEMIS_PREFIX}/api/v1/test-task/list`,
  /** 测试任务详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/v1/test-task`,
  /** 创建测试任务 */
  CREATE: `${ARTEMIS_PREFIX}/api/v1/test-task`,
  /** 测试注册列表 */
  REGISTRATION_LIST: `${ARTEMIS_PREFIX}/api/v1/test-registration/list`,
  /** 测试注册详情 */
  REGISTRATION_DETAIL: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 创建测试注册 */
  REGISTRATION_CREATE: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 更新测试注册 */
  REGISTRATION_UPDATE: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 取消测试注册 */
  REGISTRATION_CANCEL: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 安排测试注册 */
  REGISTRATION_SCHEDULE: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 完成测试注册 */
  REGISTRATION_COMPLETE: `${ARTEMIS_PREFIX}/api/v1/test-registration`,
  /** 用户测试注册 */
  REGISTRATION_USER: `${ARTEMIS_PREFIX}/api/v1/test-registration/user`,
  /** 任务测试注册 */
  REGISTRATION_TASK: `${ARTEMIS_PREFIX}/api/v1/test-registration/task`,
  /** 测试统计 */
  STATS: `${ARTEMIS_PREFIX}/api/v1/test/stats`,
  /** 实验任务列表 */
  EXPERIMENT_TASK_LIST: `${ARTEMIS_PREFIX}/api/v1/experiment-task/list`,
  /** 实验任务详情 */
  EXPERIMENT_TASK_DETAIL: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 创建实验任务 */
  EXPERIMENT_TASK_CREATE: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 更新实验任务 */
  EXPERIMENT_TASK_UPDATE: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 删除实验任务 */
  EXPERIMENT_TASK_DELETE: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 提交实验任务 */
  EXPERIMENT_TASK_SUBMIT: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 审批实验任务 */
  EXPERIMENT_TASK_APPROVE: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 开始实验任务 */
  EXPERIMENT_TASK_START: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 完成实验任务 */
  EXPERIMENT_TASK_COMPLETE: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 取消实验任务 */
  EXPERIMENT_TASK_CANCEL: `${ARTEMIS_PREFIX}/api/v1/experiment-task`,
  /** 获取任务单号 */
  GET_TASK_NO: `${ARTEMIS_PREFIX}/api/v1/task/getTaskManagementNo`,
  /** 根据委托单编号获取任务单号 */
  GET_TASK_NO_BY_CONTRACT: `${ARTEMIS_PREFIX}/api/v1/task/getTaskManagementNo`,
  /** 任务单查询 */
  TASK_LIST: `${ARTEMIS_PREFIX}/api/v1/task/list`,
  /** 创建任务单 */
  CREATE_TASK: `${ARTEMIS_PREFIX}/api/v1/task`,
  /** 更新任务单 */
  UPDATE_TASK: `${ARTEMIS_PREFIX}/api/v1/task`,
  /** 删除任务单 */
  DELETE_TASK: `${ARTEMIS_PREFIX}/api/v1/taskDel`,
};

// ==================== 测试场地相关 API ====================

export const TEST_SITE_API = {
  /** 场地列表 */
  GROUND_LIST: `${ARTEMIS_PREFIX}/api/v1/booking/groundList`,
  /** 测试场地详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/v1/test-site`,
  /** 可用时段 */
  AVAILABLE_SLOTS: `${ARTEMIS_PREFIX}/api/v1/test-site/available-slots`,
  /** 创建场地预约 */
  CREATE_BOOKING: `${ARTEMIS_PREFIX}/api/v1/test-site/booking`,
  /** 场地预约列表 */
  BOOKING_LIST: `${ARTEMIS_PREFIX}/api/v1/test-site/bookings`,
  /** 场地预约详情 */
  BOOKING_DETAIL: `${ARTEMIS_PREFIX}/api/v1/test-site/booking`,
  /** 更新场地预约 */
  BOOKING_UPDATE: `${ARTEMIS_PREFIX}/api/v1/test-site/booking`,
  /** 取消场地预约 */
  BOOKING_CANCEL: `${ARTEMIS_PREFIX}/api/v1/test-site/booking`,
};

// ==================== 日程相关 API ====================

export const SCHEDULE_API = {
  /** 每日日程 */
  DAILY: `${ARTEMIS_PREFIX}/api/schedule/daily`,
  /** 场地日程 */
  SITE: `${ARTEMIS_PREFIX}/api/schedule/site`,
  /** 天气日程 */
  WEATHER: `${ARTEMIS_PREFIX}/api/schedule/weather`,
  /** 预约日程 */
  BOOKING: `${ARTEMIS_PREFIX}/api/schedule/booking`,
};

// ==================== 通知相关 API ====================

export const NOTIFICATION_API = {
  /** 通知列表 */
  LIST: `${ARTEMIS_PREFIX}/api/notification/v1/list`,
};

// ==================== 维护相关 API ====================

export const MAINTENANCE_API = {
  /** 维护记录列表 */
  LIST: `${ARTEMIS_PREFIX}/api/maintenance/v1/records`,
  /** 维护记录详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/maintenance/v1/records`,
};

// ==================== 合同相关 API ====================

export const CONTRACT_API = {
  /** 合同列表 */
  LIST: `${ARTEMIS_PREFIX}/api/v1/contact/queryContract`,
  /** 合同详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/v1/contact/queryContractDetail`,
};

// ==================== 预约相关 API ====================

export const APPOINTMENT_API = {
  /** 预约列表 */
  LIST: `${ARTEMIS_PREFIX}/api/appointment/v1/appointments`,
  /** 预约详情 */
  DETAIL: `${ARTEMIS_PREFIX}/api/appointment/v1/appointments`,
  /** 可用时间段 */
  AVAILABLE_SLOTS: `${ARTEMIS_PREFIX}/api/appointment/v1/available-slots`,
};

// ==================== 天气相关 API ====================

export const WEATHER_API = {
  /** 当前天气 */
  CURRENT: `${ARTEMIS_PREFIX}/api/weather/v1/current`,
};

// ==================== 告警相关 API ====================

export const ALERT_API = {
  /** 告警基础路径 */
  BASE: `${ARTEMIS_PREFIX}/api/v1/alert`,
};

// ==================== 导出所有配置 ====================

export default {
  ARTEMIS_PREFIX,
  AUTH: AUTH_API,
  STAFF: STAFF_API,
  DRIVER: DRIVER_API,
  EQUIPMENT: EQUIPMENT_API,
  VEHICLE: VEHICLE_API,
  DASHBOARD: DASHBOARD_API,
  BOOKING: BOOKING_API,
  TEST_TASK: TEST_TASK_API,
  TEST_SITE: TEST_SITE_API,
  SCHEDULE: SCHEDULE_API,
  NOTIFICATION: NOTIFICATION_API,
  MAINTENANCE: MAINTENANCE_API,
  CONTRACT: CONTRACT_API,
  APPOINTMENT: APPOINTMENT_API,
  WEATHER: WEATHER_API,
  ALERT: ALERT_API,
};
