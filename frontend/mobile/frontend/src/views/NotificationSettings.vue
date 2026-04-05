<template>
  <div class="notification-settings">
    <!-- 顶部导航 -->
    <van-nav-bar
      title="通知设置"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />

    <div class="settings-container">
      <!-- 通知总开关 -->
      <van-cell-group title="通知总开关">
        <van-cell title="接收通知">
          <template #right-icon>
            <van-switch v-model="settings.enabled" @change="onSettingChange" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 通知类型设置 -->
      <van-cell-group title="通知类型">
        <van-cell title="审批消息">
          <template #label>
            测试任务审批、设备申请审批等
          </template>
          <template #right-icon>
            <van-switch 
              v-model="settings.approval" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
        
        <van-cell title="场地消息">
          <template #label>
            场地变更、预约提醒等
          </template>
          <template #right-icon>
            <van-switch 
              v-model="settings.site" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
        
        <van-cell title="设备提醒">
          <template #label>
            设备归还、维护完成等
          </template>
          <template #right-icon>
            <van-switch 
              v-model="settings.equipment" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
        
        <van-cell title="预约提醒">
          <template #label>
            预约确认、时间提醒等
          </template>
          <template #right-icon>
            <van-switch 
              v-model="settings.appointment" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 推送时间设置 -->
      <van-cell-group title="推送时间">
        <van-cell 
          title="免打扰时间" 
          :value="getDndTimeText()"
          is-link 
          @click="showDndTimePicker = true"
        />
        <van-cell title="工作日推送">
          <template #right-icon>
            <van-switch 
              v-model="settings.workdayPush" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
        <van-cell title="周末推送">
          <template #right-icon>
            <van-switch 
              v-model="settings.weekendPush" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 声音设置 -->
      <van-cell-group title="提醒方式">
        <van-cell title="声音提醒">
          <template #right-icon>
            <van-switch 
              v-model="settings.sound" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
        <van-cell title="振动提醒">
          <template #right-icon>
            <van-switch 
              v-model="settings.vibration" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 紧急通知设置 -->
      <van-cell-group title="紧急通知">
        <van-cell title="紧急通知免打扰">
          <template #label>
            紧急通知将忽略免打扰时间
          </template>
          <template #right-icon>
            <van-switch 
              v-model="settings.urgentBypassDnd" 
              :disabled="!settings.enabled"
              @change="onSettingChange" 
            />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <van-button 
          type="danger" 
          block 
          @click="clearAllNotifications"
          :disabled="!settings.enabled"
        >
          清空所有通知
        </van-button>
        
        <van-button 
          type="default" 
          block 
          @click="resetSettings"
          style="margin-top: 12px;"
        >
          恢复默认设置
        </van-button>
      </div>
    </div>

    <!-- 免打扰时间选择器 -->
    <van-popup v-model:show="showDndTimePicker" position="bottom">
      <van-time-picker
        v-model="dndStartTime"
        title="选择开始时间"
        @confirm="onDndStartTimeConfirm"
        @cancel="showDndTimePicker = false"
      />
    </van-popup>

    <van-popup v-model:show="showDndEndTimePicker" position="bottom">
      <van-time-picker
        v-model="dndEndTime"
        title="选择结束时间"
        @confirm="onDndEndTimeConfirm"
        @cancel="showDndEndTimePicker = false"
      />
    </van-popup>

    <!-- 确认对话框 -->
    <van-dialog
      v-model:show="showConfirmDialog"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      show-cancel-button
      @confirm="confirmAction"
      @cancel="cancelAction"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import { getItem, setItem } from '../utils/storage.js';

const router = useRouter();

// 通知设置
const settings = ref({
  enabled: true,
  approval: true,
  site: true,
  equipment: true,
  appointment: true,
  workdayPush: true,
  weekendPush: false,
  sound: true,
  vibration: true,
  urgentBypassDnd: true,
  dndStartTime: '22:00',
  dndEndTime: '08:00'
});

