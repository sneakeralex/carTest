package com.carservice.dto.test;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 车辆DTO
 */
@Data
public class VehicleDTO {
    
    private String vehicleId;
    private String plateNo;
    private String brand;
    private String model;
    private String vehicleType;
    private String fuelType;
    private String engineNo;
    private String vinNo;
    private String color;
    private Integer manufactureYear;
    private String ownerName;
    private String ownerPhone;
    private String ownerIdCard;
    private String registrationDate;
    private String insuranceInfo;
    private String technicalSpecs;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
