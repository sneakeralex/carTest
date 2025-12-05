package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.common.api.Result;
import com.carservice.dto.RegisterRequest;
import com.carservice.dto.user.*;
import com.carservice.service.UserManagementService;
import com.carservice.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.Resource;
import jakarta.validation.Valid;

/**
 * 用户管理控制器 - 移动端用户中心功能
 */
@Slf4j
@RestController
@RequestMapping("/user-management")
@RequiredArgsConstructor
@Tag(name = "用户管理", description = "用户登录、个人信息、面部认证等功能")
public class UserManagementController {
    
    private final UserManagementService userManagementService;
    @Resource UserService userService;
    
    // /**
    //  * 用户登录
    //  */
    // @PostMapping("/login")
    // @Operation(summary = "用户登录", description = "支持用户名、手机号、工号、身份证号登录")
    // public ResponseEntity<ApiResponse<UserInfoDTO>> login(@Valid @RequestBody UserLoginDTO loginDTO) {
    //     try {
    //         UserInfoDTO userInfo = userManagementService.login(loginDTO);
    //         log.info("用户登录成功: {}", loginDTO.getUsername());
    //         return ResponseEntity.ok(ApiResponse.success(userInfo, "登录成功"));
    //     } catch (Exception e) {
    //         log.error("用户登录失败: {}", e.getMessage());
    //         return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    //     }
    // }
    
