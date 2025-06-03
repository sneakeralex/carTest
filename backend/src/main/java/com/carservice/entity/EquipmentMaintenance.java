package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 设备维护保养记录实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "equipment_maintenance")
public class EquipmentMaintenance extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 维护保养编号
     */
    @Column(name = "maintenance_no", nullable = false, unique = true)
    private String maintenanceNo;

    /**
     * 设备ID
     */
    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;

    /**
     * 维护保养类型：1-日常保养，2-定期保养，3-故障维修
     */
    @Column(name = "maintenance_type", nullable = false)
    private Integer maintenanceType;

    /**
     * 维护保养状态：0-待处理，1-进行中，2-已完成，3-已取消
     */
    @Column(name = "status", nullable = false)
    private Integer status = 0;

    /**
     * 计划开始时间
     */
    @Column(name = "planned_start_time")
    private LocalDateTime plannedStartTime;

    /**
     * 计划完成时间
     */
    @Column(name = "planned_end_time")
    private LocalDateTime plannedEndTime;

    /**
     * 实际开始时间
     */
    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    /**
     * 实际完成时间
     */
    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    /**
     * 维护保养内容
     */
    @Column(name = "maintenance_content", length = 1000)
    private String maintenanceContent;

    /**
     * 故障描述（适用于故障维修）
     */
    @Column(name = "fault_description", length = 500)
    private String faultDescription;

    /**
     * 维修方案
     */
    @Column(name = "repair_solution", length = 1000)
    private String repairSolution;

    /**
     * 维护保养结果
     */
    @Column(name = "maintenance_result", length = 500)
    private String maintenanceResult;

    /**
     * 维护保养费用
     */
    @Column(name = "maintenance_cost", precision = 10, scale = 2)
    private BigDecimal maintenanceCost;

    /**
     * 负责人ID
     */
    @Column(name = "maintainer_id", nullable = false)
    private String maintainerId;

    /**
     * 执行人员（可多人，用逗号分隔）
     */
    @Column(name = "executor_ids")
    private String executorIds;

    /**
     * 下次保养时间
     */
    @Column(name = "next_maintenance_time")
    private LocalDateTime nextMaintenanceTime;

    /**
     * 质检结果：0-未质检，1-合格，2-不合格
     */
    @Column(name = "quality_check_result")
    private Integer qualityCheckResult;

    /**
     * 质检人ID
     */
    @Column(name = "quality_checker_id")
    private String qualityCheckerId;

    /**
     * 质检时间
     */
    @Column(name = "quality_check_time")
    private LocalDateTime qualityCheckTime;

    /**
     * 质检意见
     */
    @Column(name = "quality_check_remark", length = 500)
    private String qualityCheckRemark;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
}
