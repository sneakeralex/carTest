package com.carservice.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentDto {
    private String vehicleId;
    private String appointmentNo;
    private String userId;
    private Integer status;
    private LocalDateTime appointmentTime;
    private String description;
    // 可根据实际业务补充其他字段
}
