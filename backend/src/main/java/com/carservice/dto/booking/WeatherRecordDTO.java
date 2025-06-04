package com.carservice.dto.booking;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 天气记录DTO
 */
@Data
public class WeatherRecordDTO {
    
    private String weatherId;
    private String siteId;
    private String siteName;
    private LocalDateTime recordTime;
    private String weatherType;
    private String weatherTypeName;
    private BigDecimal temperature;
    private BigDecimal humidity;
    private BigDecimal windSpeed;
    private String windDirection;
    private BigDecimal visibility;
    private String description;
    private Boolean isSuitable;
    private String suitabilityReason;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
