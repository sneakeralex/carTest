package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * 车辆类型实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "vehicle_type")
public class VehicleType extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    private String typeId;

    /**
     * 类型名称
     */
    private String typeName;

    /**
     * 类型编码
     */
    private String typeCode;

    /**
     * 类型描述
     */
    private String description;
}