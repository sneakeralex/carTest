package com.carservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class VehicleDto {
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
    private Integer status;
    private String ownerId;
    // 可根据实际业务补充其他字段
}
