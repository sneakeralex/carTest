package com.carservice.dto;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String realName;
    private String email;
    private String phone;
    private String avatar;
    // 可根据实际业务补充其他可更新字段
}
