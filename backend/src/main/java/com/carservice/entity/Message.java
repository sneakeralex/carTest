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
 * 消息实体
 */
@Data
@Entity
@Table(name = "message")
@EqualsAndHashCode(callSuper = true)
public class Message extends BaseEntity {

    @GeneratedValue(generator = "message-id")
    @GenericGenerator(name = "message-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "MSG"))
    @Column(name = "message_id", unique = true)
    private String messageId;

    private String senderId;    // 发送者ID
    private String receiverId;  // 接收者ID

    @Column(nullable = false)
    private String title;       // 消息标题

    @Column(length = 2000)
    private String content;     // 消息内容

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageType messageType;  // 消息类型

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MessagePriority priority;  // 消息优先级

    @Column(nullable = false)
    private LocalDateTime sendTime;    // 发送时间

    private LocalDateTime readTime;    // 阅读时间

    @Column(nullable = false)
    private Boolean isRead;    // 是否已读

    private String relatedId;  // 关联业务ID（如审批ID、场地ID等）

    @Column(length = 500)
    private String actionUrl;  // 消息关联的操作链接

    public enum MessageType {
        APPROVAL,           // 审批消息
        SITE,              // 场地消息
        EQUIPMENT_RETURN,   // 设备归还提醒
        BOOKING,           // 预约相关
        SYSTEM,            // 系统消息
        MAINTENANCE        // 维护提醒
    }

    public enum MessagePriority {
        HIGH,     // 高优先级
        MEDIUM,   // 中优先级
        LOW       // 低优先级
    }
}
