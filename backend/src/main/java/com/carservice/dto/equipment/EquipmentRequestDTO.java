package com.carservice.dto.equipment;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 设备申请DTO
 */
@Data
public class EquipmentRequestDTO {
    
    private String requestId;
    private String equipmentId;
    private String equipmentName;
    private String equipmentNo;
    private String requesterId;
    private String requesterName;
    private String approverId;
    private String approverName;
    private String requestType;
    private String requestTypeName;
    private LocalDateTime requestTime;
    private LocalDateTime approvalTime;
    private LocalDateTime expectedStartTime;
    private LocalDateTime expectedEndTime;
    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;
    private String purpose;
    private String requirements;
    private Integer status;
    private String statusName;
    private String approvalComments;
    private String rejectionReason;
    private String notes;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private EquipmentDTO equipmentInfo;
}
