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
 * 场地预约实体
 */
@Data
@Entity
@Table(name = "site_booking")
@EqualsAndHashCode(callSuper = true)
public class SiteBooking extends BaseEntity {

    @GeneratedValue(generator = "site-booking-id")
    @GenericGenerator(name = "site-booking-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "SB"))
    @Column(name = "booking_id", unique = true)
    private String bookingId;

    private String testContentId;  // 试验内容ID
    
    private String siteId;  // 场地ID
    
    private String scheduleId;  // 排期ID

    @Column(nullable = false)
    private LocalDateTime startTime;  // 预约开始时间

    @Column(nullable = false)
    private LocalDateTime endTime;    // 预约结束时间

    private String vehicleId;  // 车辆ID

    private String userId;    // 预约人ID

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;  // 预约状态

    @Column(length = 1000)
    private String purpose;  // 预约用途

    @Column(length = 500)
    private String requirements;  // 特殊要求

    private String weatherId;  // 关联的天气记录ID

    @Column(length = 500)
    private String cancellationReason;  // 取消原因

    @Column(length = 100)
    private String contactPerson;  // 联系人

    @Column(length = 20)
    private String contactPhone;  // 联系电话

    @Column(length = 1000)
    private String notes;  // 备注

    public enum BookingStatus {
        PENDING,     // 待确认
        APPROVED,    // 已批准
        REJECTED,    // 已拒绝
        CONFIRMED,   // 已确认
        IN_PROGRESS, // 进行中
        COMPLETED,   // 已完成
        CANCELLED,   // 已取消
        NO_SHOW      // 未到场
    }
}
