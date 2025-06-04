package com.carservice.dto.test;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 试验内容DTO
 */
@Data
public class TestContentDTO {
    
    private String contentId;
    private String testItem;
    private String testMethod;
    private String testStandard;
    private String description;
    private LocalDateTime plannedStartTime;
    private LocalDateTime plannedEndTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private String status;
    private String statusName;
    private String testResults;
    private String conclusion;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
