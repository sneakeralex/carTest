package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.time.LocalDate;

/**
 * 人员基础信息实体基类
 * 包含所有人员类型共有的字段，避免重复定义
 */
@Data
@EqualsAndHashCode(callSuper = true)
@MappedSuperclass
public abstract class BasePersonEntity extends BaseEntity {

    @Column(nullable = false, unique = true, length = 18)
    private String idCardNo;    // 身份证号

    @Column(nullable = false)
    private LocalDate birthDate;  // 出生日期

    @Column(length = 500)
    private String address;  // 居住地址

    @Column(length = 100)
    private String emergencyContact;  // 紧急联系人

    @Column(length = 20)
    private String emergencyPhone;  // 紧急联系电话

    @Column(length = 100)
    private String position;    // 职位

    @Column(length = 1000)
    private String notes;  // 备注
}
