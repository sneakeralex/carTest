package com.carservice.dto.equipment;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 设备维护DTO
 */
@Data
public class EquipmentMaintenanceDTO {
    
    private String maintenanceId;
    private String equipmentId;
    private String equipmentName;
    private String equipmentNo;
    private String maintenanceType;
    private String maintenanceTypeName;
    private String maintainerId;
    private String maintainerName;
    private LocalDateTime plannedTime;
    private LocalDateTime actualTime;
    private String description;
    private String maintenanceContent;
    private String partsReplaced;
    private String maintenanceResults;
    private Integer status;
    private String statusName;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private EquipmentDTO equipmentInfo;
}
