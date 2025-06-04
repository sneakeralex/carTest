package com.carservice.dto.user;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 用户信息DTO
 */
@Data
public class UserInfoDTO {
    
    private String userId;
    private String username;
    private String realName;
    private String phone;
    private String email;
    private String avatar;
    private String personTypeId;
    private String personTypeName;
    private Integer status;
    private String statusName;
    private LocalDateTime lastLoginTime;
    private LocalDateTime createdTime;
    
    // 员工信息（如果是员工）
    private EmployeeInfoDTO employeeInfo;
    
    // 个人信息（如果是外部用户）
    private PersonInfoDTO personInfo;
    
    // 面部认证信息
    private FaceAuthDTO faceAuth;
}
