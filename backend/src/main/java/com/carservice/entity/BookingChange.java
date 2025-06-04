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
 * 预约变更记录实体
 */
@Data
@Entity
@Table(name = "booking_change")
@EqualsAndHashCode(callSuper = true)
public class BookingChange extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String changeId;

    private String bookingId;  // 预约ID

    private String reviewId;   // 关联的审批记录ID

    private String requesterId;  // 申请人ID

    private String approverId;   // 审批人ID

    @Column(nullable = false)
    private LocalDateTime requestTime;  // 申请时间

    private LocalDateTime approvalTime;  // 审批时间

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ChangeType changeType;  // 变更类型

    @Column(nullable = false)
    private LocalDateTime originalStartTime;  // 原始开始时间

    @Column(nullable = false)
    private LocalDateTime originalEndTime;    // 原始结束时间

    private LocalDateTime newStartTime;      // 新的开始时间

    private LocalDateTime newEndTime;        // 新的结束时间

    private String originalSiteId;  // 原始场地ID

    private String newSiteId;      // 新的场地ID

    @Column(length = 1000)
    private String changeReason;  // 变更原因

    @Column(length = 1000)
    private String remarks;  // 备注

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChangeStatus status;  // 变更状态

    public enum ChangeType {
        RESCHEDULE,     // 改期
        SITE_CHANGE,    // 更换场地
        CANCEL,         // 取消预约
        TIME_EXTEND,    // 延长时间
        TIME_SHORTEN    // 缩短时间
    }

    public enum ChangeStatus {
        PENDING,     // 待审批
        APPROVED,    // 已批准
        REJECTED,    // 已驳回
        CANCELLED    // 已取消
    }
}
