# DATE_PICKER_MODEL_VALUE_FIX.md

## 问题描述
Vue警告：
```
NewBooking.vue:180 [Vue warn]: Invalid prop: type check failed for prop "modelValue". Expected Array, got Date  
  at <VanDatePicker modelValue= Fri Dec 26 2025 14:30:20 GMT+0800 (中国标准时间) onUpdate:modelValue=fn type="date"
```

## 问题根因
Vant的`van-date-picker`组件期望`modelValue`是数组格式，但我们通过`v-model="currentDate"`绑定了一个`Date`对象。

## 修复方案
将`v-model`改为`:model-value`以避免双向绑定的类型冲突：

**修改前：**
```html
<van-date-picker
  v-model="currentDate"
  type="date"
  title="选择预约日期"
  :min-date="minDate"
  :max-date="maxDate"
  @confirm="onDateSelect"
  @cancel="showDatePicker = false"
/>
```

**修改后：**
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
- `v-model="currentDate"` 等价于 `:model-value="currentDate" @update:model-value="currentDate = $event"`
- 使用 `:model-value` 只进行单向数据绑定，避免类型冲突
- 日期选择通过 `@confirm` 事件处理，更新 `bookingDate` 值

## 预期结果
✅ 消除Vue类型检查警告
✅ 日期选择器正常工作
✅ 日期选择功能不受影响

---
*修复完成时间: 2025-12-25*