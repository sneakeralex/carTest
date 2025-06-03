package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

/**
 * 维修保养实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "maintenance")
public class Maintenance extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 维修保养编号
     */
    @Column(name = "maintenance_no")
    private String maintenanceNo;

    /**
     * 车辆ID
     */
    @Column(name = "vehicle_no")
    private String vehicleNo;

    /**
     * 用户ID
     */
    @Column(name = "user_id")
    private String userId;

    /**
     * 类型：1保养，2维修
     */
    @Column(name = "type")
    private Integer type;

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
     * 当前里程(km)
     */
    @Column(name = "mileage")
    private BigDecimal mileage;

    /**
     * 维修保养描述
     */
    @Column(name = "description")
    private String description;

    /**
     * 费用
     */
    @Column(name = "cost")
    private BigDecimal cost;

    /**
     * 状态：0待处理，1处理中，2已完成，3已取消
     */
    @Column(name = "status")
    private Integer status;

    /**
     * 操作人ID
     */
    @Column(name = "operator_id")
    private String operatorId;

    /**
     * 维修保养项目列表（非数据库字段）
     */
    @Transient
    private List<MaintenanceItem> items;
}