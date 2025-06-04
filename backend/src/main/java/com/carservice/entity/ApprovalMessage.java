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
 * 审批消息详情实体
 */
@Data
@Entity
@Table(name = "approval_message")
@EqualsAndHashCode(callSuper = true)
public class ApprovalMessage extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String approvalMessageId;

    private String messageId;  // 关联的消息ID

    private String approvalId;  // 审批记录ID

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ApprovalType approvalType;  // 审批类型

    @Column(nullable = false)
    private LocalDateTime approvalDeadline;  // 审批截止时间

    @Column(length = 1000)
    private String approvalDetails;  // 审批详情

    private String previousApproverId;  // 上一个审批人
    private String nextApproverId;      // 下一个审批人

    @Column(nullable = false)
    private Integer currentStep;        // 当前审批步骤
    private Integer totalSteps;         // 总审批步骤

    public enum ApprovalType {
        BOOKING,           // 预约审批
        EQUIPMENT_APPLY,   // 设备申请
        SITE_RESERVATION,  // 场地预订
        TEST_TASK,        // 试验任务
        MAINTENANCE       // 维护申请
    }
}
