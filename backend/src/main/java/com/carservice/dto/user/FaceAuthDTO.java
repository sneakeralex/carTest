package com.carservice.dto.user;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 面部认证DTO
 */
@Data
public class FaceAuthDTO {
    
    private String authId;
    private String userId;
    private String status;
    private String statusName;
    private Boolean isActive;
    private LocalDateTime registrationTime;
    private LocalDateTime lastVerifyTime;
    private Integer verifyCount;
    private String faceImageUrl;
    private LocalDateTime createdTime;
    private LocalDateTime updatedTime;
}
