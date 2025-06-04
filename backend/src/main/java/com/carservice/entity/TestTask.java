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
 * 试验任务实体
 */
@Data
@Entity
@Table(name = "test_task")
@EqualsAndHashCode(callSuper = true)
public class TestTask extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String taskId;

    @Column(nullable = false)
    private String taskNo;  // 试验任务编号

    @Column(name = "contract_no")
    private String contractNo;  // 关联的合同

    @Column(name = "authorizer_id")
    private String authorizerId;  // 授权人

    @Column(nullable = false)
    private LocalDateTime authorizationDate;  // 授权日期

    @Column(columnDefinition = "json")
    private String projects;  // 试验项目列表(JSON格式)

    @Column(length = 1000)
    private String description;  // 任务描述

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TestTaskStatus status;  // 任务状态

    @Column(nullable = false)
    private LocalDateTime plannedStartDate;  // 计划开始日期

    @Column(nullable = false)
    private LocalDateTime plannedEndDate;  // 计划结束日期

    private LocalDateTime actualStartDate;  // 实际开始日期
    private LocalDateTime actualEndDate;  // 实际结束日期

    public enum TestTaskStatus {
        DRAFT,        // 草稿
        PENDING,      // 待审核
        APPROVED,     // 已审核
        IN_PROGRESS,  // 进行中
        COMPLETED,    // 已完成
        CANCELLED    // 已取消
    }
}
