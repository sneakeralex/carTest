package com.carservice.dto.message;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 审批消息DTO
 */
@Data
public class ApprovalMessageDTO {
    
    private String approvalMessageId;
    private String messageId;
    private String approvalId;
    private String approvalType;
    private String approvalTypeName;
    private String previousApproverId;
    private String previousApproverName;
    private String nextApproverId;
    private String nextApproverName;
    private Integer currentStep;
    private Integer totalSteps;
    private LocalDateTime approvalDeadline;
    private String approvalContent;
    private String approvalRequirements;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
    
    // 关联信息
    private MessageDTO messageInfo;
}
