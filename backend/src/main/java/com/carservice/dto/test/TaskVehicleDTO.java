package com.carservice.dto.test;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 任务车辆DTO
 */
@Data
public class TaskVehicleDTO {
    
    private String taskVehicleId;
    private String vehicleId;
    private String status;
    private String statusName;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 车辆信息
    private VehicleDTO vehicleInfo;
    
    // 试验内容
    private List<TestContentDTO> testContents;
}
