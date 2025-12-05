package com.carservice.dto.user;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WxLoginResponse {
    public WxLoginResponse(String token2) {
        //TODO Auto-generated constructor stub
    }
    private String token;
    private Boolean needRegister;
    private String unionid;
    private String openid;
}