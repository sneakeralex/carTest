package com.carservice.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MaintenanceDto {
    private String maintenanceNo;
    private Long vehicleId;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<Long> itemIds;
    // 可根据实际业务补充其他字段
}
