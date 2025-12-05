package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.common.util.JwtTokenUtil;
import com.carservice.dto.user.UserInfoDTO;
import com.carservice.dto.user.UserLoginDTO;
import com.carservice.dto.user.WxLoginRequest;
import com.carservice.dto.user.WxLoginResponse;
import com.carservice.entity.Role;
import com.carservice.entity.User;
import com.carservice.service.UserManagementService;
import com.carservice.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * 认证控制器 - 提供与前端兼容的认证接口
 */
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "认证", description = "用户认证相关接口")
public class AuthController {

    @Resource
    UserManagementService userManagementService;
    @Resource
    UserService userService;
    @Resource
    JwtTokenUtil jwtTokenUtil;
    @Resource
    WxMiniController wxMiniController;

    @SuppressWarnings("null")
    @PostMapping("/wx/login")
    @Operation(summary = "微信小程序登录")
    public ResponseEntity<ApiResponse<WxLoginResponse>> wxLogin(@Valid @RequestBody WxLoginRequest loginRequest) {
        try {
            // 调用微信登录接口获取openid和unionid
            ResponseEntity<Map<String, Object>> wxResult = wxMiniController.code2Session(loginRequest.getCode());
            if (wxResult.getStatusCode() != HttpStatus.OK) {
                return ResponseEntity.badRequest().body(ApiResponse.error("微信登录失败"));
            }

            Map<String, Object> wxData = wxResult.getBody();
            String unionid = (String) wxData.get("unionid");
            String openid = (String) wxData.get("openid");

            // 查找或创建用户
            User user = userService.findByUnionid(unionid);
            WxLoginResponse response = new WxLoginResponse();

            if (user == null) {
                // 新用户，创建基础用户信息
                user = new User();
                user.setUnionid(unionid);
                user.setOpenid(openid);
                // 设置默认角色为普通用户
                Role defaultRole = userService.getDefaultRole();
                user.setRole(defaultRole);
                user = userService.save(user);
                
                response.setNeedRegister(true);
                log.info("新用户注册: {}", unionid);
            } else {
                // 检查用户信息是否完善
                boolean isProfileComplete = isUserProfileComplete(user);
                response.setNeedRegister(!isProfileComplete);
                
                if (isProfileComplete) {
                    // 用户信息完善，生成token
                    String token = jwtTokenUtil.generateToken(user);
                    response.setToken(token);
                    log.info("用户登录成功: {}", unionid);
                } else {
                    log.info("用户信息不完善，需要补充信息: {}", unionid);
                }
            }

            return ResponseEntity.ok(ApiResponse.success(response));
        } catch (Exception e) {
            log.error("微信登录失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 检查用户信息是否完善
     * @param user 用户实体
     * @return 如果用户信息完善返回true，否则返回false
     */
    private boolean isUserProfileComplete(User user) {
        // 检查必要的用户信息是否已填写
        return user.getUsername() != null && !user.getUsername().isEmpty() 
            && user.getPhone() != null && !user.getPhone().isEmpty()
            && user.getRealName() != null && !user.getRealName().isEmpty();
    }

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
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
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
    public ResponseEntity<ApiResponse<UserInfoDTO>> getCurrentUser(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
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
    public ResponseEntity<ApiResponse<UserInfoDTO>> refreshToken(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
        try {
            UserInfoDTO userInfo = userManagementService.getUserInfo(userId);
            log.info("刷新令牌成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(userInfo, "令牌刷新成功"));
        } catch (Exception e) {
            log.error("刷新令牌失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新用户信息
     */
    @PutMapping("/user")
    @Operation(summary = "更新用户信息")
    public ResponseEntity<ApiResponse<UserInfoDTO>> updateUserInfo(@Valid @RequestBody UserInfoDTO userInfoDTO) {
        try {
            // TODO: 实现更新用户信息逻辑
            log.info("更新用户信息成功: {}", userInfoDTO.getUsername());
            return ResponseEntity.ok(ApiResponse.success(userInfoDTO, "用户信息更新成功"));
        } catch (Exception e) {
            log.error("更新用户信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 修改密码
     */
    @PutMapping("/password")
    @Operation(summary = "修改密码")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            // TODO: 实现修改密码逻辑
            log.info("修改密码成功");
            return ResponseEntity.ok(ApiResponse.success(null, "密码修改成功"));
        } catch (Exception e) {
            log.error("修改密码失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 修改密码请求DTO
     */
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() {
            return oldPassword;
        }

        public void setOldPassword(String oldPassword) {
            this.oldPassword = oldPassword;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }
}
