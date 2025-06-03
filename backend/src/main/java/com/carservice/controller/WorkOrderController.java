package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.WorkOrderDto;
import com.carservice.dto.WorkOrderMapper;
import com.carservice.service.WorkOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
@Tag(name = "工单管理")
public class WorkOrderController {
    private final WorkOrderService workOrderService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "分页查询工单列表")
    public ResponseEntity<Result<Page<WorkOrderDto>>> getAllWorkOrders(Pageable pageable) {
        return ResponseEntity.ok(Result.success(workOrderService.pageList(pageable).map(WorkOrderMapper::toDto)));
    }

    @GetMapping("/{orderNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'CUSTOMER')")
    @Operation(summary = "获取工单详情")
    public ResponseEntity<Result<WorkOrderDto>> getWorkOrderById(@PathVariable String orderNo) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.getByOrderNo(orderNo).orElseThrow())));
    }

    @GetMapping("/maintenance/{maintenanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN', 'CUSTOMER')")
    @Operation(summary = "获取维修保养记录的工单")
    public ResponseEntity<Result<WorkOrderDto>> getWorkOrderByMaintenanceId(@PathVariable String maintenanceId) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.getByMaintenanceId(maintenanceId).orElseGet(null))));
    }

    @GetMapping("/technician/{technicianId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "获取技师的工单列表")
    public ResponseEntity<Result<List<WorkOrderDto>>> getWorkOrdersByTechnicianId(@PathVariable String technicianId) {
        return ResponseEntity.ok(Result.success(workOrderService.getWorkOrdersByTechnicianId(technicianId).stream()
                .map(WorkOrderMapper::toDto)
                .toList()));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "创建工单")
    public ResponseEntity<Result<WorkOrderDto>> createWorkOrder(@RequestBody WorkOrderDto workOrderDto) {
        return ResponseEntity.status(201).body(Result.success(WorkOrderMapper.toDto(workOrderService.createWorkOrder(workOrderDto))));
    }

    @PutMapping("/{orderNo}/assign-technician")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分配技师")
    public ResponseEntity<Result<WorkOrderDto>> assignTechnician(@PathVariable String orderNo, @RequestParam String technicianId) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.assignTechnician(orderNo, technicianId).orElseGet(null))));
    }

    @PutMapping("/{orderNo}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "开始工单")
    public ResponseEntity<Result<WorkOrderDto>> startWorkOrder(@PathVariable String orderNo) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.startWorkOrder(orderNo).orElseGet(null))));
    }

    @PutMapping("/{orderNo}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    @Operation(summary = "完成工单")
    public ResponseEntity<Result<WorkOrderDto>> completeWorkOrder(@PathVariable String orderNo) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.completeWorkOrder(orderNo).orElseGet(null))));
    }

    @PutMapping("/{orderNo}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "取消工单")
    public ResponseEntity<Result<WorkOrderDto>> cancelWorkOrder(@PathVariable String orderNo) {
        return ResponseEntity.ok(Result.success(WorkOrderMapper.toDto(workOrderService.cancelWorkOrder(orderNo).orElseGet(null))));
    }
}