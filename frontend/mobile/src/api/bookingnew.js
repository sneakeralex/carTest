import { artemisRequest } from './request';

// 获取预约列表的核心函数 (通过 artemisRequest)
export async function getBookings() {
  try {
    const params = {
      date: '2025-11-01',
      pageSize: 20,
      pageNum: 1,
      userId: 1
    };
    const qs = new URLSearchParams(params).toString();
    const res = await artemisRequest(`/artemis/api/v1/booking/list?${qs}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });

    const data = res?.data;
    console.log('获取预约列表成功:', data);
    return data;
  } catch (error) {
    console.error('获取预约列表失败:', error);
    if (error.message && error.message.includes('incorrect header check')) {
      console.error('❌ 响应数据可能存在压缩/编码问题');
    }
    throw new Error('获取预约列表失败，请稍后重试');
  }
}