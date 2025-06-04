package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.booking.*;
import com.carservice.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 预约管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Tag(name = "预约管理", description = "场地预约、排期查询、天气信息等功能")
public class BookingController {
    
    private final BookingService bookingService;
    
    /**
     * 获取场地列表
     */
    @GetMapping("/sites")
    @Operation(summary = "获取场地列表", description = "支持按类型和状态筛选")
    public ResponseEntity<ApiResponse<Page<TestSiteDTO>>> getSites(
            @Parameter(description = "场地类型") @RequestParam(required = false) String siteType,
            @Parameter(description = "场地状态") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<TestSiteDTO> sites = bookingService.getSites(siteType, status, pageable);
            log.info("获取场地列表成功: 类型={}, 状态={}, 页码={}, 大小={}", siteType, status, page, size);
            return ResponseEntity.ok(ApiResponse.success(sites));
        } catch (Exception e) {
            log.error("获取场地列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取场地详情
     */
    @GetMapping("/sites/{siteId}")
    @Operation(summary = "获取场地详情")
    public ResponseEntity<ApiResponse<TestSiteDTO>> getSiteDetail(@PathVariable String siteId) {
        try {
            TestSiteDTO site = bookingService.getSiteDetail(siteId);
            log.info("获取场地详情成功: {}", siteId);
            return ResponseEntity.ok(ApiResponse.success(site));
        } catch (Exception e) {
            log.error("获取场地详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取场地排期
     */
    @GetMapping("/sites/{siteId}/schedules")
    @Operation(summary = "获取场地排期")
    public ResponseEntity<ApiResponse<List<SiteScheduleDTO>>> getSiteSchedules(
            @PathVariable String siteId,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<SiteScheduleDTO> schedules = bookingService.getSiteSchedules(siteId, startTime, endTime);
            log.info("获取场地排期成功: {}, 时间范围: {} - {}", siteId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success(schedules));
        } catch (Exception e) {
            log.error("获取场地排期失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 检查场地可用性
     */
    @GetMapping("/sites/{siteId}/availability")
    @Operation(summary = "检查场地可用性")
    public ResponseEntity<ApiResponse<Boolean>> checkSiteAvailability(
            @PathVariable String siteId,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            Boolean available = bookingService.checkSiteAvailability(siteId, startTime, endTime);
            log.info("检查场地可用性完成: {}, 时间范围: {} - {}, 结果: {}", siteId, startTime, endTime, available);
            return ResponseEntity.ok(ApiResponse.success(available, available ? "场地可用" : "场地不可用"));
        } catch (Exception e) {
            log.error("检查场地可用性失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 创建预约
     */
    @PostMapping
    @Operation(summary = "创建预约")
    public ResponseEntity<ApiResponse<SiteBookingDTO>> createBooking(@Valid @RequestBody SiteBookingDTO bookingDTO) {
        try {
            SiteBookingDTO booking = bookingService.createBooking(bookingDTO);
            log.info("创建预约成功: 场地={}, 用户={}", bookingDTO.getSiteId(), bookingDTO.getUserId());
            return ResponseEntity.ok(ApiResponse.success(booking, "预约创建成功"));
        } catch (Exception e) {
            log.error("创建预约失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取用户预约列表
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户预约列表")
    public ResponseEntity<ApiResponse<Page<SiteBookingDTO>>> getUserBookings(
            @PathVariable String userId,
            @Parameter(description = "预约状态") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<SiteBookingDTO> bookings = bookingService.getUserBookings(userId, status, pageable);
            log.info("获取用户预约列表成功: 用户={}, 状态={}", userId, status);
            return ResponseEntity.ok(ApiResponse.success(bookings));
        } catch (Exception e) {
            log.error("获取用户预约列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取预约详情
     */
    @GetMapping("/{bookingId}")
    @Operation(summary = "获取预约详情")
    public ResponseEntity<ApiResponse<SiteBookingDTO>> getBookingDetail(@PathVariable String bookingId) {
        try {
            SiteBookingDTO booking = bookingService.getBookingDetail(bookingId);
            log.info("获取预约详情成功: {}", bookingId);
            return ResponseEntity.ok(ApiResponse.success(booking));
        } catch (Exception e) {
            log.error("获取预约详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新预约
     */
    @PutMapping("/{bookingId}")
    @Operation(summary = "更新预约")
    public ResponseEntity<ApiResponse<SiteBookingDTO>> updateBooking(
            @PathVariable String bookingId,
            @Valid @RequestBody SiteBookingDTO bookingDTO) {
        try {
            SiteBookingDTO booking = bookingService.updateBooking(bookingId, bookingDTO);
            log.info("更新预约成功: {}", bookingId);
            return ResponseEntity.ok(ApiResponse.success(booking, "预约更新成功"));
        } catch (Exception e) {
            log.error("更新预约失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 取消预约
     */
    @PostMapping("/{bookingId}/cancel")
    @Operation(summary = "取消预约")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(
            @PathVariable String bookingId,
            @RequestBody CancelBookingRequest request) {
        try {
            bookingService.cancelBooking(bookingId, request.getReason());
            log.info("取消预约成功: {}, 原因: {}", bookingId, request.getReason());
            return ResponseEntity.ok(ApiResponse.success(null, "预约取消成功"));
        } catch (Exception e) {
            log.error("取消预约失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取天气信息
     */
    @GetMapping("/sites/{siteId}/weather")
    @Operation(summary = "获取天气信息")
    public ResponseEntity<ApiResponse<WeatherRecordDTO>> getWeatherInfo(
            @PathVariable String siteId,
            @Parameter(description = "日期") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        try {
            WeatherRecordDTO weather = bookingService.getWeatherInfo(siteId, date);
            log.info("获取天气信息成功: 场地={}, 日期={}", siteId, date);
            return ResponseEntity.ok(ApiResponse.success(weather));
        } catch (Exception e) {
            log.error("获取天气信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取天气历史记录
     */
    @GetMapping("/sites/{siteId}/weather/history")
    @Operation(summary = "获取天气历史记录")
    public ResponseEntity<ApiResponse<List<WeatherRecordDTO>>> getWeatherHistory(
            @PathVariable String siteId,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            List<WeatherRecordDTO> records = bookingService.getWeatherHistory(siteId, startTime, endTime);
            log.info("获取天气历史记录成功: 场地={}, 时间范围: {} - {}", siteId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success(records));
        } catch (Exception e) {
            log.error("获取天气历史记录失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 检查天气适宜性
     */
    @GetMapping("/sites/{siteId}/weather/suitability")
    @Operation(summary = "检查天气适宜性")
    public ResponseEntity<ApiResponse<Boolean>> checkWeatherSuitability(
            @PathVariable String siteId,
            @Parameter(description = "测试时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime testTime) {
        try {
            Boolean suitable = bookingService.checkWeatherSuitability(siteId, testTime);
            log.info("检查天气适宜性完成: 场地={}, 时间={}, 结果={}", siteId, testTime, suitable);
            return ResponseEntity.ok(ApiResponse.success(suitable, suitable ? "天气适宜" : "天气不适宜"));
        } catch (Exception e) {
            log.error("检查天气适宜性失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 取消预约请求DTO
     */
    public static class CancelBookingRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
