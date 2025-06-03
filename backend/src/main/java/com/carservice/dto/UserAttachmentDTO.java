package com.carservice.dto;

import lombok.Data;

@Data
public class UserAttachmentDTO {
    private Long id;
    private String fileName;
    private String fileUrl;
    private String fileType;
    private Long fileSize;
    private Long userId;  // Changed from personId to userId
}
