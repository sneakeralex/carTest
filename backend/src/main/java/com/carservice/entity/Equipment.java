package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 设备信息实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "equipment")
public class Equipment extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @GeneratedValue(generator = "equipment-id")
    @GenericGenerator(name = "equipment-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "EQP"))
    @Column(name = "equipment_id", unique = true)
    private String equipmentId;

    /**
     * 设备编号
     */
    @Column(name = "equipment_no", nullable = false, unique = true)
    private String equipmentNo;

    /**
     * 设备名称
     */
    @Column(name = "equipment_name", nullable = false)
    private String equipmentName;

    /**
     * 设备类型
     */
    @Column(name = "equipment_type")
    private String equipmentType;

    /**
     * 规格型号
     */
    @Column(name = "specification")
    private String specification;

    /**
     * 生产厂家
     */
    @Column(name = "manufacturer")
    private String manufacturer;

    /**
     * 购置日期
     */
    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;

    /**
     * 购置价格
     */
    @Column(name = "purchase_price", precision = 10, scale = 2)
    private BigDecimal purchasePrice;

    /**
     * 使用部门ID
     */
    @Column(name = "department_id")
    private String departmentId;

    /**
     * 存放地点
     */
    @Column(name = "location")
    private String location;

    /**
     * 设备状态：0-闲置，1-使用中，2-维修中，3-报废
     */
    @Column(name = "status", nullable = false)
    private Integer status = 0;

    /**
     * 保养周期(天)
     */
    @Column(name = "maintenance_cycle")
    private Integer maintenanceCycle;

    /**
     * 上次保养日期
     */
    @Column(name = "last_maintenance_date")
    private LocalDateTime lastMaintenanceDate;

    /**
     * 下次保养日期
     */
    @Column(name = "next_maintenance_date")
    private LocalDateTime nextMaintenanceDate;

    /**
     * 设备说明
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
}
