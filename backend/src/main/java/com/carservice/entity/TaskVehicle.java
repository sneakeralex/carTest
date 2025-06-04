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

import java.util.List;

/**
 * 任务车辆关联实体
 */
@Data
@Entity
@Table(name = "task_vehicle_rel")
@EqualsAndHashCode(callSuper = true)
public class TaskVehicle extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String taskId;

    @Column(name = "project_id", nullable = false)
    private TestProject testProject; // 所属试验项目

    @Column(name = "vehicle_id", nullable = false)
    private String vehicleId; // 试验车辆

    @Column(columnDefinition = "json")
    private List<TestContent> testContents; // 试验内容列表

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleTestStatus status; // 车辆试验状态

    @Column(length = 500)
    private String notes; // 备注

    public enum VehicleTestStatus {
        PENDING, // 待测试
        TESTING, // 测试中
        COMPLETED, // 已完成
        FAILED // 未通过
    }
}
