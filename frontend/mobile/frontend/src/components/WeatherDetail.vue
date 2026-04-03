<!-- 天气详情组件 -->
<template>
  <div class="weather-detail-component">
    <!-- 天气信息概览卡片 -->
    <div class="weather-card" @click="showDetail" v-if="weatherInfo">
      <div class="weather-main">
        <van-icon :name="getWeatherIcon(weatherInfo.weatherCode)" size="24" />
        <div class="temp-info">
          <span class="temperature">{{ weatherInfo.temperature }}°C</span>
          <span class="weather-desc">{{ weatherInfo.weather }}</span>
        </div>
      </div>
      <div class="weather-meta">
        <span class="feels-like">体感 {{ weatherInfo.feelsLike }}°C</span>
        <van-tag :type="weatherInfo.suitable ? 'success' : 'danger'" size="small">
          {{ weatherInfo.suitable ? '适合测试' : '不适合测试' }}
        </van-tag>
      </div>
    </div>

    <!-- 天气详情弹窗 -->
    <van-popup 
      v-model:show="showWeatherDetail" 
      position="bottom" 
      round 
      closeable
      :style="{ height: '80%' }"
    >
      <div class="weather-detail-popup">
        <!-- 弹窗标题 -->
        <div class="popup-header">
          <h3>天气详情</h3>
          <span class="location">{{ weatherInfo?.city }} {{ weatherInfo?.district }}</span>
        </div>

        <div class="weather-detail-content" v-if="weatherInfo">
          <!-- 当前天气概览 -->
          <van-cell-group inset title="当前天气">
            <van-cell>
              <template #title>
                <div class="current-weather">
                  <van-icon :name="getWeatherIcon(weatherInfo.weatherCode)" size="32" />
                  <div class="current-info">
                    <span class="current-temp">{{ weatherInfo.temperature }}°C</span>
                    <span class="weather-type">{{ weatherInfo.weather }}</span>
                  </div>
                </div>
              </template>
              <template #label>
                <div class="weather-summary">
                  <div>体感温度 {{ weatherInfo.feelsLike }}°C</div>
                  <div>{{ weatherInfo.description }}</div>
                </div>
              </template>
            </van-cell>
            <van-cell title="温度范围" :value="`${weatherInfo.tempMin}°C ~ ${weatherInfo.tempMax}°C`" />
            <van-cell title="适宜性">
              <template #value>
                <van-tag :type="weatherInfo.suitable ? 'success' : 'danger'">
                  {{ weatherInfo.suitable ? '适合测试' : '不适合测试' }}
                </van-tag>
              </template>
            </van-cell>
          </van-cell-group>

          <!-- 空气质量 -->
          <van-cell-group inset title="空气质量">
            <van-cell title="AQI指数" :value="weatherInfo.aqi" />
            <van-cell title="空气质量">
              <template #value>
                <van-tag :type="getAqiType(weatherInfo.aqi)">{{ weatherInfo.aqiLevel }}</van-tag>
              </template>
            </van-cell>
            <van-cell title="能见度" :value="`${weatherInfo.visibility}km`" />
          </van-cell-group>

          <!-- 风力湿度 -->
          <van-cell-group inset title="风力湿度">
            <van-cell title="风向风速" :value="`${weatherInfo.windDirection} ${weatherInfo.windSpeed}km/h`" />
            <van-cell title="风力等级" :value="weatherInfo.windLevel" />
            <van-cell title="相对湿度" :value="`${weatherInfo.humidity}%`" />
            <van-cell title="气压" :value="`${weatherInfo.pressure}hPa`" />
          </van-cell-group>

          <!-- 紫外线和降水 -->
          <van-cell-group inset title="紫外线和降水">
            <van-cell title="紫外线指数" :value="weatherInfo.uvIndex" />
            <van-cell title="紫外线强度">
              <template #value>
                <van-tag :type="getUvType(weatherInfo.uvIndex)">{{ weatherInfo.uvLevel }}</van-tag>
              </template>
            </van-cell>
            <van-cell title="降水量" :value="`${weatherInfo.precipitation}mm`" />
            <van-cell title="降水概率" :value="`${weatherInfo.precipitationProbability}%`" />
          </van-cell-group>

          <!-- 日出日落 -->
          <van-cell-group inset title="日出日落">
            <van-cell title="日出时间" :value="weatherInfo.sunrise" />
            <van-cell title="日落时间" :value="weatherInfo.sunset" />
            <van-cell title="更新时间" :value="formatDateTime(weatherInfo.updateTime)" />
          </van-cell-group>

          <!-- 未来24小时预报 -->
          <van-cell-group inset title="24小时预报" v-if="weatherInfo.hourlyForecast">
            <div class="hourly-forecast">
              <div 
                v-for="hour in weatherInfo.hourlyForecast" 
                :key="hour.time"
                class="hourly-item"
              >
                <div class="hour-time">{{ hour.time }}</div>
                <van-icon :name="getWeatherIcon(hour.weather)" size="20" />
                <div class="hour-temp">{{ hour.temp }}°</div>
                <div class="hour-wind">{{ hour.windSpeed }}km/h</div>
              </div>
            </div>
          </van-cell-group>

          <!-- 未来3天预报 -->
          <van-cell-group inset title="3天预报" v-if="weatherInfo.dailyForecast">
            <van-cell 
              v-for="day in weatherInfo.dailyForecast" 
              :key="day.date"
              :title="formatForecastDate(day.date)"
              :label="day.description"
            >
              <template #value>
                <div class="daily-forecast-item">
                  <van-icon :name="getWeatherIcon(day.weather)" size="16" />
                  <span>{{ day.tempMin }}°~{{ day.tempMax }}°</span>
                  <van-tag :type="day.suitable ? 'success' : 'danger'" size="small">
                    {{ day.suitable ? '适合' : '不适合' }}
                  </van-tag>
                </div>
              </template>
            </van-cell>
          </van-cell-group>

          <!-- 测试建议 -->
          <van-cell-group inset title="测试建议">
            <van-cell>
              <template #title>
                <div class="test-advice">
                  <van-icon name="info-o" />
                  <span>{{ weatherInfo.suitabilityReason }}</span>
                </div>
              </template>
            </van-cell>
            
            <!-- 详细测试建议 -->
            <div class="testing-recommendations">
              <div 
                v-for="recommendation in getTestingRecommendations()" 
                :key="recommendation.title"
                :class="['recommendation-item', recommendation.type]"
              >
                <div class="recommendation-title">{{ recommendation.title }}</div>
                <div class="recommendation-content">{{ recommendation.content }}</div>
              </div>
            </div>
          </van-cell-group>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  weatherInfo: {
    type: Object,
    default: () => ({})
  },
  compact: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['click', 'detail-show', 'detail-hide']);

