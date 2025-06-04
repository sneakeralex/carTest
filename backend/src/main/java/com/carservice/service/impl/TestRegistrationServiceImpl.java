package com.carservice.service.impl;

import com.carservice.dto.test.*;
import com.carservice.entity.*;
import com.carservice.repository.*;
import com.carservice.service.TestRegistrationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 试验登记服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TestRegistrationServiceImpl implements TestRegistrationService {
    
    private final TestTaskRepository testTaskRepository;
    private final TestProjectRepository testProjectRepository;
    private final TaskVehicleRepository taskVehicleRepository;
    private final TestContentRepository testContentRepository;
    private final ContractRepository contractRepository;
    private final VehicleRepository vehicleRepository;
    
    @Override
    public TestTaskDTO createTestTask(TestTaskDTO testTaskDTO) {
        log.info("创建试验任务: {}", testTaskDTO.getTaskNo());
        
        TestTask testTask = new TestTask();
        // 映射字段
        testTask.setTaskNo(testTaskDTO.getTaskNo());
        testTask.setContractNo(testTaskDTO.getContractNo());
        testTask.setAuthorizerId(testTaskDTO.getAuthorizerId());
        testTask.setAuthorizationDate(testTaskDTO.getAuthorizationDate());
        testTask.setPlannedStartDate(testTaskDTO.getPlannedStartDate());
        testTask.setPlannedEndDate(testTaskDTO.getPlannedEndDate());
        testTask.setStatus(TestTask.TestTaskStatus.DRAFT);
        testTask.setDescription(testTaskDTO.getDescription());
        testTask.setRequirements(testTaskDTO.getRequirements());
        testTask.setNotes(testTaskDTO.getNotes());
        testTask.setCreatedTime(LocalDateTime.now());
        testTask.setUpdatedTime(LocalDateTime.now());
        
        testTask = testTaskRepository.save(testTask);
        
        return convertToTestTaskDTO(testTask);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TestTaskDTO> getTestTasks(String authorizerId, String status, Pageable pageable) {
        Page<TestTask> tasks;
        
        if (authorizerId != null && status != null) {
            TestTask.TestTaskStatus taskStatus = TestTask.TestTaskStatus.valueOf(status);
            tasks = testTaskRepository.findByAuthorizerIdAndStatus(authorizerId, taskStatus, pageable);
        } else if (authorizerId != null) {
            tasks = testTaskRepository.findByAuthorizerId(authorizerId, pageable);
        } else if (status != null) {
            TestTask.TestTaskStatus taskStatus = TestTask.TestTaskStatus.valueOf(status);
            tasks = testTaskRepository.findByStatus(taskStatus, pageable);
        } else {
            tasks = testTaskRepository.findAll(pageable);
        }
        
        return tasks.map(this::convertToTestTaskDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TestTaskDTO getTestTaskDetail(String taskId) {
        TestTask testTask = testTaskRepository.findByTaskId(taskId);
        if (testTask == null) {
            throw new RuntimeException("试验任务不存在");
        }
        
        TestTaskDTO dto = convertToTestTaskDTO(testTask);
        
        // 加载项目列表
        List<TestProject> projects = testProjectRepository.findByTestTaskId(taskId);
        dto.setProjects(projects.stream().map(this::convertToTestProjectDTO).collect(Collectors.toList()));
        
        // 加载合同信息
        if (testTask.getContractNo() != null) {
            Contract contract = contractRepository.findByContractNo(testTask.getContractNo());
            if (contract != null) {
                dto.setContractInfo(convertToContractDTO(contract));
            }
        }
        
        return dto;
    }
    
    @Override
    public TestTaskDTO updateTestTask(String taskId, TestTaskDTO testTaskDTO) {
        TestTask testTask = testTaskRepository.findByTaskId(taskId);
        if (testTask == null) {
            throw new RuntimeException("试验任务不存在");
        }
        
        // 更新字段
        testTask.setAuthorizerId(testTaskDTO.getAuthorizerId());
        testTask.setAuthorizationDate(testTaskDTO.getAuthorizationDate());
        testTask.setPlannedStartDate(testTaskDTO.getPlannedStartDate());
        testTask.setPlannedEndDate(testTaskDTO.getPlannedEndDate());
        testTask.setDescription(testTaskDTO.getDescription());
        testTask.setRequirements(testTaskDTO.getRequirements());
        testTask.setNotes(testTaskDTO.getNotes());
        testTask.setUpdatedTime(LocalDateTime.now());
        
        testTask = testTaskRepository.save(testTask);
        
        return convertToTestTaskDTO(testTask);
    }
    
    @Override
    public void deleteTestTask(String taskId) {
        TestTask testTask = testTaskRepository.findByTaskId(taskId);
        if (testTask == null) {
            throw new RuntimeException("试验任务不存在");
        }
        
        // 检查是否有关联的项目
        List<TestProject> projects = testProjectRepository.findByTestTaskId(taskId);
        if (!projects.isEmpty()) {
            throw new RuntimeException("存在关联的试验项目，无法删除");
        }
        
        testTaskRepository.delete(testTask);
        log.info("删除试验任务: {}", taskId);
    }
    
    @Override
    public TestProjectDTO addTestProject(String taskId, TestProjectDTO projectDTO) {
        TestTask testTask = testTaskRepository.findByTaskId(taskId);
        if (testTask == null) {
            throw new RuntimeException("试验任务不存在");
        }
        
        TestProject project = new TestProject();
        project.setProjectName(projectDTO.getProjectName());
        project.setProjectCode(projectDTO.getProjectCode());
        project.setTestTaskId(taskId);
        project.setStatus(TestProject.ProjectStatus.DRAFT);
        project.setDescription(projectDTO.getDescription());
        project.setRequirements(projectDTO.getRequirements());
        project.setTestStandard(projectDTO.getTestStandard());
        project.setExpectedResults(projectDTO.getExpectedResults());
        project.setNotes(projectDTO.getNotes());
        project.setCreatedTime(LocalDateTime.now());
        project.setUpdatedTime(LocalDateTime.now());
        
        project = testProjectRepository.save(project);
        
        return convertToTestProjectDTO(project);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TestProjectDTO> getTestProjects(String taskId) {
        List<TestProject> projects = testProjectRepository.findByTestTaskId(taskId);
        return projects.stream().map(this::convertToTestProjectDTO).collect(Collectors.toList());
    }
    
    @Override
    public TestProjectDTO updateTestProject(String projectId, TestProjectDTO projectDTO) {
        TestProject project = testProjectRepository.findByProjectId(projectId);
        if (project == null) {
            throw new RuntimeException("试验项目不存在");
        }
        
        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        project.setRequirements(projectDTO.getRequirements());
        project.setTestStandard(projectDTO.getTestStandard());
        project.setExpectedResults(projectDTO.getExpectedResults());
        project.setNotes(projectDTO.getNotes());
        project.setUpdatedTime(LocalDateTime.now());
        
        project = testProjectRepository.save(project);
        
        return convertToTestProjectDTO(project);
    }
    
    @Override
    public void deleteTestProject(String projectId) {
        TestProject project = testProjectRepository.findByProjectId(projectId);
        if (project == null) {
            throw new RuntimeException("试验项目不存在");
        }
        
        // 检查是否有关联的车辆
        List<TaskVehicle> vehicles = taskVehicleRepository.findByProjectId(projectId);
        if (!vehicles.isEmpty()) {
            throw new RuntimeException("存在关联的任务车辆，无法删除");
        }
        
        testProjectRepository.delete(project);
        log.info("删除试验项目: {}", projectId);
    }
    
    @Override
    public TaskVehicleDTO addTaskVehicle(String projectId, TaskVehicleDTO vehicleDTO) {
        TestProject project = testProjectRepository.findByProjectId(projectId);
        if (project == null) {
            throw new RuntimeException("试验项目不存在");
        }
        
        TaskVehicle taskVehicle = new TaskVehicle();
        taskVehicle.setVehicleId(vehicleDTO.getVehicleId());
        taskVehicle.setStatus(TaskVehicle.VehicleTestStatus.PENDING);
        taskVehicle.setCreatedTime(LocalDateTime.now());
        taskVehicle.setUpdatedTime(LocalDateTime.now());
        
        taskVehicle = taskVehicleRepository.save(taskVehicle);
        
        return convertToTaskVehicleDTO(taskVehicle);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TaskVehicleDTO> getTaskVehicles(String projectId) {
        List<TaskVehicle> vehicles = taskVehicleRepository.findByProjectId(projectId);
        return vehicles.stream().map(this::convertToTaskVehicleDTO).collect(Collectors.toList());
    }
    
    @Override
    public TaskVehicleDTO updateTaskVehicle(String taskVehicleId, TaskVehicleDTO vehicleDTO) {
        TaskVehicle taskVehicle = taskVehicleRepository.findByTaskVehicleId(taskVehicleId);
        if (taskVehicle == null) {
            throw new RuntimeException("任务车辆不存在");
        }
        
        taskVehicle.setUpdatedTime(LocalDateTime.now());
        taskVehicle = taskVehicleRepository.save(taskVehicle);
        
        return convertToTaskVehicleDTO(taskVehicle);
    }
    
    @Override
    public void deleteTaskVehicle(String taskVehicleId) {
        TaskVehicle taskVehicle = taskVehicleRepository.findByTaskVehicleId(taskVehicleId);
        if (taskVehicle == null) {
            throw new RuntimeException("任务车辆不存在");
        }
        
        taskVehicleRepository.delete(taskVehicle);
        log.info("删除任务车辆: {}", taskVehicleId);
    }
    
    @Override
    public TestContentDTO addTestContent(String taskVehicleId, TestContentDTO contentDTO) {
        TaskVehicle taskVehicle = taskVehicleRepository.findByTaskVehicleId(taskVehicleId);
        if (taskVehicle == null) {
            throw new RuntimeException("任务车辆不存在");
        }
        
        TestContent testContent = new TestContent();
        testContent.setTestItem(contentDTO.getTestItem());
        testContent.setTestMethod(contentDTO.getTestMethod());
        testContent.setTestStandard(contentDTO.getTestStandard());
        testContent.setDescription(contentDTO.getDescription());
        testContent.setPlannedStartTime(contentDTO.getPlannedStartTime());
        testContent.setPlannedEndTime(contentDTO.getPlannedEndTime());
        testContent.setStatus(TestContent.TestStatus.NOT_STARTED);
        testContent.setNotes(contentDTO.getNotes());
        testContent.setCreatedTime(LocalDateTime.now());
        testContent.setUpdatedTime(LocalDateTime.now());
        
        testContent = testContentRepository.save(testContent);
        
        return convertToTestContentDTO(testContent);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TestContentDTO> getTestContents(String taskVehicleId) {
        List<TestContent> contents = testContentRepository.findByTaskVehicleId(taskVehicleId);
        return contents.stream().map(this::convertToTestContentDTO).collect(Collectors.toList());
    }
    
    @Override
    public TestContentDTO updateTestContent(String contentId, TestContentDTO contentDTO) {
        TestContent testContent = testContentRepository.findByContentId(contentId);
        if (testContent == null) {
            throw new RuntimeException("试验内容不存在");
        }
        
        testContent.setTestItem(contentDTO.getTestItem());
        testContent.setTestMethod(contentDTO.getTestMethod());
        testContent.setTestStandard(contentDTO.getTestStandard());
        testContent.setDescription(contentDTO.getDescription());
        testContent.setPlannedStartTime(contentDTO.getPlannedStartTime());
        testContent.setPlannedEndTime(contentDTO.getPlannedEndTime());
        testContent.setTestResults(contentDTO.getTestResults());
        testContent.setConclusion(contentDTO.getConclusion());
        testContent.setNotes(contentDTO.getNotes());
        testContent.setUpdatedTime(LocalDateTime.now());
        
        testContent = testContentRepository.save(testContent);
        
        return convertToTestContentDTO(testContent);
    }
    
    @Override
    public void deleteTestContent(String contentId) {
        TestContent testContent = testContentRepository.findByContentId(contentId);
        if (testContent == null) {
            throw new RuntimeException("试验内容不存在");
        }
        
        testContentRepository.delete(testContent);
        log.info("删除试验内容: {}", contentId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public ContractDTO getContractInfo(String contractNo) {
        Contract contract = contractRepository.findByContractNo(contractNo);
        return contract != null ? convertToContractDTO(contract) : null;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ContractDTO> getUserContracts(String userId) {
        List<Contract> contracts = contractRepository.findByCustomerId(userId);
        return contracts.stream().map(this::convertToContractDTO).collect(Collectors.toList());
    }
    
    // 私有转换方法
    private TestTaskDTO convertToTestTaskDTO(TestTask testTask) {
        TestTaskDTO dto = new TestTaskDTO();
        dto.setTaskId(testTask.getTaskId());
        dto.setTaskNo(testTask.getTaskNo());
        dto.setContractNo(testTask.getContractNo());
        dto.setAuthorizerId(testTask.getAuthorizerId());
        dto.setAuthorizationDate(testTask.getAuthorizationDate());
        dto.setPlannedStartDate(testTask.getPlannedStartDate());
        dto.setPlannedEndDate(testTask.getPlannedEndDate());
        dto.setActualStartDate(testTask.getActualStartDate());
        dto.setActualEndDate(testTask.getActualEndDate());
        dto.setStatus(testTask.getStatus().name());
        dto.setStatusName(getTestTaskStatusName(testTask.getStatus()));
        dto.setDescription(testTask.getDescription());
        dto.setRequirements(testTask.getRequirements());
        dto.setNotes(testTask.getNotes());
        dto.setCreatedTime(testTask.getCreatedTime());
        dto.setUpdatedTime(testTask.getUpdatedTime());
        return dto;
    }
    
    private TestProjectDTO convertToTestProjectDTO(TestProject project) {
        TestProjectDTO dto = new TestProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setProjectCode(project.getProjectCode());
        dto.setTestTaskId(project.getTestTaskId());
        dto.setStatus(project.getStatus().name());
        dto.setStatusName(getProjectStatusName(project.getStatus()));
        dto.setDescription(project.getDescription());
        dto.setRequirements(project.getRequirements());
        dto.setTestStandard(project.getTestStandard());
        dto.setExpectedResults(project.getExpectedResults());
        dto.setNotes(project.getNotes());
        dto.setCreatedTime(project.getCreatedTime());
        dto.setUpdatedTime(project.getUpdatedTime());
        return dto;
    }
    
    private TaskVehicleDTO convertToTaskVehicleDTO(TaskVehicle taskVehicle) {
        TaskVehicleDTO dto = new TaskVehicleDTO();
        dto.setTaskVehicleId(taskVehicle.getTaskVehicleId());
        dto.setVehicleId(taskVehicle.getVehicleId());
        dto.setStatus(taskVehicle.getStatus().name());
        dto.setStatusName(getVehicleTestStatusName(taskVehicle.getStatus()));
        dto.setCreatedTime(taskVehicle.getCreatedTime());
        dto.setUpdatedTime(taskVehicle.getUpdatedTime());
        
        // 加载车辆信息
        if (taskVehicle.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByVehicleId(taskVehicle.getVehicleId());
            if (vehicle != null) {
                dto.setVehicleInfo(convertToVehicleDTO(vehicle));
            }
        }
        
        return dto;
    }
    
    private TestContentDTO convertToTestContentDTO(TestContent testContent) {
        TestContentDTO dto = new TestContentDTO();
        dto.setContentId(testContent.getContentId());
        dto.setTestItem(testContent.getTestItem());
        dto.setTestMethod(testContent.getTestMethod());
        dto.setTestStandard(testContent.getTestStandard());
        dto.setDescription(testContent.getDescription());
        dto.setPlannedStartTime(testContent.getPlannedStartTime());
        dto.setPlannedEndTime(testContent.getPlannedEndTime());
        dto.setActualStartTime(testContent.getActualStartTime());
        dto.setActualEndTime(testContent.getActualEndTime());
        dto.setStatus(testContent.getStatus().name());
        dto.setStatusName(getTestStatusName(testContent.getStatus()));
        dto.setTestResults(testContent.getTestResults());
        dto.setConclusion(testContent.getConclusion());
        dto.setNotes(testContent.getNotes());
        dto.setCreatedTime(testContent.getCreatedTime());
        dto.setUpdatedTime(testContent.getUpdatedTime());
        return dto;
    }
    
    private VehicleDTO convertToVehicleDTO(Vehicle vehicle) {
        VehicleDTO dto = new VehicleDTO();
        dto.setVehicleId(vehicle.getVehicleId());
        dto.setPlateNo(vehicle.getPlateNo());
        dto.setBrand(vehicle.getBrand());
        dto.setModel(vehicle.getModel());
        dto.setVehicleType(vehicle.getVehicleType());
        dto.setFuelType(vehicle.getFuelType());
        dto.setEngineNo(vehicle.getEngineNo());
        dto.setVinNo(vehicle.getVinNo());
        dto.setColor(vehicle.getColor());
        dto.setManufactureYear(vehicle.getManufactureYear());
        dto.setOwnerName(vehicle.getOwnerName());
        dto.setOwnerPhone(vehicle.getOwnerPhone());
        dto.setOwnerIdCard(vehicle.getOwnerIdCard());
        dto.setRegistrationDate(vehicle.getRegistrationDate());
        dto.setInsuranceInfo(vehicle.getInsuranceInfo());
        dto.setTechnicalSpecs(vehicle.getTechnicalSpecs());
        dto.setNotes(vehicle.getNotes());
        dto.setCreatedTime(vehicle.getCreatedTime());
        dto.setUpdatedTime(vehicle.getUpdatedTime());
        return dto;
    }
    
    private ContractDTO convertToContractDTO(Contract contract) {
        ContractDTO dto = new ContractDTO();
        dto.setContractNo(contract.getContractNo());
        dto.setContractName(contract.getContractName());
        dto.setCustomerId(contract.getCustomerId());
        dto.setTotalAmount(contract.getTotalAmount());
        dto.setPaidAmount(contract.getPaidAmount());
        dto.setCurrency(contract.getCurrency());
        dto.setSignTime(contract.getSignTime());
        dto.setEffectiveTime(contract.getEffectiveTime());
        dto.setExpiryTime(contract.getExpiryTime());
        dto.setStatus(contract.getStatus());
        dto.setStatusName(getContractStatusName(contract.getStatus()));
        dto.setDescription(contract.getDescription());
        dto.setTerms(contract.getTerms());
        dto.setNotes(contract.getNotes());
        dto.setCreatedTime(contract.getCreatedTime());
        dto.setUpdatedTime(contract.getUpdatedTime());
        return dto;
    }
    
    // 状态名称转换方法
    private String getTestTaskStatusName(TestTask.TestTaskStatus status) {
        switch (status) {
            case DRAFT: return "草稿";
            case PENDING: return "待审核";
            case APPROVED: return "已批准";
            case IN_PROGRESS: return "进行中";
            case COMPLETED: return "已完成";
            case CANCELLED: return "已取消";
            default: return "未知";
        }
    }
    
    private String getProjectStatusName(TestProject.ProjectStatus status) {
        switch (status) {
            case DRAFT: return "草稿";
            case ACTIVE: return "进行中";
            case COMPLETED: return "已完成";
            case CANCELLED: return "已取消";
            default: return "未知";
        }
    }
    
    private String getVehicleTestStatusName(TaskVehicle.VehicleTestStatus status) {
        switch (status) {
            case PENDING: return "待测试";
            case TESTING: return "测试中";
            case COMPLETED: return "已完成";
            case FAILED: return "测试失败";
            default: return "未知";
        }
    }
    
    private String getTestStatusName(TestContent.TestStatus status) {
        switch (status) {
            case NOT_STARTED: return "未开始";
            case IN_PROGRESS: return "进行中";
            case COMPLETED: return "已完成";
            case CANCELLED: return "已取消";
            default: return "未知";
        }
    }
    
    private String getContractStatusName(Integer status) {
        switch (status) {
            case 0: return "草稿";
            case 1: return "有效";
            case 2: return "已到期";
            case 3: return "已终止";
            default: return "未知";
        }
    }
}
