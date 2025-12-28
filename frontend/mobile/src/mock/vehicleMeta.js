// 模拟车辆品牌数据
export const mockBrands = [
  {
    id: '1',
    name: '特斯拉',
    logo: 'https://example.com/tesla-logo.png'
  },
  {
    id: '2',
    name: '比亚迪',
    logo: 'https://example.com/byd-logo.png'
  },
  {
    id: '3',
    name: '小鹏',
    logo: 'https://example.com/xpeng-logo.png'
  }
];

// 模拟车辆型号数据
export const mockModels = {
  '1': [ // 特斯拉
    { id: '11', name: 'Model 3', year: '2024' },
    { id: '12', name: 'Model Y', year: '2024' },
    { id: '13', name: 'Model S', year: '2024' }
  ],
  '2': [ // 比亚迪
    { id: '21', name: '汉', year: '2024' },
    { id: '22', name: '宋', year: '2024' },
    { id: '23', name: '唐', year: '2024' }
  ],
  '3': [ // 小鹏
    { id: '31', name: 'P7', year: '2024' },
    { id: '32', name: 'G9', year: '2024' },
    { id: '33', name: 'P5', year: '2024' }
  ]
};

// 模拟车辆类型数据
export const mockVehicleTypes = [
  { id: 1, name: '轿车', code: 'SEDAN' },
  { id: 2, name: 'SUV', code: 'SUV' },
  { id: 3, name: '卡车', code: 'TRUCK' },
  { id: 4, name: '面包车', code: 'VAN' },
  { id: 5, name: '新能源车', code: 'NEV' }
];
