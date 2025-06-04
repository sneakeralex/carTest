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

import java.time.LocalDateTime;

/**
 * 场地消息详情实体
 */
@Data
@Entity
@Table(name = "site_message")
@EqualsAndHashCode(callSuper = true)
public class SiteMessage extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String siteMessageId;

    private String messageId;  // 关联的消息ID

    private String siteId;    // 场地ID
    private String bookingId; // 预约ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SiteNotificationType notificationType;  // 通知类型

    private LocalDateTime eventTime;  // 事件发生时间

    @Column(length = 1000)
    private String siteStatus;  // 场地状态信息

    @Column(length = 500)
    private String weatherInfo; // 天气信息

    public enum SiteNotificationType {
        MAINTENANCE_ALERT,    // 维护提醒
        WEATHER_WARNING,      // 天气预警
        SCHEDULE_CHANGE,      // 排期变更
        CAPACITY_WARNING,     // 容量预警
        EMERGENCY            // 紧急通知
    }
}
