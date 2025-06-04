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
 * 合同信息实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "contract")
public class Contract extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 合同编号
     */
    @Column(name = "contract_no", nullable = false, unique = true)
    private String contractNo;

    /**
     * 合同名称
     */
    @Column(name = "contract_name", nullable = false)
    private String contractName;

    /**
     * 合同类型
     */
    @Column(name = "contract_type")
    private String contractType;

    /**
     * 所属单位ID
     */
    @Column(name = "unit_id", nullable = false)
    private String unitId;

    /**
     * 合同状态：0-草稿，1-生效，2-终止，3-作废
     */
    @Column(name = "status", nullable = false)
    private Integer status = 0;

    /**
     * 生效日期
     */
    @Column(name = "effective_date")
    private LocalDateTime effectiveDate;

    /**
     * 失效日期
     */
    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    /**
     * 签订日期
     */
    @Column(name = "signing_date")
    private LocalDateTime signingDate;

    /**
     * 签订人ID
     */
    @Column(name = "signer_id")
    private String signerId;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;

    /**
     * 客户ID（用于DTO映射）
     */
    public String getCustomerId() {
        return this.unitId;
    }

    /**
     * 合同总金额
     */
    private BigDecimal totalAmount;

    /**
     * 已付金额
     */
    private BigDecimal paidAmount;

    /**
     * 货币类型
     */
    private String currency;

    /**
     * 签订时间（用于DTO映射）
     */
    public LocalDateTime getSignTime() {
        return this.signingDate;
    }

    /**
     * 生效时间（用于DTO映射）
     */
    public LocalDateTime getEffectiveTime() {
        return this.effectiveDate;
    }

    /**
     * 到期时间（用于DTO映射）
     */
    public LocalDateTime getExpiryTime() {
        return this.expiryDate;
    }

    /**
     * 合同描述
     */
    private String description;

    /**
     * 合同条款
     */
    private String terms;

    /**
     * 备注（用于DTO映射）
     */
    public String getNotes() {
        return this.remark;
    }
}
