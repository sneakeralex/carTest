package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.VehicleDto;
import com.carservice.dto.VehicleMapper;
import com.carservice.service.VehicleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
@Tag(name = "车辆管理")
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分页查询车辆列表")
    public ResponseEntity<Result<Page<VehicleDto>>> getAllVehicles(Pageable pageable) {
        Page<VehicleDto> dtoPage = vehicleService.getAllVehicles(pageable).map(VehicleMapper::toDto);
        return ResponseEntity.ok(Result.success(dtoPage));
    }

    @GetMapping("/{vehicleNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "获取车辆详情")
    public ResponseEntity<Result<VehicleDto>> getVehicleByNo(@PathVariable String vehicleNo) {
        return ResponseEntity.ok(Result.success(VehicleMapper.toDto(vehicleService.getVehicleByNo(vehicleNo).orElse(null))));
    }

    @GetMapping("/my-vehicles")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "获取当前用户的车辆列表")
    public ResponseEntity<Result<List<VehicleDto>>> getCurrentUserVehicles(Principal principal) {
        List<VehicleDto> dtos = vehicleService.getCurrentUserVehicles(principal.getName()).stream().map(VehicleMapper::toDto).toList();
        return ResponseEntity.ok(Result.success(dtos));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "添加车辆")
    public ResponseEntity<Result<VehicleDto>> addVehicle(@RequestBody VehicleDto vehicleDto, Principal principal) {
        return ResponseEntity.status(201).body(Result.success(VehicleMapper.toDto(vehicleService.addVehicle(vehicleDto, principal.getName()))));
    }

    @PutMapping("/{vehicleNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "更新车辆信息")
    public ResponseEntity<Result<VehicleDto>> updateVehicle(@PathVariable String vehicleNo, @RequestBody VehicleDto vehicleDto, Principal principal) {
        return ResponseEntity.ok(Result.success(VehicleMapper.toDto(vehicleService.updateVehicleByNo(vehicleNo, vehicleDto, principal.getName()).orElse(null))));
    }

    @DeleteMapping("/{vehicleNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "删除车辆")
    public ResponseEntity<Result<Void>> deleteVehicle(@PathVariable String vehicleNo, Principal principal) {
        vehicleService.deleteVehicleByNo(vehicleNo, principal.getName());
        return ResponseEntity.noContent().build();
    }
}