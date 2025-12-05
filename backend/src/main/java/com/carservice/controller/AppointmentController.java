package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.AppointmentDto;
import com.carservice.dto.AppointmentMapper;
import com.carservice.entity.Appointment;
import com.carservice.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
@Tag(name = "预约管理")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @GetMapping
    @Operation(summary = "获取预约列表")
    public ResponseEntity<Result<Page<Appointment>>> getAllAppointments(Pageable pageable, HttpServletRequest request) {
        try {
            HttpSession session = request.getSession();
            String userId = (String) session.getAttribute("userId");
            String role = (String) session.getAttribute("role");
            
            // 根据角色返回不同的预约列表
            if ("ROLE_ADMIN".equals(role) || "ROLE_EMPLOYEE".equals(role)) {
                return ResponseEntity.ok(Result.success(appointmentService.pageList(pageable)));
            } else {
                return ResponseEntity.ok(Result.success(appointmentService.getAppointmentsByUserId(userId, pageable)));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Result.error(HttpStatus.UNAUTHORIZED.value(), "获取预约列表失败"));
        }
    }

    @GetMapping("/{appointmentNo}")
    @Operation(summary = "获取预约详情")
    public ResponseEntity<Result<Appointment>> getAppointmentByNo(@PathVariable String appointmentNo, HttpServletRequest request) {
        try {
            HttpSession session = request.getSession();
            String userId = (String) session.getAttribute("userId");
            String role = (String) session.getAttribute("role");
            
            Appointment appointment = appointmentService.findByNo(appointmentNo).orElseThrow();
            
            // 检查是否为管理员或是预约的所有者
            if ("ROLE_ADMIN".equals(role) || appointment.getUserId().equals(userId)) {
                return ResponseEntity.ok(Result.success(appointment));
            } else {
                return ResponseEntity.ok(Result.error(HttpStatus.FORBIDDEN.value(), "无权访问此预约信息"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Result.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取预约详情失败"));
        }
    }

    @GetMapping("/my-appointments")
    @Operation(summary = "获取当前用户的预约列表")
    public ResponseEntity<Result<List<AppointmentDto>>> getCurrentUserAppointments(HttpServletRequest request) {
        try {
            String userId = (String) request.getSession().getAttribute("userId");
            return ResponseEntity.ok(Result.success(appointmentService.getAppointmentsByUserId(userId).stream()
                    .map(AppointmentMapper::toDto)
                    .toList()));
        } catch (Exception e) {
            return ResponseEntity.ok(Result.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "获取预约列表失败"));
        }
    }

    @PostMapping
    @Operation(summary = "创建预约")
    public ResponseEntity<Result<AppointmentDto>> createAppointment(@RequestBody AppointmentDto appointmentDto,
            HttpServletRequest request) {
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("userId");
        appointmentDto.setUserId(userId);
        return ResponseEntity
                .ok(Result.success(AppointmentMapper.toDto(appointmentService.createAppointment(appointmentDto))));
    }

    @PutMapping("/{appointmentNo}/approve")
    @Operation(summary = "审核预约")
    public ResponseEntity<Result<Appointment>> approveAppointment(@PathVariable String appointmentNo, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String role = (String) session.getAttribute("role");
        if (!"ROLE_ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Result.error(HttpStatus.FORBIDDEN.value(), "无权操作"));
        }
        return ResponseEntity.ok(Result.success(appointmentService.approveAppointmentByNo(appointmentNo)));
    }

    @PutMapping("/{appointmentNo}/complete")
    @Operation(summary = "完成预约")
    public ResponseEntity<Result<Boolean>> completeAppointment(@PathVariable String appointmentNo, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String role = (String) session.getAttribute("role");
        if (!"ROLE_ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Result.error(HttpStatus.FORBIDDEN.value(), "无权操作"));
        }
        return ResponseEntity.ok(Result.success(appointmentService.completeAppointmentByNo(appointmentNo)));
    }

    @PutMapping("/{appointmentNo}/cancel")
    @Operation(summary = "取消预约")
    public ResponseEntity<Result<Boolean>> cancelAppointment(@PathVariable String appointmentNo, HttpServletRequest request) {
        HttpSession session = request.getSession();
        String userId = (String) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");
        
        Appointment appointment = appointmentService.findByNo(appointmentNo).orElseThrow();
        if (!"ROLE_ADMIN".equals(role) && !appointment.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Result.error(HttpStatus.FORBIDDEN.value(), "无权操作"));
        }
        return ResponseEntity.ok(Result.success(appointmentService.cancelAppointmentByNo(appointmentNo)));
    }
}