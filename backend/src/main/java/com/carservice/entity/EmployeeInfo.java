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
 * 员工信息实体
 */
@Data
@Entity
@Table(name = "employee_info")
@EqualsAndHashCode(callSuper = true)
public class EmployeeInfo extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String employeeId;

    private String userId;  // 关联的用户ID

    @Column(nullable = false, unique = true)
    private String employeeNo;  // 工号

    @Column(nullable = false, unique = true)
    private String idCardNo;    // 身份证号

    @Column(nullable = false)
    private LocalDate birthDate;  // 出生日期

    @Column(length = 500)
    private String address;  // 居住地址

    @Column(length = 100)
    private String emergencyContact;  // 紧急联系人

    @Column(length = 20)
    private String emergencyPhone;  // 紧急联系电话

    @Column(nullable = false)
    private LocalDate entryDate;  // 入职日期

    private LocalDate departureDate;  // 离职日期

    @Column(length = 100)
    private String department;  // 所属部门

    @Column(length = 100)
    private String position;    // 职位

    @Column(length = 500)
    private String qualifications;  // 资质证书

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus status;  // 员工状态

    @Column(length = 1000)
    private String notes;  // 备注

    public enum EmployeeStatus {
        ACTIVE,       // 在职
        PROBATION,    // 试用期
        SUSPENDED,    // 停职
        TERMINATED    // 离职
    }
}
