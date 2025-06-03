package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 设备领用/使用申请实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "equipment_request")
public class EquipmentRequest extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 申请编号
     */
    @Column(name = "request_no", nullable = false, unique = true)
    private String requestNo;

    /**
     * 设备ID
     */
    @Column(name = "equipment_id", nullable = false)
    private String equipmentId;

    /**
     * 申请人ID
     */
    @Column(name = "applicant_id", nullable = false)
    private String applicantId;

    /**
     * 申请部门ID
     */
    @Column(name = "department_id", nullable = false)
    private String departmentId;

    /**
     * 申请类型：1-领用，2-使用
     */
    @Column(name = "request_type", nullable = false)
    private Integer requestType;

    /**
     * 预计开始时间
     */
    @Column(name = "expected_start_time", nullable = false)
    private LocalDateTime expectedStartTime;

    /**
     * 预计结束时间
     */
    @Column(name = "expected_end_time", nullable = false)
    private LocalDateTime expectedEndTime;

    /**
     * 实际开始时间
     */
    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    /**
     * 实际结束时间
     */
    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    /**
     * 用途说明
     */
    @Column(name = "purpose", length = 500)
    private String purpose;

    /**
     * 申请状态：0-待审批，1-已批准，2-已拒绝，3-已领用/使用，4-已归还
     */
    @Column(name = "status", nullable = false)
    private Integer status = 0;

    /**
     * 审批人ID
     */
    @Column(name = "approver_id")
    private String approverId;

    /**
     * 审批时间
     */
    @Column(name = "approve_time")
    private LocalDateTime approveTime;

    /**
     * 审批意见
     */
    @Column(name = "approve_remark")
    private String approveRemark;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
}
