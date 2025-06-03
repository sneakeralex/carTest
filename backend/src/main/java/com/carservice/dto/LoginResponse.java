package com.carservice.dto;
import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String username;
    // 可根据实际业务补充其他登录返回字段
}
