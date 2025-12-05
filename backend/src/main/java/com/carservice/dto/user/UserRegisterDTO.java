package com.carservice.dto.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRegisterDTO {
    @NotBlank(message = "unionid不能为空")
    private String unionid;
    
    @NotBlank(message = "openid不能为空")
    private String openid;
    
    @NotBlank(message = "手机号不能为空")
    private String phone;
    
    private String realName;
    private String avatar;
    private Integer gender;
}