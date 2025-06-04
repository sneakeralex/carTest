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
 * 试验内容实体
 */
@Data
@Entity
@Table(name = "test_content")
@EqualsAndHashCode(callSuper = true)
public class TestContent extends BaseEntity {

    @GeneratedValue(generator = "test-content-id")
    @GenericGenerator(name = "test-content-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "TC"))
    @Column(name = "content_id", unique = true)
    private String contentId;

    @Column(name = "task_vehicle_id", nullable = false)
    private TaskVehicle taskVehicle;  // 所属任务车辆

    @Column(nullable = false)
    private String testItem;  // 测试项目

    @Column(length = 1000)
    private String testDescription;  // 测试描述

    @Column(nullable = false)
    private LocalDateTime plannedStartTime;  // 计划开始时间

    @Column(nullable = false)
    private LocalDateTime plannedEndTime;  // 计划结束时间

    private LocalDateTime actualStartTime;  // 实际开始时间
    private LocalDateTime actualEndTime;  // 实际结束时间

    @Column(length = 1000)
    private String testResults;  // 测试结果

    @Column(length = 500)
    private String testMethod;  // 测试方法

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestStatus status;  // 测试状态

    @Column(length = 1000)
    private String remarks;  // 备注

    public enum TestStatus {
        NOT_STARTED,    // 未开始
        IN_PROGRESS,    // 进行中
        COMPLETED,      // 已完成
        FAILED,         // 未通过
        CANCELLED       // 已取消
    }
}
