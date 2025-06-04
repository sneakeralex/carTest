package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.equipment.*;
import com.carservice.service.EquipmentService;
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
import java.util.ArrayList;
import java.util.List;

/**
 * 设备管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/equipment")
@RequiredArgsConstructor
@Tag(name = "设备管理", description = "设备查询、申请、维护等功能")
public class EquipmentController {
    
    private final EquipmentService equipmentService;
    
    /**
     * 获取设备列表
     */
    @GetMapping
    @Operation(summary = "获取设备列表", description = "支持按类型、状态、位置筛选")
    public ResponseEntity<ApiResponse<Page<EquipmentDTO>>> getEquipmentList(
            @Parameter(description = "设备类型") @RequestParam(required = false) String equipmentType,
            @Parameter(description = "设备状态") @RequestParam(required = false) String status,
            @Parameter(description = "设备位置") @RequestParam(required = false) String location,
            @Parameter(description = "关键词搜索") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            // Convert status string to integer if provided
            Integer statusInt = null;
            if (status != null && !status.isEmpty()) {
                try {
                    statusInt = Integer.parseInt(status);
                } catch (NumberFormatException e) {
                    statusInt = null;
                }
            }
            Page<EquipmentDTO> equipment = equipmentService.getEquipments(equipmentType, statusInt, location, pageable);
            log.info("获取设备列表成功: 类型={}, 状态={}, 位置={}, 关键词={}", equipmentType, status, location, keyword);
            return ResponseEntity.ok(ApiResponse.success(equipment));
        } catch (Exception e) {
            log.error("获取设备列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取设备详情
     */
    @GetMapping("/{equipmentId}")
    @Operation(summary = "获取设备详情")
    public ResponseEntity<ApiResponse<EquipmentDTO>> getEquipmentDetail(@PathVariable String equipmentId) {
        try {
            EquipmentDTO equipment = equipmentService.getEquipmentDetail(equipmentId);
            log.info("获取设备详情成功: {}", equipmentId);
            return ResponseEntity.ok(ApiResponse.success(equipment));
        } catch (Exception e) {
            log.error("获取设备详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 检查设备可用性
     */
    @GetMapping("/{equipmentId}/availability")
    @Operation(summary = "检查设备可用性")
    public ResponseEntity<ApiResponse<Boolean>> checkEquipmentAvailability(
            @PathVariable String equipmentId,
            @Parameter(description = "开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            // TODO: 实现检查设备可用性逻辑 - 暂时返回true
            Boolean available = true;
            log.info("检查设备可用性完成: {}, 时间范围: {} - {}, 结果: {}", equipmentId, startTime, endTime, available);
            return ResponseEntity.ok(ApiResponse.success(available, available ? "设备可用" : "设备不可用"));
        } catch (Exception e) {
            log.error("检查设备可用性失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 创建设备申请
     */
    @PostMapping("/requests")
    @Operation(summary = "创建设备申请")
    public ResponseEntity<ApiResponse<EquipmentRequestDTO>> createEquipmentRequest(@Valid @RequestBody EquipmentRequestDTO requestDTO) {
        try {
            EquipmentRequestDTO request = equipmentService.createEquipmentRequest(requestDTO);
            log.info("创建设备申请成功: 设备={}, 申请人={}", requestDTO.getEquipmentId(), requestDTO.getRequesterId());
            return ResponseEntity.ok(ApiResponse.success(request, "设备申请创建成功"));
        } catch (Exception e) {
            log.error("创建设备申请失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取用户设备申请列表
     */
    @GetMapping("/requests/user/{userId}")
    @Operation(summary = "获取用户设备申请列表")
    public ResponseEntity<ApiResponse<Page<EquipmentRequestDTO>>> getUserEquipmentRequests(
            @PathVariable String userId,
            @Parameter(description = "申请状态") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            // Convert status string to integer if provided
            Integer statusInt = null;
            if (status != null && !status.isEmpty()) {
                try {
                    statusInt = Integer.parseInt(status);
                } catch (NumberFormatException e) {
                    statusInt = null;
                }
            }
            Page<EquipmentRequestDTO> requests = equipmentService.getUserEquipmentRequests(userId, statusInt, pageable);
            log.info("获取用户设备申请列表成功: 用户={}, 状态={}", userId, status);
            return ResponseEntity.ok(ApiResponse.success(requests));
        } catch (Exception e) {
            log.error("获取用户设备申请列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取设备申请详情
     */
    @GetMapping("/requests/{requestId}")
    @Operation(summary = "获取设备申请详情")
    public ResponseEntity<ApiResponse<EquipmentRequestDTO>> getEquipmentRequestDetail(@PathVariable String requestId) {
        try {
            EquipmentRequestDTO request = equipmentService.getEquipmentRequestDetail(requestId);
            log.info("获取设备申请详情成功: {}", requestId);
            return ResponseEntity.ok(ApiResponse.success(request));
        } catch (Exception e) {
            log.error("获取设备申请详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新设备申请
     */
    @PutMapping("/requests/{requestId}")
    @Operation(summary = "更新设备申请")
    public ResponseEntity<ApiResponse<EquipmentRequestDTO>> updateEquipmentRequest(
            @PathVariable String requestId,
            @Valid @RequestBody EquipmentRequestDTO requestDTO) {
        try {
            EquipmentRequestDTO request = equipmentService.updateEquipmentRequest(requestId, requestDTO);
            log.info("更新设备申请成功: {}", requestId);
            return ResponseEntity.ok(ApiResponse.success(request, "设备申请更新成功"));
        } catch (Exception e) {
            log.error("更新设备申请失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 取消设备申请
     */
    @PostMapping("/requests/{requestId}/cancel")
    @Operation(summary = "取消设备申请")
    public ResponseEntity<ApiResponse<Void>> cancelEquipmentRequest(
            @PathVariable String requestId,
            @RequestBody CancelRequestRequest request) {
        try {
            equipmentService.cancelEquipmentRequest(requestId, request.getReason());
            log.info("取消设备申请成功: {}, 原因: {}", requestId, request.getReason());
            return ResponseEntity.ok(ApiResponse.success(null, "设备申请取消成功"));
        } catch (Exception e) {
            log.error("取消设备申请失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取设备维护记录
     */
    @GetMapping("/{equipmentId}/maintenance")
    @Operation(summary = "获取设备维护记录")
    public ResponseEntity<ApiResponse<List<EquipmentMaintenanceDTO>>> getEquipmentMaintenanceRecords(
            @PathVariable String equipmentId,
            @Parameter(description = "开始时间") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "结束时间") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            // Use pageable for maintenance records
            Pageable pageable = PageRequest.of(0, 100); // Default pagination
            Page<EquipmentMaintenanceDTO> records = equipmentService.getEquipmentMaintenanceRecords(equipmentId, pageable);
            log.info("获取设备维护记录成功: 设备={}, 时间范围: {} - {}", equipmentId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success(records.getContent()));
        } catch (Exception e) {
            log.error("获取设备维护记录失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 创建设备维护记录
     */
    @PostMapping("/{equipmentId}/maintenance")
    @Operation(summary = "创建设备维护记录")
    public ResponseEntity<ApiResponse<EquipmentMaintenanceDTO>> createMaintenanceRecord(
            @PathVariable String equipmentId,
            @Valid @RequestBody EquipmentMaintenanceDTO maintenanceDTO) {
        try {
            maintenanceDTO.setEquipmentId(equipmentId);
            EquipmentMaintenanceDTO maintenance = equipmentService.createMaintenanceRecord(maintenanceDTO);
            log.info("创建设备维护记录成功: 设备={}, 维护类型={}", equipmentId, maintenanceDTO.getMaintenanceType());
            return ResponseEntity.ok(ApiResponse.success(maintenance, "维护记录创建成功"));
        } catch (Exception e) {
            log.error("创建设备维护记录失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取设备使用统计
     */
    @GetMapping("/{equipmentId}/usage-stats")
    @Operation(summary = "获取设备使用统计")
    public ResponseEntity<ApiResponse<Object>> getEquipmentUsageStats(
            @PathVariable String equipmentId,
            @Parameter(description = "统计开始时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @Parameter(description = "统计结束时间") @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            Object stats = equipmentService.getEquipmentUsageStatistics(equipmentId, startTime, endTime);
            log.info("获取设备使用统计成功: 设备={}, 时间范围: {} - {}", equipmentId, startTime, endTime);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("获取设备使用统计失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取设备分类列表
     */
    @GetMapping("/categories")
    @Operation(summary = "获取设备分类列表")
    public ResponseEntity<ApiResponse<List<EquipmentCategoryDTO>>> getEquipmentCategories() {
        try {
            // TODO: 实现获取设备分类列表逻辑 - 返回模拟数据
            List<EquipmentCategoryDTO> categories = createMockCategories();
            log.info("获取设备分类列表成功");
            return ResponseEntity.ok(ApiResponse.success(categories));
        } catch (Exception e) {
            log.error("获取设备分类列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 创建模拟设备分类数据
     */
    private List<EquipmentCategoryDTO> createMockCategories() {
        List<EquipmentCategoryDTO> categories = new ArrayList<>();

        EquipmentCategoryDTO category1 = new EquipmentCategoryDTO();
        category1.setCategoryId("CAT001");
        category1.setCategoryName("测试设备");
        category1.setDescription("用于各种测试的设备");
        categories.add(category1);

        EquipmentCategoryDTO category2 = new EquipmentCategoryDTO();
        category2.setCategoryId("CAT002");
        category2.setCategoryName("测量设备");
        category2.setDescription("用于测量的精密设备");
        categories.add(category2);

        EquipmentCategoryDTO category3 = new EquipmentCategoryDTO();
        category3.setCategoryId("CAT003");
        category3.setCategoryName("安全设备");
        category3.setDescription("安全防护相关设备");
        categories.add(category3);

        return categories;
    }
    
    /**
     * 取消申请请求DTO
     */
    public static class CancelRequestRequest {
        private String reason;
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
    
    /**
     * 设备使用统计DTO
     */
    public static class EquipmentUsageStatsDTO {
        private String equipmentId;
        private String equipmentName;
        private Integer totalUsageHours;
        private Integer totalRequests;
        private Double utilizationRate;
        private LocalDateTime lastUsedTime;
        
        // Getters and Setters
        public String getEquipmentId() { return equipmentId; }
        public void setEquipmentId(String equipmentId) { this.equipmentId = equipmentId; }
        public String getEquipmentName() { return equipmentName; }
        public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }
        public Integer getTotalUsageHours() { return totalUsageHours; }
        public void setTotalUsageHours(Integer totalUsageHours) { this.totalUsageHours = totalUsageHours; }
        public Integer getTotalRequests() { return totalRequests; }
        public void setTotalRequests(Integer totalRequests) { this.totalRequests = totalRequests; }
        public Double getUtilizationRate() { return utilizationRate; }
        public void setUtilizationRate(Double utilizationRate) { this.utilizationRate = utilizationRate; }
        public LocalDateTime getLastUsedTime() { return lastUsedTime; }
        public void setLastUsedTime(LocalDateTime lastUsedTime) { this.lastUsedTime = lastUsedTime; }
    }
    
    /**
     * 设备分类DTO
     */
    public static class EquipmentCategoryDTO {
        private String categoryId;
        private String categoryName;
        private String description;
        private Integer equipmentCount;
        
        // Getters and Setters
        public String getCategoryId() { return categoryId; }
        public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
        public String getCategoryName() { return categoryName; }
        public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Integer getEquipmentCount() { return equipmentCount; }
        public void setEquipmentCount(Integer equipmentCount) { this.equipmentCount = equipmentCount; }
    }
}
