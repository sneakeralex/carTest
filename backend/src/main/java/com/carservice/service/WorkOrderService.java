package com.carservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.carservice.dto.WorkOrderDto;
import com.carservice.entity.WorkOrder;

import java.util.List;
import java.util.Optional;

/**
 * 工单服务接口
 */
public interface WorkOrderService {

    Optional<WorkOrder> getByOrderNo(String orderNo);
    
    /**
     * 保存工单
     * @param workOrder 工单信息
     * @return 保存后的工单
     */
    WorkOrder save(WorkOrder workOrder);
    
    /**
     * 查询所有工单
     * @return 工单列表
     */
    List<WorkOrder> findAll();
    
    /**
     * 分页查询工单列表
     * @param pageable 分页参数
     * @param workOrder 查询条件
     * @return 分页结果
     */
    Page<WorkOrder> pageList(Pageable pageable);
    
    /**
     * 根据维修保养记录ID获取工单
     * @param maintenanceId 维修保养记录ID
     * @return 工单对象
     */
    Optional<WorkOrder> getByMaintenanceId(String maintenanceId);
    
    /**
     * 获取技师的工单列表
     * @param technicianId 技师ID
     * @return 工单列表
     */
    List<WorkOrder> getWorkOrdersByTechnicianId(String technicianId);
    
    /**
     * 创建工单
     * @param workOrderDto 工单数据传输对象
     * @return 创建后的工单
     */
    WorkOrder createWorkOrder(WorkOrderDto workOrderDto); // 修改参数类型和返回类型
    
    /**
     * 分配技师
     * @param id 工单ID
     * @param technicianId 技师ID
     * @return 分配后的工单
     */
    Optional<WorkOrder> assignTechnician(String workOrderNo, String technicianId); // 修改返回类型
    
    /**
     * 开始处理工单
     * @param id 工单ID
     * @return 开始处理后的工单
     */
    Optional<WorkOrder> startWorkOrder(String workOrderNo); // 修改返回类型
    
    /**
     * 完成工单
     * @param id 工单ID
     * @return 完成后的工单
     */
    Optional<WorkOrder> completeWorkOrder(String workOrderNo); // 修改返回类型
    
    /**
     * 取消工单
     * @param id 工单ID
     * @return 取消后的工单
     */
    Optional<WorkOrder> cancelWorkOrder(String workOrderNo); // 修改返回类型
}