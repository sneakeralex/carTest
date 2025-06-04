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
 * 设备消息详情实体
 */
@Data
@Entity
@Table(name = "equipment_message")
@EqualsAndHashCode(callSuper = true)
public class EquipmentMessage extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String equipmentMessageId;

    private String messageId;     // 关联的消息ID

    private String equipmentId;   // 设备ID
    private String borrowRecordId; // 借用记录ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EquipmentNotificationType notificationType;  // 通知类型

    @Column(nullable = false)
    private LocalDateTime dueDate;  // 归还截止日期

    private LocalDateTime actualReturnDate;  // 实际归还日期

    @Column(length = 500)
    private String equipmentStatus;  // 设备状态

    private Integer overdueHours;    // 超期小时数

    @Column(length = 1000)
    private String returnInstructions;  // 归还说明

    public enum EquipmentNotificationType {
        RETURN_REMINDER,    // 归还提醒
        OVERDUE_ALERT,     // 超期提醒
        MAINTENANCE_DUE,    // 维护到期
        DAMAGE_REPORT,      // 损坏报告
        STATUS_UPDATE      // 状态更新
    }
}
