/**
 * 通用存储工具类
 * 提供localStorage操作的通用方法
 */

/**
 * 从localStorage获取数据
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值，当获取失败时返回
 * @returns {any} - 获取的数据，获取失败时返回默认值
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === 'undefined') {
      return defaultValue;
    }
    return JSON.parse(value);
  } catch (error) {
    console.error(`从localStorage获取数据失败 [${key}]:`, error);
    return defaultValue;
  }
};

/**
 * 向localStorage存储数据
 * @param {string} key - 存储键名
 * @param {any} value - 要存储的数据
 * @returns {boolean} - 存储是否成功
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`向localStorage存储数据失败 [${key}]:`, error);
    return false;
  }
};

/**
 * 从localStorage删除数据
 * @param {string} key - 存储键名
 * @returns {boolean} - 删除是否成功
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`从localStorage删除数据失败 [${key}]:`, error);
    return false;
  }
};

/**
 * 清除所有localStorage数据
 * @returns {boolean} - 清除是否成功
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('清除localStorage数据失败:', error);
    return false;
  }
};

/**
 * 获取localStorage的存储大小
 * @returns {number} - 存储大小（字节）
 */
export const getStorageSize = () => {
  try {
    let size = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length;
      }
    }
    return size;
  } catch (error) {
    console.error('获取localStorage存储大小失败:', error);
    return 0;
  }
};

/**
 * 检查localStorage是否可用
 * @returns {boolean} - localStorage是否可用
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};
