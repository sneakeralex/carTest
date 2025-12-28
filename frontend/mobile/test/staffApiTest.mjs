// Simple test for getStaffList API
// Usage: node test/staffApiTest.mjs

import { getStaffList } from '../src/api/staff.js';

const run = async () => {
  console.log('=== getStaffList API 测试 ===');
  const params = {
    pageNum: 1,
    pageSize: 20
  };

  try {
    const res = await getStaffList(params);
    console.log('状态:', res?.status, res?.statusText);
    const list = res?.data || [];
    console.log('返回条数:', list.length);
    if (list.length > 0) {
      console.log('首条记录:', JSON.stringify(list[0], null, 2));
    }
  } catch (err) {
    console.error('调用失败:', err?.message || err);
  }
};

run();
