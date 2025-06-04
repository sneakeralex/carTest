package com.carservice.dto.user;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 员工信息DTO
 */
@Data
public class EmployeeInfoDTO {
    
    private String employeeId;
    private String userId;
    private String employeeNo;
    private String idCardNo;
    private LocalDate birthDate;
    private String address;
    private String department;
    private String position;
    private String qualifications;
    private String status;
    private String statusName;
    private LocalDate entryDate;
    private LocalDate departureDate;
    private String emergencyContact;
    private String emergencyPhone;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
