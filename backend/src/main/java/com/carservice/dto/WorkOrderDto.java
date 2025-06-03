package com.carservice.dto;

import lombok.Data;

@Data
public class WorkOrderDto {
    private String maintenanceId;
    // 可以根据需要添加其他字段，例如 description
    private String description;
    private String orderNo;
    private String vehicleId;
    private String technicianId;
    private Integer status;
    private java.time.LocalDateTime startTime;
    private java.time.LocalDateTime endTime;
}