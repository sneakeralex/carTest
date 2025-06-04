package com.carservice.dto.user;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 用户登录DTO
 */
@Data
public class UserLoginDTO {
    
    @NotBlank(message = "用户名不能为空")
    @Size(max = 50, message = "用户名长度不能超过50个字符")
    private String username;
    
    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 100, message = "密码长度必须在6-100个字符之间")
    private String password;
    
    /**
     * 登录类型：username, phone, employeeNo, idCard
     */
    private String loginType = "username";
    
    /**
     * 验证码（如果需要）
     */
    private String captcha;
    
    /**
     * 记住我
     */
    private Boolean rememberMe = false;
}
