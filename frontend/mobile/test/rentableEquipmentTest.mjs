// 使用项目中的真实地址格式测试
async function testRentableEquipmentList() {
  try {
    console.log('测试获取可租用设备清单接口...');
    
    // 构建查询参数
    const queryParams = new URLSearchParams();
    queryParams.append('pageSize', '20');
    queryParams.append('pageNum', '1');
    queryParams.append('deviceNo', 'ZL-WSD');
    queryParams.append('deviceName', '质量式');
    
    // 使用项目中的真实地址格式
    const url = `https://cartest.douwifi.cn/artemis/api/v1/device/list?${queryParams.toString()}`;
    console.log('请求URL:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }
    });
    
    console.log('HTTP状态码:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data = await response.json();
    console.log('接口调用成功！');
    console.log('响应数据:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('接口调用失败:', error);
  }
}

testRentableEquipmentList();