    // /**
    //  * 用户登出
    //  */
    // @PostMapping("/logout")
    // @Operation(summary = "用户登出")
    // public ResponseEntity<ApiResponse<Void>> logout(@Parameter(description = "用户ID") @RequestParam String userId) {
    //     try {
    //         userManagementService.logout(userId);
    //         log.info("用户登出成功: {}", userId);
    //         return ResponseEntity.ok(ApiResponse.success(null, "登出成功"));
    //     } catch (Exception e) {
    //         log.error("用户登出失败: {}", e.getMessage());
    //         return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
    //     }
    // }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public ResponseEntity<Result<?>> registerUser(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.status(201).body(Result.success(userService.register(registerRequest)));
    }
    
    /**
     * 获取用户信息
     */
    @GetMapping("/{userId}")
    @Operation(summary = "获取用户信息")
    public ResponseEntity<ApiResponse<UserInfoDTO>> getUserInfo(@PathVariable String userId) {
        try {
            UserInfoDTO userInfo = userManagementService.getUserInfo(userId);
            log.info("获取用户信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(userInfo));
        } catch (Exception e) {
            log.error("获取用户信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 更新用户信息
     */
    @PutMapping("/{userId}")
    @Operation(summary = "更新用户信息")
    public ResponseEntity<ApiResponse<UserInfoDTO>> updateUserInfo(
            @PathVariable String userId,
            @Valid @RequestBody UserInfoDTO userInfo) {
        try {
            UserInfoDTO updatedUser = userManagementService.updateUserInfo(userId, userInfo);
            log.info("更新用户信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(updatedUser, "更新成功"));
        } catch (Exception e) {
            log.error("更新用户信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 修改密码
     */
    @PostMapping("/{userId}/change-password")
    @Operation(summary = "修改密码")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @PathVariable String userId,
            @RequestBody ChangePasswordRequest request) {
        try {
            userManagementService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
            log.info("修改密码成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(null, "密码修改成功"));
        } catch (Exception e) {
            log.error("修改密码失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 上传头像
     */
    @PostMapping("/{userId}/avatar")
    @Operation(summary = "上传头像")
    public ResponseEntity<ApiResponse<String>> uploadAvatar(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String avatarUrl = userManagementService.uploadAvatar(userId, file);
            log.info("上传头像成功: {}, URL: {}", userId, avatarUrl);
            return ResponseEntity.ok(ApiResponse.success(avatarUrl, "头像上传成功"));
        } catch (Exception e) {
            log.error("头像上传失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取员工信息
     */
    @GetMapping("/{userId}/employee")
    @Operation(summary = "获取员工信息")
    public ResponseEntity<ApiResponse<EmployeeInfoDTO>> getEmployeeInfo(@PathVariable String userId) {
        try {
            EmployeeInfoDTO employeeInfo = userManagementService.getEmployeeInfo(userId);
            log.info("获取员工信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(employeeInfo));
        } catch (Exception e) {
            log.error("获取员工信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新员工信息
     */
    @PutMapping("/{userId}/employee")
    @Operation(summary = "更新员工信息")
    public ResponseEntity<ApiResponse<EmployeeInfoDTO>> updateEmployeeInfo(
            @PathVariable String userId,
            @Valid @RequestBody EmployeeInfoDTO employeeInfo) {
        try {
            EmployeeInfoDTO updatedEmployee = userManagementService.updateEmployeeInfo(userId, employeeInfo);
            log.info("更新员工信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(updatedEmployee, "员工信息更新成功"));
        } catch (Exception e) {
            log.error("更新员工信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取个人信息
     */
    @GetMapping("/{userId}/person")
    @Operation(summary = "获取个人信息")
    public ResponseEntity<ApiResponse<PersonInfoDTO>> getPersonInfo(@PathVariable String userId) {
        try {
            PersonInfoDTO personInfo = userManagementService.getPersonInfo(userId);
            log.info("获取个人信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(personInfo));
        } catch (Exception e) {
            log.error("获取个人信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新个人信息
     */
    @PutMapping("/{userId}/person")
    @Operation(summary = "更新个人信息")
    public ResponseEntity<ApiResponse<PersonInfoDTO>> updatePersonInfo(
            @PathVariable String userId,
            @Valid @RequestBody PersonInfoDTO personInfo) {
        try {
            PersonInfoDTO updatedPerson = userManagementService.updatePersonInfo(userId, personInfo);
            log.info("更新个人信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(updatedPerson, "个人信息更新成功"));
        } catch (Exception e) {
            log.error("更新个人信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 注册面部认证
     */
    @PostMapping("/{userId}/face-auth/register")
    @Operation(summary = "注册面部认证")
    public ResponseEntity<ApiResponse<FaceAuthDTO>> registerFaceAuth(
            @PathVariable String userId,
            @RequestParam("image") MultipartFile faceImage) {
        try {
            FaceAuthDTO faceAuth = userManagementService.registerFaceAuth(userId, faceImage);
            log.info("注册面部认证成功: {}, 图片大小: {}", userId, faceImage.getSize());
            return ResponseEntity.ok(ApiResponse.success(faceAuth, "面部认证注册成功"));
        } catch (Exception e) {
            log.error("面部认证注册失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 面部认证验证
     */
    @PostMapping("/{userId}/face-auth/verify")
    @Operation(summary = "面部认证验证")
    public ResponseEntity<ApiResponse<Boolean>> verifyFaceAuth(
            @PathVariable String userId,
            @RequestParam("image") MultipartFile faceImage) {
        try {
            Boolean verified = userManagementService.verifyFaceAuth(userId, faceImage);
            log.info("面部认证验证完成: {}, 结果: {}", userId, verified);
            return ResponseEntity.ok(ApiResponse.success(verified, verified ? "认证成功" : "认证失败"));
        } catch (Exception e) {
            log.error("面部认证验证失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取面部认证信息
     */
    @GetMapping("/{userId}/face-auth")
    @Operation(summary = "获取面部认证信息")
    public ResponseEntity<ApiResponse<FaceAuthDTO>> getFaceAuthInfo(@PathVariable String userId) {
        try {
            FaceAuthDTO faceAuth = userManagementService.getFaceAuthInfo(userId);
            log.info("获取面部认证信息成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(faceAuth));
        } catch (Exception e) {
            log.error("获取面部认证信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新面部认证状态
     */
    @PutMapping("/{userId}/face-auth/status")
    @Operation(summary = "更新面部认证状态")
    public ResponseEntity<ApiResponse<Void>> updateFaceAuthStatus(
            @PathVariable String userId,
            @RequestParam Boolean isActive) {
        try {
            userManagementService.updateFaceAuthStatus(userId, isActive);
            log.info("更新面部认证状态成功: {}, 状态: {}", userId, isActive);
            return ResponseEntity.ok(ApiResponse.success(null, "面部认证状态更新成功"));
        } catch (Exception e) {
            log.error("更新面部认证状态失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 修改密码请求DTO
     */
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        
        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
