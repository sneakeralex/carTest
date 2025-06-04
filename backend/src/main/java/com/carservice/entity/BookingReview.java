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
 * 预约审批记录实体
 */
@Data
@Entity
@Table(name = "booking_review")
@EqualsAndHashCode(callSuper = true)
public class BookingReview extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String reviewId;

    private String bookingId;  // 预约ID

    private String reviewerId;  // 审批人ID

    @Column(nullable = false)
    private LocalDateTime reviewTime;  // 审批时间

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status;  // 审批状态

    @Column(length = 1000)
    private String comments;  // 审批意见

    @Column(length = 500)
    private String requirements;  // 特殊要求或条件

    private Integer priority;  // 优先级

    @Column(length = 500)
    private String rejectionReason;  // 驳回原因

    private Boolean needsFollowUp;  // 是否需要后续跟进

    public enum ReviewStatus {
        PENDING,     // 待审批
        APPROVED,    // 已批准
        REJECTED,    // 已驳回
        PENDING_CHANGE,  // 待修改
        CANCELLED    // 已取消
    }
}
