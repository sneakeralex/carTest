// Simple real API invocation test for getBookings
// Usage: API_TOKEN="<token>" node test/bookingsRealTest.mjs

// Mock localStorage for token lookup in booking.js
global.localStorage = {
  getItem: (k) => {
    if (k === 'token') return process.env.API_TOKEN || null;
    if (k === 'user') return JSON.stringify({ username: 'admin', id: 1 });
    return null;
  }
};

import { getBookings } from '../src/api/booking.js';

const run = async () => {
  console.log('=== getBookings 实际接口调用测试 ===');
  const params = {
    userId: 1,
    startTime: '2025-10-01',
    endTime: '2025-11-01',
    pageNum: 1,
    pageSize: 20,
  };
  const token = process.env.API_TOKEN || null;

  try {
    const res = await getBookings(params);
    const list = res?.data || [];
    console.log('状态:', res?.status, res?.statusText);
    console.log('返回条数:', list.length);
    if (list.length) {
      console.log('首条记录:', JSON.stringify(list[0], null, 2));
    }
  } catch (err) {
    console.error('调用失败:', err?.message || err);
  }
};

run();
