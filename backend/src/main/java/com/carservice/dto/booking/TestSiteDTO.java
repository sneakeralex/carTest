package com.carservice.dto.booking;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 试验场地DTO
 */
@Data
public class TestSiteDTO {
    
    private String siteId;
    private String siteName;
    private String siteCode;
    private String siteType;
    private String siteTypeName;
    private String status;
    private String statusName;
    private BigDecimal area;
    private String location;
    private String description;
    private String facilities;
    private Integer maxVehicles;
    private String safetyRequirements;
    private String operatingHours;
    private String contactInfo;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
