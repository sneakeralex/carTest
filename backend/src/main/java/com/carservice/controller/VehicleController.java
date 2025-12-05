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
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@Tag(name = "车辆管理")
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    // @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分页查询车辆列表")
    public ResponseEntity<Result<Page<VehicleDto>>> getAllVehicles(Pageable pageable) {
        Page<VehicleDto> dtoPage = vehicleService.getAllVehicles(pageable).map(VehicleMapper::toDto);
        return ResponseEntity.ok(Result.success(dtoPage));
    }

    @GetMapping("/{vehicleId}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "获取车辆详情")
    public ResponseEntity<Result<VehicleDto>> getVehicleById(@PathVariable String vehicleId) {
        return ResponseEntity.ok(Result.success(VehicleMapper.toDto(vehicleService.getByVehicleId(vehicleId).orElse(null))));
    }

    @GetMapping("/my-vehicles")
    // @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "获取当前用户的车辆列表")
    public ResponseEntity<Result<List<VehicleDto>>> getCurrentUserVehicles(Principal principal) {
        List<VehicleDto> dtos = vehicleService.getCurrentUserVehicles(principal.getName()).stream().map(VehicleMapper::toDto).toList();
        return ResponseEntity.ok(Result.success(dtos));
    }

    @PostMapping("/{userId}")
    // @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "添加车辆")
    public ResponseEntity<Result<VehicleDto>> addVehicle(@PathVariable String userId, @RequestBody VehicleDto vehicleDto) {
        return ResponseEntity.status(201).body(Result.success(VehicleMapper.toDto(vehicleService.addVehicle(vehicleDto,userId))));
    }

    @PutMapping("/{vehicleId}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "更新车辆信息")
    public ResponseEntity<Result<VehicleDto>> updateVehicle(@PathVariable String vehicleId, @RequestBody VehicleDto vehicleDto ) {
        return ResponseEntity.of(Optional.ofNullable(Result.success(VehicleMapper.toDto(vehicleService.updateVehicle(vehicleId, vehicleDto).get()))));
    }

    @DeleteMapping("/{vehicleId}")
    // @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "删除车辆")
    public ResponseEntity<Result<Void>> deleteVehicle(@PathVariable String vehicleId) {
        vehicleService.deleteByVehicleId(vehicleId);
        return ResponseEntity.noContent().build();
    }
}