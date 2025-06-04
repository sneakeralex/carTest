package com.carservice.dto.equipment;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 设备DTO
 */
@Data
public class EquipmentDTO {
    
    private String equipmentId;
    private String equipmentNo;
    private String equipmentName;
    private String equipmentType;
    private String brand;
    private String model;
    private String specifications;
    private String manufacturer;
    private String serialNo;
    private LocalDateTime purchaseDate;
    private String supplier;
    private String departmentId;
    private String departmentName;
    private String location;
    private Integer status;
    private String statusName;
    private String responsiblePerson;
    private String contactInfo;
    private LocalDateTime nextMaintenanceDate;
    private String maintenanceInstructions;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
