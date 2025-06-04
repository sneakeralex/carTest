package com.carservice.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
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

    @GeneratedValue(generator = "vehicle-id")
    @GenericGenerator(name = "vehicle-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "VEH"))
    @Column(name = "vehicle_id", unique = true)
    private String vehicleId;
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

    /**
     * 车牌号（用于DTO映射）
     */
    public String getPlateNo() {
        return this.vehicleNo;
    }

    /**
     * 车架号（用于DTO映射）
     */
    public String getVinNo() {
        return this.vin;
    }

    /**
     * 车辆类型（用于DTO映射）
     */
    public String getVehicleType() {
        return this.typeId;
    }

    /**
     * 燃料类型
     */
    private String fuelType;

    /**
     * 制造年份
     */
    private Integer manufactureYear;

    /**
     * 车主姓名
     */
    private String ownerName;

    /**
     * 车主电话
     */
    private String ownerPhone;

    /**
     * 车主身份证号
     */
    private String ownerIdCard;

    /**
     * 注册日期
     */
    private String registrationDate;

    /**
     * 保险信息
     */
    private String insuranceInfo;

    /**
     * 技术规格
     */
    private String technicalSpecs;

    /**
     * 备注
     */
    private String notes;


}