package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.entity.Role;
import com.carservice.entity.User;
import com.carservice.service.RoleService;
import io.swagger.v3.oas.annotations.Operation; // Added import
import io.swagger.v3.oas.annotations.tags.Tag; // Added import
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "角色管理") // Replaced @Api
public class RoleController {
    private final RoleService roleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取所有角色") // Replaced @ApiOperation
    public ResponseEntity<Result<List<Role>>> getAllRoles() {
        return ResponseEntity.ok(Result.success(roleService.getAllRoles()));
    }

    @GetMapping("/{roleCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取角色详情") // Replaced @ApiOperation
    public ResponseEntity<Result<Role>> getRoleByCode(@PathVariable String roleCode) {
        return ResponseEntity.ok(Result.success(roleService.getRoleByCode(roleCode)));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "获取用户的角色列表") // Replaced @ApiOperation
    public ResponseEntity<Result<List<Role>>> getRolesByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(Result.success(roleService.getRolesByUserId(userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "添加角色") // Replaced @ApiOperation
    public ResponseEntity<Result<Role>> addRole(@RequestBody Role role) {
        return ResponseEntity.status(201).body(Result.success(roleService.addRole(role)));
    }

    @PutMapping("/{roleCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "更新角色") // Replaced @ApiOperation
    public ResponseEntity<Result<Role>> updateRole(@PathVariable String roleCode, @RequestBody Role role) {
        return ResponseEntity.ok(Result.success(roleService.updateRoleByCode(roleCode, role)));
    }

    @DeleteMapping("/{roleCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "删除角色") // Replaced @ApiOperation
    public ResponseEntity<Result<Void>> deleteRole(@PathVariable String roleCode) {
        roleService.deleteRoleByCode(roleCode);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分配角色给用户") // Replaced @ApiOperation
    public ResponseEntity<Result<User>> assignRoleToUser(@RequestParam String userId, @RequestParam String roleCode) {
        return ResponseEntity.ok(Result.success(roleService.assignRoleToUser(userId, roleCode)));
    }
}