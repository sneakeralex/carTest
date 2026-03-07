import { artemisRequest } from './request.js';

// 告警信息接口地址
const ALERT_API = '/artemis/api/v1/alert';

/**
 * 获取告警信息列表
 * @param {Object} params - 查询参数
 * @param {string} params.pageSize - 页长
 * @param {string} params.pageNum - 页码
 * @param {string} [params.alertType] - 告警类型
 * @param {string} [params.status] - 告警状态
 * @param {string} [params.startTime] - 开始时间
 * @param {string} [params.endTime] - 结束时间
 * @returns {Promise} - 返回Promise对象
 */
export async function getAlertList(params = {}) {
  try {
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', params.pageSize || '20');
    queryParams.append('pageNum', params.pageNum || '1');
    
    if (params.alertType) {
      queryParams.append('alertType', params.alertType);
    }
    
    if (params.status) {
      queryParams.append('status', params.status);
    }
    
    if (params.startTime) {
      queryParams.append('startTime', params.startTime);
    }
    
    if (params.endTime) {
      queryParams.append('endTime', params.endTime);
    }
    
    const url = `${ALERT_API}/list?${queryParams.toString()}`;
    
    const res = await artemisRequest(url, {
      method: 'GET',
      headers: { 'Accept': '*/*' }
    });
    
    const result = res?.data || {};
    
    // 转换响应格式以匹配项目的标准格式
    const transformedAlerts = (result.data || []).map(alert => ({
      id: alert.id || alert.alertId,
      title: alert.title || `告警: ${alert.alertType}`,
      content: alert.content || alert.message || '',
      type: 'ALERT',
      category: 'alert',
      priority: alert.priority || 'medium',
      status: alert.status || 'active',
      createdAt: alert.createTime || alert.createdAt,
      alertType: alert.alertType,
      deviceId: alert.deviceId,
      deviceName: alert.deviceName,
      siteId: alert.siteId,
      siteName: alert.siteName,
      ...alert
    }));
    
    return {
      data: {
        content: transformedAlerts,
        pageable: {
          pageNumber: parseInt(params.pageNum || '1') - 1,
          pageSize: parseInt(params.pageSize || '20'),
          total: result.total || 0
        }
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取告警信息列表失败:', error);
    throw error;
  }
}

/**
 * 获取告警详情
 * @param {string|number} id - 告警ID
 * @returns {Promise} - 返回Promise对象
 */
export async function getAlertById(id) {
  try {
    const url = `${ALERT_API}/${id}`;
    
    const res = await artemisRequest(url, {
      method: 'GET',
      headers: { 'Accept': '*/*' }
    });
    
    const result = res?.data || {};
    const alert = result.data || result;
    
    // 转换响应格式以匹配项目的标准格式
    const transformedAlert = {
      id: alert.id || alert.alertId,
      title: alert.title || `告警: ${alert.alertType}`,
      content: alert.content || alert.message || '',
      type: 'ALERT',
      category: 'alert',
      priority: alert.priority || 'medium',
      status: alert.status || 'active',
      createdAt: alert.createTime || alert.createdAt,
      alertType: alert.alertType,
      deviceId: alert.deviceId,
      deviceName: alert.deviceName,
      siteId: alert.siteId,
      siteName: alert.siteName,
      relatedId: alert.deviceId || alert.siteId,
      relatedType: alert.deviceId ? 'EQUIPMENT' : alert.siteId ? 'TEST_SITE' : '',
      ...alert
    };
    
    return {
      data: transformedAlert,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };
  } catch (error) {
    console.error('获取告警详情失败:', error);
    throw error;
  }
}

/**
 * 处理告警
 * @param {string|number} id - 告警ID
 * @param {Object} data - 处理数据
 * @param {string} data.status - 处理状态
 * @param {string} [data.handler] - 处理人
 * @param {string} [data.remark] - 处理备注
 * @returns {Promise} - 返回Promise对象
 */
export async function handleAlert(id, data) {
  try {
    const url = `${ALERT_API}/${id}/handle`;
    
    const res = await artemisRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify(data)
    });
    
    return res;
  } catch (error) {
    console.error('处理告警失败:', error);
    throw error;
  }
}

/**
 * 批量处理告警
 * @param {Array} ids - 告警ID列表
 * @param {Object} data - 处理数据
 * @param {string} data.status - 处理状态
 * @param {string} [data.handler] - 处理人
 * @param {string} [data.remark] - 处理备注
 * @returns {Promise} - 返回Promise对象
 */
export async function batchHandleAlerts(ids, data) {
  try {
    const url = `${ALERT_API}/batch/handle`;
    
    const res = await artemisRequest(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' },
      body: JSON.stringify({ ids, ...data })
    });
    
    return res;
  } catch (error) {
    console.error('批量处理告警失败:', error);
    throw error;
  }
}
