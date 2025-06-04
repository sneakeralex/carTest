package com.carservice.dto.test;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 试验项目DTO
 */
@Data
public class TestProjectDTO {
    
    private String projectId;
    private String projectName;
    private String projectCode;
    private String testTaskId;
    private String status;
    private String statusName;
    private String description;
    private String requirements;
    private String testStandard;
    private String expectedResults;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private List<TaskVehicleDTO> vehicles;
}
