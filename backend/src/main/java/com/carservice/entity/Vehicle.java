package com.carservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 车辆实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "vehicle")
public class Vehicle extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 车牌号
     */
    private String vehicleNo;
    
    /**
     * 车牌号（前端使用的字段名）
     */
    @JsonProperty("licensePlate")
    public String getLicensePlate() {
        return this.vehicleNo;
    }
    
    @JsonProperty("licensePlate")
    public void setLicensePlate(String licensePlate) {
        this.vehicleNo = licensePlate;
    }

    /**
     * 车架号
     */
    private String vin;

    /**
     * 车辆类型
     */
    @Column(name = "type_id")
    private String typeId;

    /**
     * 品牌
     */
    private String brand;

    /**
     * 型号
     */
    private String model;

    /**
     * 颜色
     */
    private String color;

    /**
     * 发动机号
     */
    private String engineNo;

    /**
     * 购买日期
     */
    private LocalDateTime purchaseDate;

    /**
     * 行驶里程(km)
     */
    private BigDecimal mileage;

    /**
     * 状态：0停用，1正常，2维修中，3报废
     */
    private Integer status;

    /**
     * 车主ID（关联用户表）
     */
    private String ownerId;

    /**
     * 车辆描述
     */
    private String description;


}