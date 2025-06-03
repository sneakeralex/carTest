package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.io.Serializable;

/**
 * 合同所属单位实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "contract_unit")
public class ContractUnit extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 单位编号
     */
    @Column(name = "unit_id", nullable = false, unique = true)
    private String unitId;

    /**
     * 单位名称
     */
    @Column(name = "unit_name", nullable = false)
    private String unitName;

    /**
     * 单位类型
     */
    @Column(name = "unit_type")
    private String unitType;

    /**
     * 联系人
     */
    @Column(name = "contact_person")
    private String contactPerson;

    /**
     * 联系电话
     */
    @Column(name = "contact_phone")
    private String contactPhone;

    /**
     * 电子邮箱
     */
    @Column(name = "email")
    private String email;

    /**
     * 地址
     */
    @Column(name = "address")
    private String address;

    /**
     * 状态：0-禁用，1-启用
     */
    @Column(name = "status", nullable = false)
    private Integer status = 1;

    /**
     * 统一社会信用代码
     */
    @Column(name = "credit_code")
    private String creditCode;

    /**
     * 法人代表
     */
    @Column(name = "legal_representative")
    private String legalRepresentative;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;
    
    /**
     * 管理员用户ID
     */
    @Column(name = "admin_user_id")
    private Long adminUserId;
}
