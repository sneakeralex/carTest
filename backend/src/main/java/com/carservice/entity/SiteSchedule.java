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
 * 场地排期实体
 */
@Data
@Entity
@Table(name = "site_schedule")
@EqualsAndHashCode(callSuper = true)
public class SiteSchedule extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String scheduleId;

    private String siteId;  // 场地ID

    @Column(nullable = false)
    private LocalDateTime startTime;  // 开始时间

    @Column(nullable = false)
    private LocalDateTime endTime;    // 结束时间

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleType scheduleType;  // 排期类型

    @Column(nullable = false)
    private Boolean isAvailable;  // 是否可预约

    private String reason;  // 不可用原因（如果不可预约）

    private Integer remainingSlots;  // 剩余可预约数量

    @Column(length = 500)
    private String notes;  // 备注

    public enum ScheduleType {
        NORMAL,         // 正常营业
        MAINTENANCE,    // 场地维护
        RESERVED,       // 特殊预留
        HOLIDAY        // 节假日
    }
}
