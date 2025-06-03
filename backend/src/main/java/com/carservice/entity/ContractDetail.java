package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 合同明细实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "contract_detail")
public class ContractDetail extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 合同ID
     */
    @Column(name = "contract_id", nullable = false)
    private String contractId;

    /**
     * 项目名称
     */
    @Column(name = "item_name", nullable = false)
    private String itemName;

    /**
     * 项目编号
     */
    @Column(name = "item_code")
    private String itemCode;

    /**
     * 单价（敏感信息）
     */
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;

    /**
     * 数量
     */
    @Column(name = "quantity")
    private Integer quantity;

    /**
     * 总价（敏感信息）
     */
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    /**
     * 折扣率（敏感信息）
     */
    @Column(name = "discount_rate", precision = 5, scale = 2)
    private BigDecimal discountRate;

    /**
     * 折后价（敏感信息）
     */
    @Column(name = "discounted_price", precision = 10, scale = 2)
    private BigDecimal discountedPrice;

    /**
     * 是否显示价格信息
     */
    @Column(name = "show_price", nullable = false)
    private Boolean showPrice = false;

    /**
     * 是否显示折扣信息
     */
    @Column(name = "show_discount", nullable = false)
    private Boolean showDiscount = false;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
}
