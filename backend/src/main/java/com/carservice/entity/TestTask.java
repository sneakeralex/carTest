package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * 试验任务实体
 */
@Data
@Entity
@Table(name = "test_task")
@EqualsAndHashCode(callSuper = true)
public class TestTask extends BaseEntity {

    @GeneratedValue(generator = "test-task-id")
    @Column(name = "task_id", unique = true)
    private String taskId;

    @Column(nullable = false)
    private String taskNo;  // 试验任务编号

    @Column(name = "contract_no")
    private String contractNo;  // 关联的合同

    @Column(name = "authorizer_id")
    private String authorizerId;  // 授权人

    @Column(nullable = false)
    private LocalDateTime authorizationTime;  // 授权时间

    @Column(columnDefinition = "json")
    private String projects;  // 试验项目列表(JSON格式)

    @Column(length = 1000)
    private String description;  // 任务描述

    @Column(length = 1000)
    private String requirements;  // 任务要求

    @Column(length = 1000)
    private String notes;  // 备注

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestTaskStatus status;  // 任务状态

    @Column(nullable = false)
    private LocalDateTime plannedStartTime;  // 计划开始时间

    @Column(nullable = false)
    private LocalDateTime plannedEndTime;  // 计划结束时间

    private LocalDateTime actualStartTime;  // 实际开始时间
    private LocalDateTime actualEndTime;  // 实际结束时间

    public enum TestTaskStatus {
        DRAFT,        // 草稿
        PENDING,      // 待审核
        APPROVED,     // 已审核
        IN_PROGRESS,  // 进行中
        COMPLETED,    // 已完成
        CANCELLED    // 已取消
    }
}