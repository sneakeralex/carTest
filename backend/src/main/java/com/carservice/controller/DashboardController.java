package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.booking.SiteBookingDTO;
import com.carservice.service.BookingService;
import com.carservice.service.DashboardService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 移动端仪表板控制器
 */
@Slf4j
@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "移动端仪表板", description = "移动端首页数据、统计信息等功能")
public class DashboardController {

    private final DashboardService dashboardService;
    private final BookingService bookingService;

    /**
     * 获取用户仪表板数据
     */
    @GetMapping("/user/")
    @Operation(summary = "获取用户仪表板数据", description = "获取用户首页展示的各种统计数据")
    public ResponseEntity<ApiResponse<UserDashboardDTO>> getUserDashboard(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
        try {
            UserDashboardDTO dashboard = dashboardService.getUserDashboard(userId);
            log.info("获取用户仪表板数据成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(dashboard));
        } catch (Exception e) {
            log.error("获取用户仪表板数据失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取用户统计信息
     */
    @GetMapping("/user/stats")
    @Operation(summary = "获取用户统计信息")
    public ResponseEntity<ApiResponse<UserStatsDTO>> getUserStats(
            HttpServletRequest request,
            @Parameter(description = "统计开始时间") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "统计结束时间") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {

        String userId = (String) request.getSession().getAttribute("userId");
        try {
            UserStatsDTO stats = dashboardService.getUserStats(userId, startTime, endTime);
            log.info("获取用户统计信息成功: 用户={}, 时间范围: {} - {}", userId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("获取用户统计信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取最近活动
     */
    @GetMapping("/user/recent-activities")
    @Operation(summary = "获取最近活动")
    public ResponseEntity<ApiResponse<List<ActivityDTO>>> getRecentActivities(
            HttpServletRequest request,
            @Parameter(description = "活动数量限制") @RequestParam(defaultValue = "10") int limit) {

        String userId = (String) request.getSession().getAttribute("userId");
        try {
            List<ActivityDTO> activities = dashboardService.getRecentActivities(userId, limit);
            log.info("获取最近活动成功: 用户={}, 限制数量={}", userId, limit);
            return ResponseEntity.ok(ApiResponse.success(activities));
        } catch (Exception e) {
            log.error("获取最近活动失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取待办事项
     */
    @GetMapping("/user/todos")
    @Operation(summary = "获取待办事项")
    public ResponseEntity<ApiResponse<List<TodoDTO>>> getUserTodos(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
        try {
            List<TodoDTO> todos = dashboardService.getUserTodos(userId);
            log.info("获取待办事项成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(todos));
        } catch (Exception e) {
            log.error("获取待办事项失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取快捷操作
     */
    @GetMapping("/user/quick-actions")
    @Operation(summary = "获取快捷操作")
    public ResponseEntity<ApiResponse<List<QuickActionDTO>>> getQuickActions(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");
        try {
            List<QuickActionDTO> actions = dashboardService.getQuickActions(userId);
            log.info("获取快捷操作成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(actions));
        } catch (Exception e) {
            log.error("获取快捷操作失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取系统公告
     */
    @GetMapping("/notifications")
    @Operation(summary = "获取系统公告")
    public ResponseEntity<ApiResponse<List<AnnouncementDTO>>> getAnnouncements(
            @Parameter(description = "公告数量限制") @RequestParam(defaultValue = "5") int limit) {
        try {
            List<AnnouncementDTO> notifications = dashboardService.getAnnouncements(limit);
            log.info("获取系统公告成功: 限制数量={}", limit);
            return ResponseEntity.ok(ApiResponse.success(notifications));
        } catch (Exception e) {
            log.error("获取系统公告失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取天气信息
     */
    @GetMapping("/weather")
    @Operation(summary = "获取天气信息")
    public ResponseEntity<ApiResponse<WeatherInfoDTO>> getWeatherInfo(
            @Parameter(description = "位置") @RequestParam(required = false) String location) {
        try {
            WeatherInfoDTO weather = dashboardService.getWeatherInfo(location);
            log.info("获取天气信息成功: 位置={}", location);
            return ResponseEntity.ok(ApiResponse.success(weather));
        } catch (Exception e) {
            log.error("获取天气信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取最近预约
     */
    @GetMapping("/recent-bookings")
    @Operation(summary = "获取最近预约")
    public ResponseEntity<ApiResponse<Page<SiteBookingDTO>>> getRecentBookings(HttpServletRequest request,
            @RequestParam(defaultValue = "5") int limit) {
        String userId = (String) request.getSession().getAttribute("userId");        
        try {
            Page<SiteBookingDTO> bookings = bookingService.getUserBookings(userId, null, PageRequest.of(0, limit));
            log.info("获取最近预约成功: 限制数量={}", limit);
            return ResponseEntity.ok(ApiResponse.success(bookings));
        } catch (Exception e) {
            log.error("获取最近预约失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/notifications/unread-count")
    public String getUnreadCount(HttpServletRequest request) {
        String userId = (String) request.getSession().getAttribute("userId");  
        return userId;
    }

    /**
     * 用户仪表板DTO
     */
    @Data
    public static class UserDashboardDTO {
        private String userId;
        private String userName;
        private String userAvatar;
        private UserStatsDTO stats;
        private List<ActivityDTO> recentActivities;
        private List<TodoDTO> todos;
        private List<QuickActionDTO> quickActions;
        private List<AnnouncementDTO> announcements;
        private WeatherInfoDTO weather;
    }

    /**
     * 用户统计DTO
     */
    @Data
    public static class UserStatsDTO {
        private Integer totalBookings;
        private Integer pendingBookings;
        private Integer completedBookings;
        private Integer totalVehicles;
        private Integer unreadMessages;
        private Integer pendingApprovals;
    }

    /**
     * 活动DTO
     */
    @Data
    public static class ActivityDTO {
        private String activityId;
        private String activityType;
        private String title;
        private String description;
        private String status;
        private LocalDateTime activityTime;
    }

    /**
     * 待办事项DTO
     */
    @Data
    public static class TodoDTO {
        private String todoId;
        private String title;
        private String description;
        private String priority;
        private LocalDateTime dueDate;
        private Boolean completed;
    }

    /**
     * 快捷操作DTO
     */
    @Data
    public static class QuickActionDTO {
        private String actionId;
        private String title;
        private String description;
        private String icon;
        private String actionUrl;
        private String actionType;
    }

    /**
     * 系统公告DTO
     */
    @Data
    public static class AnnouncementDTO {
        private String announcementId;
        private String title;
        private String content;
        private String priority;
        private LocalDateTime publishTime;
        private LocalDateTime expireTime;
    }

    /**
     * 天气信息DTO
     */
    @Data
    public static class WeatherInfoDTO {
        private String location;
        private String weather;
        private String temperature;
        private String humidity;
        private String windSpeed;
        private String description;
        private String icon;
    }
}
