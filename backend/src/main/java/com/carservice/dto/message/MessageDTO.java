package com.carservice.dto.message;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 消息DTO
 */
@Data
public class MessageDTO {
    
    private String messageId;
    private String title;
    private String content;
    private String senderId;
    private String senderName;
    private String receiverId;
    private String receiverName;
    private String messageType;
    private String messageTypeName;
    private String priority;
    private String priorityName;
    private Boolean isRead;
    private LocalDateTime readTime;
    private LocalDateTime sendTime;
    private String relatedId;
    private String relatedType;
    private String attachments;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
