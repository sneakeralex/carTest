package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

/**
 * 车辆类型实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "vehicle_type")
public class VehicleType extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "type_id")
    private String typeId;

    /**
     * 类型名称
     */
    @Column(name = "type_name")
    private String typeName;

    /**
     * 类型编码
     */
    @Column(name = "type_code")
    private String typeCode;

    /**
     * 类型描述
     */
    @Column(length = 500)
    private String description;
}