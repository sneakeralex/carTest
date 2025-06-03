package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 维修项目实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "maintenance_item")
public class MaintenanceItem extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 项目ID
     */
    private String itemId;

    /**
     * 维修保养ID
     */
    private String maintenanceNo;

    /**
     * 项目名称
     */
    private String itemName;

    /**
     * 项目编码
     */
    private String itemCode;

    /**
     * 数量
     */
    private Integer quantity;

    /**
     * 单价
     */
    private BigDecimal unitPrice;

    /**
     * 总价
     */
    private BigDecimal totalPrice;

    /**
     * 备注
     */
    private String remark;


}