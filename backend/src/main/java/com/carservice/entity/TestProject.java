package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

import java.util.List;

/**
 * 试验项目信息实体
 */
@Data
@Entity
@Table(name = "test_project")
@EqualsAndHashCode(callSuper = true)
public class TestProject extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String projectId;

    @JoinColumn(name = "task_id", nullable = false)
    private String testTaskId; // 所属试验任务

    @Column(nullable = false)
    private String projectName; // 项目名称

    @Column(nullable = false)
    private String projectCode; // 项目编号

    @Column(columnDefinition = "json")
    private List<TaskVehicle> taskVehicles; // 项目相关车辆

    @Column(length = 1000)
    private String requirements; // 项目要求

    @Column(length = 500)
    private String standards; // 测试标准

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectStatus status; // 项目状态

    public enum ProjectStatus {
        NOT_STARTED, // 未开始
        IN_PROGRESS, // 进行中
        COMPLETED, // 已完成
        SUSPENDED // 已暂停
    }
}
