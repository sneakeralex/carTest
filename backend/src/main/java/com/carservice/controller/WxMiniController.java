package com.carservice.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.carservice.common.util.JwtTokenUtil;
import com.carservice.entity.User;
import com.carservice.service.UserService;

import jakarta.annotation.Resource;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/wxmini")
public class WxMiniController {

    @Value("${wxmini.appid}")
    private String appid;

    @Value("${wxmini.secret}")
    private String secret;

    @Resource
    private UserService userService;

    @Resource
    private JwtTokenUtil jwtTokenUtil;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/code2session")
    public ResponseEntity<Map<String, Object>> code2Session(@RequestParam String code) {
        String url = String.format(
                "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
                appid, secret, code);
        @SuppressWarnings("unchecked")
        Map<String, Object> wxResult = restTemplate.getForObject(url, Map.class);

        @SuppressWarnings("null")
        String unionid = (String) wxResult.get("unionid");
        String openid = (String) wxResult.get("openid");

        if (unionid == null || openid == null) {
            return ResponseEntity.badRequest().body(wxResult);
        }

        // 判断用户是否存在
        User user = userService.findByUnionid(unionid);
        Map<String, Object> resp = new HashMap<>();
        if (user == null) {
            // 未注册或信息不全，前端跳转注册页面
            resp.put("needRegister", true);
            resp.put("unionid", unionid);
            resp.put("openid", openid);
            return ResponseEntity.ok(resp);
        }

        // 生成JWT token，包含 user 和 userDetails 信息
        String jwtToken = jwtTokenUtil.generateToken(user);

        resp.put("token", jwtToken);
        // resp.put("user", user);
        // resp.put("userDetails", userDetails);

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/access_token")
    public ResponseEntity<Map<String, Object>> getAccessToken() {
        String url = String.format(
                "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s",
                appid, secret);

        @SuppressWarnings("unchecked")
        Map<String, Object> result = restTemplate.getForObject(url, Map.class);

        return ResponseEntity.ok(result);
    }
}