package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.test.*;
import com.carservice.service.TestRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * 试验登记控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/test-registration")
@RequiredArgsConstructor
@Tag(name = "试验登记", description = "试验任务、项目、车辆、内容管理")
public class TestRegistrationController {
    
    private final TestRegistrationService testRegistrationService;
    
    /**
     * 创建试验任务
     */
    @PostMapping("/tasks")
    @Operation(summary = "创建试验任务")
    public ResponseEntity<ApiResponse<TestTaskDTO>> createTestTask(@Valid @RequestBody TestTaskDTO testTaskDTO) {
        try {
            TestTaskDTO task = testRegistrationService.createTestTask(testTaskDTO);
            log.info("创建试验任务成功: {}", testTaskDTO.getTaskNo());
            return ResponseEntity.ok(ApiResponse.success(task, "试验任务创建成功"));
        } catch (Exception e) {
            log.error("创建试验任务失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取试验任务列表
     */
    @GetMapping("/tasks")
    @Operation(summary = "获取试验任务列表")
    public ResponseEntity<ApiResponse<Page<TestTaskDTO>>> getTestTasks(
            @Parameter(description = "授权人ID") @RequestParam(required = false) String authorizerId,
            @Parameter(description = "任务状态") @RequestParam(required = false) String status,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<TestTaskDTO> tasks = testRegistrationService.getTestTasks(authorizerId, status, pageable);
            log.info("获取试验任务列表成功: 授权人={}, 状态={}", authorizerId, status);
            return ResponseEntity.ok(ApiResponse.success(tasks));
        } catch (Exception e) {
            log.error("获取试验任务列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取试验任务详情
     */
    @GetMapping("/tasks/{taskId}")
    @Operation(summary = "获取试验任务详情")
    public ResponseEntity<ApiResponse<TestTaskDTO>> getTestTaskDetail(@PathVariable String taskId) {
        try {
            TestTaskDTO task = testRegistrationService.getTestTaskDetail(taskId);
            log.info("获取试验任务详情成功: {}", taskId);
            return ResponseEntity.ok(ApiResponse.success(task));
        } catch (Exception e) {
            log.error("获取试验任务详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新试验任务
     */
    @PutMapping("/tasks/{taskId}")
    @Operation(summary = "更新试验任务")
    public ResponseEntity<ApiResponse<TestTaskDTO>> updateTestTask(
            @PathVariable String taskId,
            @Valid @RequestBody TestTaskDTO testTaskDTO) {
        try {
            TestTaskDTO task = testRegistrationService.updateTestTask(taskId, testTaskDTO);
            log.info("更新试验任务成功: {}", taskId);
            return ResponseEntity.ok(ApiResponse.success(task, "试验任务更新成功"));
        } catch (Exception e) {
            log.error("更新试验任务失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 删除试验任务
     */
    @DeleteMapping("/tasks/{taskId}")
    @Operation(summary = "删除试验任务")
    public ResponseEntity<ApiResponse<Void>> deleteTestTask(@PathVariable String taskId) {
        try {
            testRegistrationService.deleteTestTask(taskId);
            log.info("删除试验任务成功: {}", taskId);
            return ResponseEntity.ok(ApiResponse.success(null, "试验任务删除成功"));
        } catch (Exception e) {
            log.error("删除试验任务失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 添加试验项目
     */
    @PostMapping("/tasks/{taskId}/projects")
    @Operation(summary = "添加试验项目")
    public ResponseEntity<ApiResponse<TestProjectDTO>> addTestProject(
            @PathVariable String taskId,
            @Valid @RequestBody TestProjectDTO projectDTO) {
        try {
            TestProjectDTO project = testRegistrationService.addTestProject(taskId, projectDTO);
            log.info("添加试验项目成功: 任务={}, 项目={}", taskId, projectDTO.getProjectName());
            return ResponseEntity.ok(ApiResponse.success(project, "试验项目添加成功"));
        } catch (Exception e) {
            log.error("添加试验项目失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取试验项目列表
     */
    @GetMapping("/tasks/{taskId}/projects")
    @Operation(summary = "获取试验项目列表")
    public ResponseEntity<ApiResponse<List<TestProjectDTO>>> getTestProjects(@PathVariable String taskId) {
        try {
            List<TestProjectDTO> projects = testRegistrationService.getTestProjects(taskId);
            log.info("获取试验项目列表成功: 任务={}", taskId);
            return ResponseEntity.ok(ApiResponse.success(projects));
        } catch (Exception e) {
            log.error("获取试验项目列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新试验项目
     */
    @PutMapping("/projects/{projectId}")
    @Operation(summary = "更新试验项目")
    public ResponseEntity<ApiResponse<TestProjectDTO>> updateTestProject(
            @PathVariable String projectId,
            @Valid @RequestBody TestProjectDTO projectDTO) {
        try {
            TestProjectDTO project = testRegistrationService.updateTestProject(projectId, projectDTO);
            log.info("更新试验项目成功: {}", projectId);
            return ResponseEntity.ok(ApiResponse.success(project, "试验项目更新成功"));
        } catch (Exception e) {
            log.error("更新试验项目失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 删除试验项目
     */
    @DeleteMapping("/projects/{projectId}")
    @Operation(summary = "删除试验项目")
    public ResponseEntity<ApiResponse<Void>> deleteTestProject(@PathVariable String projectId) {
        try {
            testRegistrationService.deleteTestProject(projectId);
            log.info("删除试验项目成功: {}", projectId);
            return ResponseEntity.ok(ApiResponse.success(null, "试验项目删除成功"));
        } catch (Exception e) {
            log.error("删除试验项目失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 添加任务车辆
     */
    @PostMapping("/projects/{projectId}/vehicles")
    @Operation(summary = "添加任务车辆")
    public ResponseEntity<ApiResponse<TaskVehicleDTO>> addTaskVehicle(
            @PathVariable String projectId,
            @Valid @RequestBody TaskVehicleDTO vehicleDTO) {
        try {
            TaskVehicleDTO vehicle = testRegistrationService.addTaskVehicle(projectId, vehicleDTO);
            log.info("添加任务车辆成功: 项目={}, 车辆={}", projectId, vehicleDTO.getVehicleId());
            return ResponseEntity.ok(ApiResponse.success(vehicle, "任务车辆添加成功"));
        } catch (Exception e) {
            log.error("添加任务车辆失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取任务车辆列表
     */
    @GetMapping("/projects/{projectId}/vehicles")
    @Operation(summary = "获取任务车辆列表")
    public ResponseEntity<ApiResponse<List<TaskVehicleDTO>>> getTaskVehicles(@PathVariable String projectId) {
        try {
            List<TaskVehicleDTO> vehicles = testRegistrationService.getTaskVehicles(projectId);
            log.info("获取任务车辆列表成功: 项目={}", projectId);
            return ResponseEntity.ok(ApiResponse.success(vehicles));
        } catch (Exception e) {
            log.error("获取任务车辆列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 添加试验内容
     */
    @PostMapping("/vehicles/{taskVehicleId}/contents")
    @Operation(summary = "添加试验内容")
    public ResponseEntity<ApiResponse<TestContentDTO>> addTestContent(
            @PathVariable String taskVehicleId,
            @Valid @RequestBody TestContentDTO contentDTO) {
        try {
            TestContentDTO content = testRegistrationService.addTestContent(taskVehicleId, contentDTO);
            log.info("添加试验内容成功: 车辆={}, 内容={}", taskVehicleId, contentDTO.getTestItem());
            return ResponseEntity.ok(ApiResponse.success(content, "试验内容添加成功"));
        } catch (Exception e) {
            log.error("添加试验内容失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取试验内容列表
     */
    @GetMapping("/vehicles/{taskVehicleId}/contents")
    @Operation(summary = "获取试验内容列表")
    public ResponseEntity<ApiResponse<List<TestContentDTO>>> getTestContents(@PathVariable String taskVehicleId) {
        try {
            List<TestContentDTO> contents = testRegistrationService.getTestContents(taskVehicleId);
            log.info("获取试验内容列表成功: 车辆={}", taskVehicleId);
            return ResponseEntity.ok(ApiResponse.success(contents));
        } catch (Exception e) {
            log.error("获取试验内容列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新试验内容
     */
    @PutMapping("/contents/{contentId}")
    @Operation(summary = "更新试验内容")
    public ResponseEntity<ApiResponse<TestContentDTO>> updateTestContent(
            @PathVariable String contentId,
            @Valid @RequestBody TestContentDTO contentDTO) {
        try {
            TestContentDTO content = testRegistrationService.updateTestContent(contentId, contentDTO);
            log.info("更新试验内容成功: {}", contentId);
            return ResponseEntity.ok(ApiResponse.success(content, "试验内容更新成功"));
        } catch (Exception e) {
            log.error("更新试验内容失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 删除试验内容
     */
    @DeleteMapping("/contents/{contentId}")
    @Operation(summary = "删除试验内容")
    public ResponseEntity<ApiResponse<Void>> deleteTestContent(@PathVariable String contentId) {
        try {
            testRegistrationService.deleteTestContent(contentId);
            log.info("删除试验内容成功: {}", contentId);
            return ResponseEntity.ok(ApiResponse.success(null, "试验内容删除成功"));
        } catch (Exception e) {
            log.error("删除试验内容失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取合同信息
     */
    @GetMapping("/contracts/{contractNo}")
    @Operation(summary = "获取合同信息")
    public ResponseEntity<ApiResponse<ContractDTO>> getContractInfo(@PathVariable String contractNo) {
        try {
            ContractDTO contract = testRegistrationService.getContractInfo(contractNo);
            log.info("获取合同信息成功: {}", contractNo);
            return ResponseEntity.ok(ApiResponse.success(contract));
        } catch (Exception e) {
            log.error("获取合同信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取用户可用合同列表
     */
    @GetMapping("/contracts/user/{userId}")
    @Operation(summary = "获取用户可用合同列表")
    public ResponseEntity<ApiResponse<List<ContractDTO>>> getUserContracts(@PathVariable String userId) {
        try {
            List<ContractDTO> contracts = testRegistrationService.getUserContracts(userId);
            log.info("获取用户可用合同列表成功: {}", userId);
            return ResponseEntity.ok(ApiResponse.success(contracts));
        } catch (Exception e) {
            log.error("获取用户可用合同列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
