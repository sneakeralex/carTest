package com.carservice.dto.test;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 试验任务DTO
 */
@Data
public class TestTaskDTO {
    
    private String taskId;
    private String taskNo;
    private String contractNo;
    private String authorizerId;
    private String authorizerName;
    private LocalDateTime authorizationDate;
    private LocalDateTime plannedStartDate;
    private LocalDateTime plannedEndDate;
    private LocalDateTime actualStartDate;
    private LocalDateTime actualEndDate;
    private String status;
    private String statusName;
    private String description;
    private String requirements;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private List<TestProjectDTO> projects;
    private ContractDTO contractInfo;
}
