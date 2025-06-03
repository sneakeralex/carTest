package com.carservice.controller;

import org.springframework.data.domain.Page;
import com.carservice.dto.MaintenanceDto;
import com.carservice.entity.Maintenance;
import com.carservice.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import com.carservice.common.api.Result;

@RestController
@RequestMapping("/api/maintenances")
@RequiredArgsConstructor
@Tag(name = "维修保养管理")
public class MaintenanceController {
    private final MaintenanceService maintenanceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分页查询维修保养记录")
    public ResponseEntity<Result<Page<Maintenance>>> getAllMaintenances(Pageable pageable) {
        return ResponseEntity.ok(Result.success(maintenanceService.getAllMaintenances(pageable)));
    }

    @GetMapping("/{maintenanceNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "获取维修保养记录详情")
    public ResponseEntity<Result<Maintenance>> getMaintenanceByNo(@PathVariable String maintenanceNo) {
        return ResponseEntity.ok(Result.success(maintenanceService.getMaintenanceByNo(maintenanceNo)));
    }

    @GetMapping("/my-maintenances")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "获取当前用户的维修保养记录")
    public ResponseEntity<Result<List<Maintenance>>> getCurrentUserMaintenances(Principal principal) {
        return ResponseEntity.ok(Result.success(maintenanceService.getCurrentUserMaintenances(principal.getName())));
    }

    @GetMapping("/vehicle/{vehicleId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "获取车辆的维修保养记录")
    public ResponseEntity<Result<List<Maintenance>>> getMaintenancesByVehicleId(@PathVariable String vehicleId) {
        return ResponseEntity.ok(Result.success(maintenanceService.getMaintenancesByVehicleId(vehicleId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "创建维修保养记录")
    public ResponseEntity<Result<Maintenance>> createMaintenance(@RequestBody MaintenanceDto maintenanceDto, Principal principal) {
        return ResponseEntity.ok(Result.success(maintenanceService.createMaintenance(maintenanceDto, principal.getName())));
    }

    @PutMapping("/{maintenanceNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "更新维修保养记录")
    public ResponseEntity<Result<Maintenance>> updateMaintenance(@PathVariable String maintenanceNo, @RequestBody MaintenanceDto maintenanceDto, Principal principal) {
        return ResponseEntity.ok(Result.success(maintenanceService.updateMaintenanceByNo(maintenanceNo, maintenanceDto, principal.getName())));
    }

    @PutMapping("/{maintenanceNo}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "取消维修保养记录")
    public ResponseEntity<Result<Maintenance>> cancelMaintenance(@PathVariable String maintenanceNo) {
        return ResponseEntity.ok(Result.success(maintenanceService.cancelMaintenanceByNo(maintenanceNo)));
    }

    @PutMapping("/{maintenanceNo}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "完成维修保养记录")
    public ResponseEntity<Result<Maintenance>> completeMaintenance(@PathVariable String maintenanceNo) {
        return ResponseEntity.ok(Result.success(maintenanceService.completeMaintenanceByNo(maintenanceNo)));
    }
}