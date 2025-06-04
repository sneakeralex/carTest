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
 * 消息发送记录实体
 */
@Data
@Entity
@Table(name = "message_delivery")
@EqualsAndHashCode(callSuper = true)
public class MessageDelivery extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String deliveryId;

    private String messageId;     // 消息ID
    private String templateId;    // 模板ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DeliveryChannel channel;  // 发送渠道

    @Column(nullable = false)
    private LocalDateTime sendTime;   // 发送时间

    private LocalDateTime deliveredTime;  // 送达时间

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;    // 发送状态

    @Column(length = 500)
    private String errorMessage;      // 错误信息

    private Integer retryCount;       // 重试次数

    @Column(length = 1000)
    private String deliveryDetails;   // 发送详情（JSON格式）

    public enum DeliveryChannel {
        EMAIL,   // 邮件
        SMS,     // 短信
        PUSH,    // 推送
        IN_APP   // 应用内
    }

    public enum DeliveryStatus {
        PENDING,      // 待发送
        SENDING,      // 发送中
        DELIVERED,    // 已送达
        FAILED,       // 发送失败
        CANCELLED     // 已取消
    }
}
