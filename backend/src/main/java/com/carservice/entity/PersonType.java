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

/**
 * 人员类型实体
 */
@Data
@Entity
@Table(name = "person_type")
@EqualsAndHashCode(callSuper = true)
public class PersonType extends BaseEntity {

    @GeneratedValue(generator = "person-type-id")
    @GenericGenerator(name = "person-type-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "PT"))
    @Column(name = "person_type_id")
    private String personTypeId;

    @Column(nullable = false, unique = true, length = 50)
    private String typeName;  // 类型名称

    @Column(nullable = false, unique = true, length = 20)
    private String typeCode;  // 类型编码

    @Column(length = 500)
    private String description;  // 类型描述

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeStatus status;  // 类型状态

    @Column(nullable = false)
    private Integer sortOrder = 0;  // 排序顺序

    public enum TypeStatus {
        ACTIVE,    // 启用
        INACTIVE   // 禁用
    }
}