// 状态
const showWeatherDetail = ref(false);

// 显示详情
const showDetail = () => {
  showWeatherDetail.value = true;
  emit('detail-show');
};

// 隐藏详情
const hideDetail = () => {
  showWeatherDetail.value = false;
  emit('detail-hide');
};

// 天气图标映射
const getWeatherIcon = (weatherCode) => {
  const iconMap = {
    'sunny': 'sun-o',
    'cloudy': 'cloud-o',
    'rainy': 'umbrella-o',
    'snowy': 'snowflake-o',
    'foggy': 'fog-o',
    'windy': 'fire-o',
    '晴': 'sun-o',
    '多云': 'cloud-o',
    '小雨': 'umbrella-o',
    '中雨': 'umbrella-o',
    '大雨': 'umbrella-o',
    '雪': 'snowflake-o',
    '雾': 'fog-o'
  };
  return iconMap[weatherCode] || 'sun-o';
};

// AQI类型映射
const getAqiType = (aqi) => {
  if (aqi <= 50) return 'success';
  if (aqi <= 100) return 'warning';
  if (aqi <= 150) return 'danger';
  return 'danger';
};

// UV指数类型映射
const getUvType = (uvIndex) => {
  if (uvIndex <= 2) return 'success';
  if (uvIndex <= 5) return 'warning';
  if (uvIndex <= 7) return 'danger';
  return 'danger';
};

