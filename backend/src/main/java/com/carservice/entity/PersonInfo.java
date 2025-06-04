package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;

import java.time.LocalDate;

/**
 * 普通用户信息实体
 */
@Data
@Entity
@Table(name = "person_info")
@EqualsAndHashCode(callSuper = true)
public class PersonInfo extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String personId;

    private String userId;  // 关联的用户ID

    @Column(nullable = false, unique = true)
    private String idCardNo;    // 身份证号

    @Column(nullable = false)
    private LocalDate birthDate;  // 出生日期

    @Column(length = 500)
    private String address;  // 居住地址

    @Column(length = 100)
    private String company;  // 所属公司

    @Column(length = 100)
    private String position;    // 职位

    @Column(length = 100)
    private String emergencyContact;  // 紧急联系人

    @Column(length = 20)
    private String emergencyPhone;  // 紧急联系电话

    @Column(length = 500)
    private String businessLicense;  // 营业执照号（如果是企业用户）

    @Column(length = 500)
    private String qualification;  // 资质证明

    @Column(nullable = false)
    private LocalDate registrationDate;  // 注册日期

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonStatus status;  // 用户状态

    @Column(length = 1000)
    private String notes;  // 备注

    @Column(length = 500)
    private String verificationDoc;  // 身份验证文件

    public enum PersonStatus {
        PENDING,      // 待审核
        ACTIVE,       // 已激活
        SUSPENDED,    // 已停用
        BLACKLISTED  // 黑名单
    }
}
