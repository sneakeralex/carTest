package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.AppointmentDto;
import com.carservice.dto.AppointmentMapper;
import com.carservice.entity.Appointment;
import com.carservice.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "预约管理")
public class AppointmentController {
    @Resource
    private final AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "分页查询预约列表")
    public ResponseEntity<Result<Page<Appointment>>> getAllAppointments(Pageable pageable) {
        return ResponseEntity.ok(Result.success(appointmentService.pageList(pageable)));
    }

    @GetMapping("/{appointmentNo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "获取预约详情")
    public ResponseEntity<Result<Appointment>> getAppointmentByNo(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(Result.success(appointmentService.findByNo(appointmentNo).orElseThrow()));
    }

    @GetMapping("/my-appointments")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "获取当前用户的预约列表")
    public ResponseEntity<Result<List<AppointmentDto>>> getCurrentUserAppointments(Principal principal) {
        return ResponseEntity.ok(Result.success(appointmentService.getAppointmentsByUserId(principal.getName()).stream()
                .map(AppointmentMapper::toDto)
                .toList()));
    }

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "创建预约")
    public ResponseEntity<Result<AppointmentDto>> createAppointment(@RequestBody AppointmentDto appointmentDto,
            Principal principal) {
        return ResponseEntity
                .ok(Result.success(AppointmentMapper.toDto(appointmentService.createAppointment(appointmentDto))));
    }

    @PutMapping("/{appointmentNo}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "审核预约")
    public ResponseEntity<Result<Appointment>> approveAppointment(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(Result.success(appointmentService.approveAppointmentByNo(appointmentNo)));
    }

    @PutMapping("/{appointmentNo}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "完成预约")
    public ResponseEntity<Result<Boolean>> completeAppointment(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(Result.success(appointmentService.completeAppointmentByNo(appointmentNo)));
    }

    @PutMapping("/{appointmentNo}/cancel")
    @PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
    @Operation(summary = "取消预约")
    public ResponseEntity<Result<Boolean>> cancelAppointment(@PathVariable String appointmentNo) {
        return ResponseEntity.ok(Result.success(appointmentService.cancelAppointmentByNo(appointmentNo)));
    }
}