// 格式化日期时间
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 格式化预报日期
const formatForecastDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return '明天';
  } else {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 获取测试建议
const getTestingRecommendations = () => {
  if (!props.weatherInfo) return [];

  const recommendations = [];
  const weather = props.weatherInfo;

  // 温度建议
  if (weather.temperature < 10) {
    recommendations.push({
      title: '低温提醒',
      content: '当前温度较低，建议进行室内测试或延后测试',
      type: 'warning'
    });
  } else if (weather.temperature > 30) {
    recommendations.push({
      title: '高温提醒',
      content: '当前温度较高，注意设备散热和人员防暑',
      type: 'warning'
    });
  }

  // 风速建议
  if (weather.windSpeed > 20) {
    recommendations.push({
      title: '大风提醒',
      content: '当前风速较大，可能影响测试精度，建议谨慎进行',
      type: 'danger'
    });
  }

  // 降水建议
  if (weather.precipitation > 0) {
    recommendations.push({
      title: '降水提醒',
      content: '当前有降水，建议暂停户外测试',
      type: 'danger'
    });
  }

  // 能见度建议
  if (weather.visibility < 10) {
    recommendations.push({
      title: '能见度不佳',
      content: '当前能见度较低，可能影响测试安全',
      type: 'warning'
    });
  }

  // 空气质量建议
  if (weather.aqi > 150) {
    recommendations.push({
      title: '空气质量较差',
      content: '建议减少户外测试时间，注意人员防护',
      type: 'warning'
    });
  }

  // 理想条件建议
  if (weather.suitable && recommendations.length === 0) {
    recommendations.push({
      title: '理想测试条件',
      content: '当前天气条件非常适合进行各类汽车测试',
      type: 'success'
    });
  }

  return recommendations;
};
</script>

<style lang="less" scoped>
.weather-detail-component {
  .weather-card {
    background: linear-gradient(135deg, #1989fa 0%, #0066cc 100%);
    border-radius: 12px;
    padding: 16px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(25, 137, 250, 0.3);
    }

    .weather-main {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

      .temp-info {
        display: flex;
        flex-direction: column;

        .temperature {
          font-size: 24px;
          font-weight: 600;
        }

        .weather-desc {
          font-size: 14px;
          opacity: 0.9;
        }
      }
    }

    .weather-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .feels-like {
        font-size: 12px;
        opacity: 0.8;
      }
    }
  }

  .weather-detail-popup {
    padding: 16px;
    background-color: #f7f8fa;
    min-height: 100%;
    
    .popup-header {
      text-align: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebedf0;
      
      h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 4px 0;
      }
      
      .location {
        font-size: 14px;
        color: #969799;
      }
    }
    
    .weather-detail-content {
      .van-cell-group {
        margin-bottom: 16px;
        border-radius: 12px;
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      .current-weather {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .current-info {
          display: flex;
          flex-direction: column;
          
          .current-temp {
            font-size: 20px;
            font-weight: 600;
            color: #1989fa;
          }
          
          .weather-type {
            font-size: 16px;
            color: #323233;
          }
        }
      }
      
      .weather-summary {
        margin-top: 8px;
        
        div {
          font-size: 12px;
          color: #969799;
          margin: 2px 0;
        }
      }

      .test-advice {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .van-icon {
          color: #1989fa;
        }
      }
      
      .hourly-forecast {
        display: flex;
        gap: 12px;
        overflow-x: auto;
        padding: 12px 0;
        
        .hourly-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 12px 8px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          min-width: 60px;
          
          .hour-time {
            font-size: 12px;
            color: #969799;
          }
          
          .hour-temp {
            font-size: 14px;
            font-weight: 600;
            color: #323233;
          }
          
          .hour-wind {
            font-size: 10px;
            color: #969799;
          }
        }
      }
      
      .daily-forecast-item {
        display: flex;
        align-items: center;
        gap: 8px;
        
        span {
          font-size: 14px;
          color: #323233;
        }
      }
      
      .testing-recommendations {
        margin-top: 8px;
        
        .recommendation-item {
          padding: 12px 16px;
          margin-bottom: 8px;
          background-color: #fff;
          border-radius: 8px;
          border-left: 4px solid #1989fa;
          
          &.warning {
            border-left-color: #ff976a;
          }
          
          &.danger {
            border-left-color: #ee0a24;
          }
          
          &.success {
            border-left-color: #07c160;
          }
          
          .recommendation-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .recommendation-content {
            font-size: 12px;
            color: #969799;
          }
        }
      }
    }
  }
}
</style>
