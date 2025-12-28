# DATE_PICKER_ARRAY_FORMAT_FIX.md

## 问题描述
Vue警告持续出现：
```
[Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Array, got Date  
  at <VanDatePicker model-value= Fri Dec 26 2025 14:36:46 GMT+0800 (中国标准时间) type="date" title="选择预约日期"  ... >
```

## 问题根因
Vant的`van-date-picker`组件期望`modelValue`为数组格式 `[year, month, day]`，但我们传递的是Date对象。

## 修复方案
将所有日期相关的变量改为数组格式以兼容Vant组件。

### 1. 日期选择器状态修改
**修改前：**
```javascript
const currentDate = ref(new Date());
```

**修改后：**
```javascript
const currentDate = ref(['2025', '04', '01']); // 使用数组格式兼容 van-date-picker
```

### 2. 日期范围修改
**修改前：**
```javascript
const minDate = new Date('2025-04-01');
const maxDate = new Date('2025-04-30');
```

**修改后：**
```javascript
const minDate = ['2025', '04', '01'];
const maxDate = ['2025', '04', '30'];
```

### 3. 日期选择处理函数修改
**修改前：**
```javascript
const onDateSelect = async (date) => {
  const formattedDate = dayjs(date).format('YYYY-MM-DD');
  bookingDate.value = formattedDate;
  showDatePicker.value = false;
  selectedPeriod.value = null;
  selectedPeriodText.value = '';
};
```

**修改后：**
```javascript
const onDateSelect = async (date) => {
  // date 是数组格式 [year, month, day]
  if (Array.isArray(date) && date.length === 3) {
    const [year, month, day] = date;
    const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    bookingDate.value = formattedDate;
    currentDate.value = date; // 更新currentDate为选中值
  }
  showDatePicker.value = false;
  selectedPeriod.value = null;
  selectedPeriodText.value = '';
};
```

### 4. 模板保持不变
```html
<van-date-picker
  :model-value="currentDate"
  type="date"
  title="选择预约日期"
  :min-date="minDate"
  :max-date="maxDate"
  @confirm="onDateSelect"
  @cancel="showDatePicker = false"
/>
```

## 技术说明
- Vant的date picker组件期望年份和月份为字符串格式
- 日期格式：`['2025', '04', '01']` (年, 月, 日)
- 使用`padStart(2, '0')`确保月份和日期为两位数
- 移除了不再需要的`dayjs`依赖

## 预期结果
✅ 完全消除Vue类型检查警告
✅ 日期选择器正常工作
✅ 日期选择逻辑正确处理数组格式
✅ 所有linter错误已解决

---
*修复完成时间: 2025-12-25*