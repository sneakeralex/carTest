package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 天气记录实体
 */
@Data
@Entity
@Table(name = "weather_record")
@EqualsAndHashCode(callSuper = true)
public class WeatherRecord extends BaseEntity {

    @GeneratedValue(generator = "weather-record-id")
    @GenericGenerator(name = "weather-record-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "WR"))
    @Column(name = "weather_id", unique = true)
    private String weatherId;

    private String siteId;  // 场地ID

    @Column(nullable = false)
    private LocalDateTime recordTime;  // 记录时间

    @Column(nullable = false)
    private BigDecimal temperature;  // 温度

    @Column(nullable = false)
    private BigDecimal humidity;  // 湿度

    @Column(nullable = false)
    private BigDecimal windSpeed;  // 风速

    private String windDirection;  // 风向

    private BigDecimal rainfall;  // 降雨量

    private BigDecimal visibility;  // 能见度

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WeatherType weatherType;  // 天气类型

    @Column(length = 500)
    private String description;  // 天气描述

    @Column(nullable = false)
    private Boolean isSuitable;  // 是否适合测试

    public enum WeatherType {
        SUNNY,      // 晴天
        CLOUDY,     // 多云
        OVERCAST,   // 阴天
        RAINY,      // 雨天
        SNOWY,      // 雪天
        FOGGY,      // 雾天
        WINDY       // 大风
    }
}
