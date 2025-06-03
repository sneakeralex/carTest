package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * 设备台账实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "equipment_ledger")
public class EquipmentLedger extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 设备ID
     */
    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;

    /**
     * 记录类型：1-购置，2-领用，3-归还，4-维修，5-保养，6-转移，7-报废
     */
    @Column(name = "record_type", nullable = false)
    private Integer recordType;

    /**
     * 关联记录ID（领用/维保记录ID）
     */
    @Column(name = "related_record_id")
    private String relatedRecordId;

    /**
     * 操作前状态
     */
    @Column(name = "before_status")
    private Integer beforeStatus;

    /**
     * 操作后状态
     */
    @Column(name = "after_status", nullable = false)
    private Integer afterStatus;

    /**
     * 操作部门ID
     */
    @Column(name = "department_id")
    private String departmentId;

    /**
     * 原部门ID（用于转移）
     */
    @Column(name = "from_department_id")
    private String fromDepartmentId;

    /**
     * 目标部门ID（用于转移）
     */
    @Column(name = "to_department_id")
    private String toDepartmentId;

    /**
     * 操作人ID
     */
    @Column(name = "operator_id", nullable = false)
    private String operatorId;

    /**
     * 操作时间
     */
    @Column(name = "operation_time", nullable = false)
    private LocalDateTime operationTime;

    /**
     * 变更说明
     */
    @Column(name = "change_description", length = 500)
    private String changeDescription;

    /**
     * 位置变更
     */
    @Column(name = "location_change")
    private String locationChange;

    /**
     * 使用时长（小时）
     */
    @Column(name = "usage_hours")
    private Double usageHours;

    /**
     * 累计使用时长（小时）
     */
    @Column(name = "total_usage_hours")
    private Double totalUsageHours;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
}
