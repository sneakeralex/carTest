package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.entity.VehicleType;
import com.carservice.service.VehicleTypeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
@RequiredArgsConstructor
@Tag(name = "车辆类型管理")
public class VehicleTypeController {
    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    @Operation(summary = "获取所有车辆类型")
    public ResponseEntity<Result<List<VehicleType>>> getAllVehicleTypes() {
        return ResponseEntity.ok(Result.success(vehicleTypeService.getAllVehicleTypes()));
    }

    @GetMapping("/{typeCode}")
    @Operation(summary = "根据类型编码获取车辆类型")
    public ResponseEntity<Result<VehicleType>> getVehicleTypeByCode(@PathVariable String typeCode) {
        return ResponseEntity.ok(Result.success(vehicleTypeService.getVehicleTypeByCode(typeCode)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "创建车辆类型")
    public ResponseEntity<Result<VehicleType>> createVehicleType(@RequestBody VehicleType vehicleType) {
        return ResponseEntity.status(201).body(Result.success(vehicleTypeService.createVehicleType(vehicleType)));
    }

    @PutMapping("/{typeCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "更新车辆类型")
    public ResponseEntity<Result<VehicleType>> updateVehicleType(@PathVariable String typeCode, @RequestBody VehicleType vehicleType) {
        return ResponseEntity.ok(Result.success(vehicleTypeService.updateVehicleTypeByCode(typeCode, vehicleType)));
    }

    @DeleteMapping("/{typeCode}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "删除车辆类型")
    public ResponseEntity<Void> deleteVehicleType(@PathVariable String typeCode) {
        vehicleTypeService.deleteVehicleTypeByCode(typeCode);
        return ResponseEntity.noContent().build();
    }
}
