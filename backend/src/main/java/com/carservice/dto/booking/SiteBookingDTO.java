package com.carservice.dto.booking;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 场地预约DTO
 */
@Data
public class SiteBookingDTO {
    
    private String bookingId;
    private String siteId;
    private String siteName;
    private String userId;
    private String userName;
    private String vehicleId;
    private String vehiclePlateNo;
    private String testContentId;
    private String testContentName;
    private String scheduleId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private String statusName;
    private String purpose;
    private String requirements;
    private String contactPerson;
    private String contactPhone;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private TestSiteDTO siteInfo;
    private WeatherRecordDTO weatherInfo;
    private SiteScheduleDTO scheduleInfo;
}
