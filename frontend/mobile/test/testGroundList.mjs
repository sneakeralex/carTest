/**
 * 场地列表API测试脚本
 * 直接测试API端点
 */

import { getGroundList } from '../src/api/booking.js';

console.log('🏞️ 场地列表API测试开始...\n');

const testGroundList = async () => {
  try {
    console.log('🔄 测试获取场地列表 (provingGroundId=3)...');
    const result = await getGroundList({ provingGroundId: 3 });

    console.log('✅ 场地列表API响应:');
    console.log(JSON.stringify(result, null, 2));

    if (result.status === 200 && result.data) {
      console.log(`✅ 成功获取 ${result.data.length} 个场地`);
      if (result.data.length > 0) {
        console.log('第一个场地示例:', result.data[0]);
      }
    } else {
      console.log('⚠️ API响应格式异常');
    }
  } catch (error) {
    console.error('❌ 场地列表API测试失败:', error);
  }
};

testGroundList();
