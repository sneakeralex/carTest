package com.carservice.service;

import com.carservice.dto.equipment.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备管理服务接口
 */
public interface EquipmentService {
    
    /**
     * 获取设备列表
     * @param equipmentType 设备类型
     * @param status 设备状态
     * @param departmentId 部门ID
     * @param pageable 分页信息
     * @return 设备列表
     */
    Page<EquipmentDTO> getEquipments(String equipmentType, Integer status, String departmentId, Pageable pageable);
    
    /**
     * 获取设备详情
     * @param equipmentId 设备ID
     * @return 设备详情
     */
    EquipmentDTO getEquipmentDetail(String equipmentId);
    
    /**
     * 搜索设备
     * @param keyword 关键词
     * @param pageable 分页信息
     * @return 设备列表
     */
    Page<EquipmentDTO> searchEquipments(String keyword, Pageable pageable);
    
    /**
     * 创建设备申请
     * @param requestDTO 申请信息
     * @return 申请详情
     */
    EquipmentRequestDTO createEquipmentRequest(EquipmentRequestDTO requestDTO);
    
    /**
     * 获取用户设备申请列表
     * @param userId 用户ID
     * @param status 申请状态
     * @param pageable 分页信息
     * @return 申请列表
     */
    Page<EquipmentRequestDTO> getUserEquipmentRequests(String userId, Integer status, Pageable pageable);
    
    /**
     * 获取设备申请详情
     * @param requestId 申请ID
     * @return 申请详情
     */
    EquipmentRequestDTO getEquipmentRequestDetail(String requestId);
    
    /**
     * 更新设备申请
     * @param requestId 申请ID
     * @param requestDTO 申请信息
     * @return 更新后的申请详情
     */
    EquipmentRequestDTO updateEquipmentRequest(String requestId, EquipmentRequestDTO requestDTO);
    
    /**
     * 取消设备申请
     * @param requestId 申请ID
     * @param reason 取消原因
     */
    void cancelEquipmentRequest(String requestId, String reason);
    
    /**
     * 审批设备申请
     * @param requestId 申请ID
     * @param approved 是否批准
     * @param comments 审批意见
     * @param approverId 审批人ID
     */
    void approveEquipmentRequest(String requestId, Boolean approved, String comments, String approverId);
    
    /**
     * 获取设备维护记录
     * @param equipmentId 设备ID
     * @param pageable 分页信息
     * @return 维护记录列表
     */
    Page<EquipmentMaintenanceDTO> getEquipmentMaintenanceRecords(String equipmentId, Pageable pageable);
    
    /**
     * 创建维护记录
     * @param maintenanceDTO 维护信息
     * @return 维护记录
     */
    EquipmentMaintenanceDTO createMaintenanceRecord(EquipmentMaintenanceDTO maintenanceDTO);
    
    /**
     * 获取即将到期的维护设备
     * @param days 天数
     * @return 设备列表
     */
    List<EquipmentDTO> getUpcomingMaintenanceEquipments(Integer days);
    
    /**
     * 获取超期未维护的设备
     * @return 设备列表
     */
    List<EquipmentDTO> getOverdueMaintenanceEquipments();
    
    /**
     * 获取设备使用统计
     * @param equipmentId 设备ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 使用统计信息
     */
    Object getEquipmentUsageStatistics(String equipmentId, LocalDateTime startTime, LocalDateTime endTime);
}
