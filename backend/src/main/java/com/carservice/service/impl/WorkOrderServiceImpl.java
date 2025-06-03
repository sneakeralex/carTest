package com.carservice.service.impl;

import com.carservice.common.exception.BusinessException;
import com.carservice.dto.WorkOrderDto;
import com.carservice.common.api.ResultCode;
import com.carservice.entity.Maintenance;
import com.carservice.entity.WorkOrder;
import com.carservice.repository.WorkOrderRepository;
import com.carservice.service.MaintenanceService;
import com.carservice.service.WorkOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 工单服务实现类
 */
@Service
public class WorkOrderServiceImpl implements WorkOrderService {

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private MaintenanceService maintenanceService;

    @Override
    public Page<WorkOrder> pageList(Pageable pageable) {
        // Specification<WorkOrder> specification = (root, query, criteriaBuilder) -> {
        // List<Predicate> predicates = new ArrayList<>();

        // // 添加查询条件
        // if (workOrder != null) {
        // if (StringUtils.hasText(workOrder.getOrderNo())) {
        // predicates.add(criteriaBuilder.like(root.get("orderNo"), "%" +
        // workOrder.getOrderNo() + "%"));
        // }
        // if (workOrder.getMaintenanceId() != null) {
        // predicates.add(criteriaBuilder.equal(root.get("maintenanceId"),
        // workOrder.getMaintenanceId()));
        // }
        // if (workOrder.getVehicleId() != null) {
        // predicates.add(criteriaBuilder.equal(root.get("vehicleId"),
        // workOrder.getVehicleId()));
        // }
        // if (workOrder.getTechnicianId() != null) {
        // predicates.add(criteriaBuilder.equal(root.get("technicianId"),
        // workOrder.getTechnicianId()));
        // }
        // if (workOrder.getStatus() != null) {
        // predicates.add(criteriaBuilder.equal(root.get("status"),
        // workOrder.getStatus()));
        // }
        // }

        // return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        // };

        return workOrderRepository.findAll(pageable);
    }

    @Override
    public Optional<WorkOrder> getByMaintenanceId(String maintenanceId) {
        return workOrderRepository.findByMaintenanceId(maintenanceId);
    }

    @Override
    public List<WorkOrder> getWorkOrdersByTechnicianId(String technicianId) {
        return workOrderRepository.findByTechnicianIdOrderByCreateTimeDesc(technicianId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WorkOrder createWorkOrder(WorkOrderDto workOrderDto) { // 修改参数类型和返回类型
        // 检查维修保养记录是否存在
        Maintenance maintenance = maintenanceService.findByMaitenanceId(workOrderDto.getMaintenanceId())
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "维修保养记录不存在"));

        // 检查是否已经存在工单
        getByMaintenanceId(workOrderDto.getMaintenanceId())
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "该维修保养记录已存在工单"));
        WorkOrder workOrder = new WorkOrder();
        workOrder.setMaintenanceId(workOrderDto.getMaintenanceId());
        // 如果 WorkOrderDto 中有 description，则设置
        if (workOrderDto.getDescription() != null && !workOrderDto.getDescription().isEmpty()) {
            workOrder.setDescription(workOrderDto.getDescription());
        }

        // 生成工单编号：WO + 时间戳
        workOrder.setOrderNo("WO" + System.currentTimeMillis());

        // 设置默认值
        workOrder.setVehicleNo(maintenance.getVehicleNo());
        workOrder.setStatus(0); // 默认待分配状态

        // 保存工单
        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        // 更新维修保养记录状态为处理中
        maintenance.setStatus(1); // 处理中
        maintenanceService.save(maintenance);
        return savedWorkOrder;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Optional<WorkOrder> assignTechnician(String orderNo, String technicianId) { // 修改返回类型
        // 检查工单是否存在
        WorkOrder workOrder = workOrderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "工单不存在"));

        // 检查状态是否允许分配
        if (workOrder.getStatus() != 0) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有待分配状态的工单才能分配技师");
        }

        // 更新技师和状态
        workOrder.setTechnicianId(technicianId);
        workOrder.setStatus(1); // 已分配

        return Optional.of(workOrderRepository.save(workOrder));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Optional<WorkOrder> startWorkOrder(String orderNo) { // 修改返回类型
        // 检查工单是否存在
        WorkOrder workOrder = workOrderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "工单不存在"));

        // 检查状态是否允许开始
        if (workOrder.getStatus() != 1) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有已分配状态的工单才能开始处理");
        }

        // 更新状态为处理中
        workOrder.setStatus(2); // 处理中

        return Optional.of(workOrderRepository.save(workOrder));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Optional<WorkOrder> completeWorkOrder(String orderNo) { // 修改返回类型
        // 检查工单是否存在
        WorkOrder workOrder = workOrderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "工单不存在"));

        // 检查状态是否允许完成
        if (workOrder.getStatus() != 2) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有处理中状态的工单才能完成");
        }

        // 更新状态为已完成
        workOrder.setStatus(3); // 已完成
        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        // 更新维修保养记录状态为已完成
        maintenanceService.completeMaintenance(workOrder.getMaintenanceId());
        return Optional.of(savedWorkOrder);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Optional<WorkOrder> cancelWorkOrder(String orderNo) { // 修改返回类型
        // 检查工单是否存在
        WorkOrder workOrder = workOrderRepository.findByOrderNo(orderNo)
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "工单不存在"));

        // 检查状态是否允许取消
        if (workOrder.getStatus() == 3 || workOrder.getStatus() == 4) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "已完成或已取消的工单不能取消");
        }

        // 更新状态为已取消
        workOrder.setStatus(4); // 已取消
        WorkOrder savedWorkOrder = workOrderRepository.save(workOrder);

        // 如果有关联的维修保养记录，且维修保养记录状态为处理中，则将其状态改回待处理
        Maintenance maintenance = maintenanceService.findByMaitenanceId(workOrder.getMaintenanceId()).orElse(null);
        if (maintenance != null && maintenance.getStatus() == 1) {
            maintenance.setStatus(0); // 待处理
            maintenanceService.save(maintenance);
        }
        return Optional.of(savedWorkOrder);
    }

    // Helper method to find Maintenance by ID, throwing exception if not found.
    // This replaces the direct Optional check in createWorkOrder.
    // private Maintenance findMaintenanceOrThrow(String maintenanceId) {
    //     return maintenanceService.findByMaitenanceId(maintenanceId)
    //             .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "维修保养记录不存在"));
    // }

    @Override
    public WorkOrder save(WorkOrder workOrder) {
        return workOrderRepository.save(workOrder);
    }

    @Override
    public List<WorkOrder> findAll() {
        return workOrderRepository.findAll();
    }

    @Override
    public Optional<WorkOrder> getByOrderNo(String orderNo) {
        return workOrderRepository.findByOrderNo(orderNo);
    }
}