// 时间选择器状态
const showDndTimePicker = ref(false);
const showDndEndTimePicker = ref(false);
const dndStartTime = ref(['22', '00']);
const dndEndTime = ref(['08', '00']);

// 确认对话框
const showConfirmDialog = ref(false);
const confirmDialog = ref({
  title: '',
  message: '',
  action: null
});

// 初始化设置
onMounted(() => {
  loadSettings();
});

// 加载设置
const loadSettings = () => {
  try {
    const savedSettings = getItem('notificationSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      settings.value = { ...settings.value, ...parsed };
    }
    
    // 初始化时间选择器
    const [startHour, startMinute] = settings.value.dndStartTime.split(':');
    const [endHour, endMinute] = settings.value.dndEndTime.split(':');
    
    dndStartTime.value = [startHour, startMinute];
    dndEndTime.value = [endHour, endMinute];
  } catch (error) {
    console.error('加载通知设置失败:', error);
  }
};

// 保存设置
const saveSettings = () => {
  try {
    setItem('notificationSettings', JSON.stringify(settings.value));
    showToast('设置已保存');
  } catch (error) {
    console.error('保存设置失败:', error);
    showToast('保存失败');
  }
};

// 设置变更处理
const onSettingChange = () => {
  saveSettings();
};

// 获取免打扰时间文本
const getDndTimeText = () => {
  return `${settings.value.dndStartTime} - ${settings.value.dndEndTime}`;
};

// 免打扰开始时间确认
const onDndStartTimeConfirm = (value) => {
  const [hours, minutes] = value;
  settings.value.dndStartTime = `${hours}:${minutes}`;
  showDndTimePicker.value = false;
  showDndEndTimePicker.value = true;
  saveSettings();
};

// 免打扰结束时间确认
const onDndEndTimeConfirm = (value) => {
  const [hours, minutes] = value;
  settings.value.dndEndTime = `${hours}:${minutes}`;
  showDndEndTimePicker.value = false;
  saveSettings();
};

// 清空所有通知
const clearAllNotifications = () => {
  confirmDialog.value = {
    title: '确认清空',
    message: '确定要清空所有通知吗？此操作无法撤销。',
    action: 'clear'
  };
  showConfirmDialog.value = true;
};

// 重置设置
const resetSettings = () => {
  confirmDialog.value = {
    title: '恢复默认',
    message: '确定要恢复默认设置吗？',
    action: 'reset'
  };
  showConfirmDialog.value = true;
};

// 确认操作
const confirmAction = () => {
  const action = confirmDialog.value.action;
  showConfirmDialog.value = false;
  
  if (action === 'clear') {
    // 清空通知逻辑
    showToast('已清空所有通知');
  } else if (action === 'reset') {
    // 重置设置
    settings.value = {
      enabled: true,
      approval: true,
      site: true,
      equipment: true,
      appointment: true,
      workdayPush: true,
      weekendPush: false,
      sound: true,
      vibration: true,
      urgentBypassDnd: true,
      dndStartTime: '22:00',
      dndEndTime: '08:00'
    };
    saveSettings();
    showToast('已恢复默认设置');
  }
};

// 取消操作
const cancelAction = () => {
  showConfirmDialog.value = false;
};
</script>

<style lang="less" scoped>
.notification-settings {
  background-color: #f7f8fa;
  min-height: 100vh;
}

.settings-container {
  padding: 16px;
}

.action-buttons {
  margin-top: 24px;
  margin-bottom: 24px;
}

:deep(.van-cell-group) {
  border-radius: 12px;
  margin-bottom: 12px;
  
  .van-cell {
    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
  }
  
  .van-cell__title {
    font-weight: 500;
  }
  
  .van-cell__label {
    color: #969799;
    font-size: 12px;
    margin-top: 4px;
  }
}

:deep(.van-switch) {
  &.van-switch--disabled {
    opacity: 0.5;
  }
}
</style>
