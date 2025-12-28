import dayjs from 'dayjs';

/**
 * 格式化日期显示
 * @param {string|Date} date - 要格式化的日期
 * @param {string} format - 格式化模式，默认为 YYYY-MM-DD
 * @returns {string} - 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return '未设置';
  try {
    return dayjs(date).format(format);
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '日期无效';
  }
};

/**
 * 格式化日期时间
 * @param {string|Date} date - 要格式化的日期时间
 * @param {string} format - 格式化模式，默认为 YYYY-MM-DD HH:mm
 * @returns {string} - 格式化后的日期时间字符串
 */
export const formatDateTime = (date, format = 'YYYY-MM-DD HH:mm') => {
  if (!date) return '';
  try {
    return dayjs(date).format(format);
  } catch (error) {
    console.error('日期时间格式化错误:', error);
    return '';
  }
};

/**
 * 获取相对时间显示
 * @param {string|Date} date - 要格式化的日期
 * @returns {string} - 相对时间字符串
 */
export const getRelativeTime = (date) => {
  if (!date) return '未设置';
  try {
    const now = dayjs();
    const target = dayjs(date);
    const diffDays = target.diff(now, 'day');
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '明天';
    if (diffDays === -1) return '昨天';
    if (diffDays > 0 && diffDays <= 7) return `${diffDays}天后`;
    if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)}天前`;
    
    return target.format('YYYY-MM-DD');
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '日期无效';
  }
};

/**
 * 检查日期是否在指定范围内
 * @param {string|Date} date - 要检查的日期
 * @param {string|Date} startDate - 开始日期
 * @param {string|Date} endDate - 结束日期
 * @returns {boolean} - 是否在范围内
 */
export const isDateInRange = (date, startDate, endDate) => {
  if (!date || !startDate || !endDate) return false;
  try {
    const checkDate = dayjs(date);
    return checkDate.isAfter(dayjs(startDate)) && checkDate.isBefore(dayjs(endDate));
  } catch (error) {
    console.error('日期检查错误:', error);
    return false;
  }
};
