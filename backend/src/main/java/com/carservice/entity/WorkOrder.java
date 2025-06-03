package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * 维修工单实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "work_order")
public class WorkOrder extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 工单编号
     */
    @Column(name = "order_no")
    private String orderNo;

    /**
     * 维修保养ID
     */
    @Column(name = "maintenance_id")
    private String maintenanceId;

    /**
     * 车辆ID
     */
    @Column(name = "vehicle_no")
    private String vehicleNo;

    /**
     * 技术人员ID
     */
    @Column(name = "technician_id")
    private String technicianId;

    /**
     * 状态：0待分配，1处理中，2已完成，3已取消
     */
    @Column(name = "status")
    private Integer status;

    /**
     * 开始时间
     */
    @Column(name = "start_time")
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    @Column(name = "end_time")
    private LocalDateTime endTime;

    /**
     * 备注
     */
    @Column(name = "description")
    private String description;
}