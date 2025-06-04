package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import com.carservice.entity.Message.MessageType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;


/**
 * 消息设置实体
 */
@Data
@Entity
@Table(name = "message_setting")
@EqualsAndHashCode(callSuper = true)
public class MessageSetting extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String settingId;

    private String userId;  // 用户ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageType messageType;  // 消息类型

    @Column(nullable = false)
    private Boolean emailEnabled;    // 是否启用邮件通知

    @Column(nullable = false)
    private Boolean smsEnabled;      // 是否启用短信通知

    @Column(nullable = false)
    private Boolean pushEnabled;     // 是否启用推送通知

    @Column(nullable = false)
    private Boolean inAppEnabled;    // 是否启用应用内通知

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationFrequency frequency;  // 通知频率

    @Column(nullable = false)
    private Boolean muteAll;  // 是否全部静音

    @Column
    private String workingHours;  // 工作时间设置（JSON格式）

    public enum NotificationFrequency {
        IMMEDIATE,    // 即时
        HOURLY,      // 每小时
        DAILY,       // 每天
        WEEKLY       // 每周
    }
}
