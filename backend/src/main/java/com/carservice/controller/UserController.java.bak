package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.LoginRequest;
import com.carservice.dto.LoginResponse;
import com.carservice.dto.RegisterRequest;
import com.carservice.dto.UpdateUserRequest;
import com.carservice.entity.User;
import com.carservice.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "用户管理")
public class UserController {
    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "获取当前登录用户信息")
    public ResponseEntity<Result<User>> getCurrentUser(Principal principal) {
        return ResponseEntity.ok(Result.success(userService.getCurrentUser(principal.getName())));
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public ResponseEntity<Result<User>> registerUser(@RequestBody RegisterRequest registerRequest) {
        return ResponseEntity.status(201).body(Result.success(userService.registerUser(registerRequest)));
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public ResponseEntity<Result<LoginResponse>> loginUser(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(Result.success(userService.loginUser(loginRequest)));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "更新用户信息")
    public ResponseEntity<Result<User>> updateCurrentUser(@RequestBody UpdateUserRequest updateUserRequest, Principal principal) {
        return ResponseEntity.ok(Result.success(userService.updateUser(principal.getName(), updateUserRequest)));
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "修改密码")
    public ResponseEntity<Void> changePassword(@RequestParam String oldPassword, @RequestParam String newPassword, Principal principal) {
        userService.changePassword(principal.getName(), oldPassword, newPassword);
        return ResponseEntity.noContent().build();
    }
}