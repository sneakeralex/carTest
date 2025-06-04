package com.carservice.dto.user;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 人员信息DTO
 */
@Data
public class PersonInfoDTO {
    
    private String personId;
    private String userId;
    private String idCardNo;
    private LocalDate birthDate;
    private String address;
    private String company;
    private String position;
    private String businessLicense;
    private LocalDate registrationDate;
    private String status;
    private String statusName;
    private String verificationDoc;
    private String emergencyContact;
    private String emergencyPhone;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
