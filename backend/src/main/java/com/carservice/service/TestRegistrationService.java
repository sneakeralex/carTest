package com.carservice.service;

import com.carservice.dto.test.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 试验登记服务接口
 */
public interface TestRegistrationService {
    
    /**
     * 创建试验任务
     * @param testTaskDTO 试验任务信息
     * @return 创建的试验任务
     */
    TestTaskDTO createTestTask(TestTaskDTO testTaskDTO);
    
    /**
     * 获取试验任务列表
     * @param authorizerId 授权人ID
     * @param status 任务状态
     * @param pageable 分页信息
     * @return 试验任务列表
     */
    Page<TestTaskDTO> getTestTasks(String authorizerId, String status, Pageable pageable);
    
    /**
     * 获取试验任务详情
     * @param taskId 任务ID
     * @return 试验任务详情
     */
    TestTaskDTO getTestTaskDetail(String taskId);
    
    /**
     * 更新试验任务
     * @param taskId 任务ID
     * @param testTaskDTO 试验任务信息
     * @return 更新后的试验任务
     */
    TestTaskDTO updateTestTask(String taskId, TestTaskDTO testTaskDTO);
    
    /**
     * 删除试验任务
     * @param taskId 任务ID
     */
    void deleteTestTask(String taskId);
    
    /**
     * 添加试验项目
     * @param taskId 任务ID
     * @param projectDTO 项目信息
     * @return 添加的项目
     */
    TestProjectDTO addTestProject(String taskId, TestProjectDTO projectDTO);
    
    /**
     * 获取试验项目列表
     * @param taskId 任务ID
     * @return 项目列表
     */
    List<TestProjectDTO> getTestProjects(String taskId);
    
    /**
     * 更新试验项目
     * @param projectId 项目ID
     * @param projectDTO 项目信息
     * @return 更新后的项目
     */
    TestProjectDTO updateTestProject(String projectId, TestProjectDTO projectDTO);
    
    /**
     * 删除试验项目
     * @param projectId 项目ID
     */
    void deleteTestProject(String projectId);
    
    /**
     * 添加任务车辆
     * @param projectId 项目ID
     * @param vehicleDTO 车辆信息
     * @return 添加的任务车辆
     */
    TaskVehicleDTO addTaskVehicle(String projectId, TaskVehicleDTO vehicleDTO);
    
    /**
     * 获取任务车辆列表
     * @param projectId 项目ID
     * @return 车辆列表
     */
    List<TaskVehicleDTO> getTaskVehicles(String projectId);
    
    /**
     * 更新任务车辆
     * @param taskVehicleId 任务车辆ID
     * @param vehicleDTO 车辆信息
     * @return 更新后的车辆
     */
    TaskVehicleDTO updateTaskVehicle(String taskVehicleId, TaskVehicleDTO vehicleDTO);
    
    /**
     * 删除任务车辆
     * @param taskVehicleId 任务车辆ID
     */
    void deleteTaskVehicle(String taskVehicleId);
    
    /**
     * 添加试验内容
     * @param taskVehicleId 任务车辆ID
     * @param contentDTO 试验内容
     * @return 添加的试验内容
     */
    TestContentDTO addTestContent(String taskVehicleId, TestContentDTO contentDTO);
    
    /**
     * 获取试验内容列表
     * @param taskVehicleId 任务车辆ID
     * @return 试验内容列表
     */
    List<TestContentDTO> getTestContents(String taskVehicleId);
    
    /**
     * 更新试验内容
     * @param contentId 内容ID
     * @param contentDTO 试验内容
     * @return 更新后的试验内容
     */
    TestContentDTO updateTestContent(String contentId, TestContentDTO contentDTO);
    
    /**
     * 删除试验内容
     * @param contentId 内容ID
     */
    void deleteTestContent(String contentId);
    
    /**
     * 获取合同信息
     * @param contractNo 合同编号
     * @return 合同信息
     */
    ContractDTO getContractInfo(String contractNo);
    
    /**
     * 获取用户可用合同列表
     * @param userId 用户ID
     * @return 合同列表
     */
    List<ContractDTO> getUserContracts(String userId);
}
