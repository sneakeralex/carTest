package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.user.UserInfoDTO;
import com.carservice.dto.user.UserLoginDTO;
import com.carservice.service.UserManagementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * 认证控制器 - 提供与前端兼容的认证接口
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "用户认证相关接口")
public class AuthController {
    
    private final UserManagementService userManagementService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    @Operation(summary = "用户登录", description = "支持用户名、手机号、工号、身份证号登录")
    public ResponseEntity<ApiResponse<UserInfoDTO>> login(@Valid @RequestBody UserLoginDTO loginDTO) {
        try {
            UserInfoDTO userInfo = userManagementService.login(loginDTO);
            log.info("用户登录成功: {}", loginDTO.getUsername());
            return ResponseEntity.ok(ApiResponse.success(userInfo, "登录成功"));
        } catch (Exception e) {
            log.error("用户登录失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    @Operation(summary = "用户登出")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestParam String userId) {
        try {
            userManagementService.logout(userId);
            log.info("用户登出成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(null, "登出成功"));
        } catch (Exception e) {
            log.error("用户登出失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取当前用户信息
     */
    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息")
    public ResponseEntity<ApiResponse<UserInfoDTO>> getCurrentUser(@RequestParam String userId) {
        try {
            UserInfoDTO userInfo = userManagementService.getUserInfo(userId);
            log.info("获取当前用户信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(userInfo));
        } catch (Exception e) {
            log.error("获取当前用户信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 刷新令牌
     */
    @PostMapping("/refresh")
    @Operation(summary = "刷新令牌")
    public ResponseEntity<ApiResponse<UserInfoDTO>> refreshToken(@RequestParam String userId) {
        try {
            UserInfoDTO userInfo = userManagementService.getUserInfo(userId);
            log.info("刷新令牌成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(userInfo, "令牌刷新成功"));
        } catch (Exception e) {
            log.error("刷新令牌失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
