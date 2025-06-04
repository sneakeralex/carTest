package com.carservice.dto.booking;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 场地排期DTO
 */
@Data
public class SiteScheduleDTO {
    
    private String scheduleId;
    private String siteId;
    private String siteName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String scheduleType;
    private String scheduleTypeName;
    private Boolean isAvailable;
    private Integer totalSlots;
    private Integer availableSlots;
    private String description;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
