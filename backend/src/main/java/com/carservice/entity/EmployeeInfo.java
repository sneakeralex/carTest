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
public class EmployeeInfo extends BasePersonEntity {

    @GeneratedValue(generator = "employee-id")
    @GenericGenerator(name = "employee-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "EMP"))
    @Column(name = "employee_id", unique = true)
    private String employeeId;

    private String userId;  // 关联的用户ID

    @Column(nullable = false, unique = true)
    private String employeeNo;  // 工号

    @Column(nullable = false)
    private LocalDate entryDate;  // 入职日期

    private LocalDate departureDate;  // 离职日期

    @Column(length = 100)
    private String department;  // 所属部门

    @Column(length = 500)
    private String qualifications;  // 资质证书

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmployeeStatus status;  // 员工状态

    public enum EmployeeStatus {
        ACTIVE,       // 在职
        PROBATION,    // 试用期
        SUSPENDED,    // 停职
        TERMINATED    // 离职
    }
}
