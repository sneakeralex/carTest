package com.carservice.dto;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String email;
    private String phone;
    // 可根据实际业务补充其他注册字段
}
