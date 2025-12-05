package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 车辆实体
 */
@Data
@Entity
@Table(name = "vehicle")
@EqualsAndHashCode(callSuper = true)
public class Vehicle extends BaseEntity {

    @GeneratedValue(generator = "vehicle-id")
    @Column(name = "vehicle_id", unique = true)
    private String vehicleId;

    @Column(name = "vehicle_no", nullable = false, unique = true)
    private String vehicleNo;

    @Column(name = "vehicle_name")
    private String vehicleName;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "color")
    private String color;

    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "vin")
    private String vin;

    @Column(name = "type_id")
    private String typeId;

    @Column(name = "brand")
    private String brand;

    @Column(name = "model")
    private String model;

    @Column(name = "engine_no")
    private String engineNo;

    @Column(name = "purchase_date")
    private LocalDateTime purchaseDate;

    @Column(name = "mileage", precision = 10, scale = 2)
    private BigDecimal mileage;

    @Column(name = "owner_id")
    private String ownerId;

    @Column(name = "plate_no")
    private String plateNo;

    @Column(name = "fuel_type")
    private String fuelType;

    @Column(name = "vin_no")
    private String vinNo;

    @Column(name = "manufacture_year")
    private Integer manufactureYear;

    @Column(name = "owner_name")
    private String ownerName;

    @Column(name = "owner_phone")
    private String ownerPhone;

    @Column(name = "owner_id_card")
    private String ownerIdCard;

    @Column(name = "insurance_info", length = 1000)
    private String insuranceInfo;

    @Column(name = "technical_specs", length = 1000)
    private String technicalSpecs;

    /**
     * 备注
     */
    @Column(name = "notes", length = 500)
    private String notes;

    /**
     * 车辆状态
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VehicleStatusEnum status;

    public enum VehicleStatusEnum {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}