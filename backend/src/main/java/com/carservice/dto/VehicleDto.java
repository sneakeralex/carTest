package com.carservice.dto;

import lombok.Data;
import java.math.BigDecimal;

import com.carservice.entity.Vehicle.VehicleStatusEnum;

@Data
public class VehicleDto {
    private String vehicleId;
    private String vehicleNo;
    private String vehicleName;
    private String vehicleType;
    private String color;
    private String manufacturer;
    private BigDecimal price;
    private String description;
    private String vin;
    private String typeId;
    private String brand;
    private String model;
    private String engineNo;
    private java.time.LocalDateTime purchaseDate;
    private BigDecimal mileage;
    private VehicleStatusEnum status;
    private String ownerId;
    // 可根据实际业务补充其他字段
}
