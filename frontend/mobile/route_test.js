// 测试路由响应
console.log('开始测试路由...');

// 测试根路径
fetch('http://localhost:5175/')
  .then(response => {
    console.log('根路径响应状态:', response.status);
    return response.text();
  })
  .then(html => {
    if (html.includes('id="app"')) {
      console.log('✅ 根路径正常加载Vue应用');
    } else {
      console.log('❌ 根路径未找到Vue应用容器');
    }
    
    // 检查是否包含路由器视图
    if (html.includes('router-view') || html.includes('Home') || html.includes('首页')) {
      console.log('✅ 页面包含路由相关内容');
    } else {
      console.log('❌ 页面不包含路由相关内容');
    }
  })
  .catch(error => {
    console.error('❌ 请求失败:', error);
  });

// 测试登录页面
fetch('http://localhost:5175/login')
  .then(response => {
    console.log('登录页面响应状态:', response.status);
    return response.text();
  })
  .then(html => {
    if (html.includes('登录') || html.includes('Login')) {
      console.log('✅ 登录页面正常');
    } else {
      console.log('❌ 登录页面异常');
    }
  })
  .catch(error => {
    console.error('❌ 登录页面请求失败:', error);
  });
