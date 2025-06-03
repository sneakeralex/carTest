package com.carservice.service.impl;

import com.carservice.common.exception.BusinessException;
import com.carservice.common.api.ResultCode;
import com.carservice.entity.Maintenance;
import com.carservice.entity.MaintenanceItem;
import com.carservice.entity.Vehicle;
import com.carservice.entity.WorkOrder;
import com.carservice.repository.MaintenanceRepository;
import com.carservice.service.MaintenanceItemService;
import com.carservice.service.MaintenanceService;
import com.carservice.service.VehicleService;
import com.carservice.repository.UserRepository;
import com.carservice.repository.WorkOrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * 维修保养记录服务实现类
 */
@Service
public class MaintenanceServiceImpl implements MaintenanceService {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private MaintenanceItemService maintenanceItemService;

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Override
    public Maintenance save(Maintenance maintenance) {
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public List<Maintenance> findAll() {
        return maintenanceRepository.findAll();
    }

    @Override
    public Page<Maintenance> pageList(Pageable pageable, Maintenance maintenance) {
        // 创建匹配器，即如何使用查询条件
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING) // 改为模糊查询
                .withIgnoreCase(true); // 忽略大小写

        // 创建实例
        Example<Maintenance> example = Example.of(maintenance, matcher);

        // 分页查询
        return maintenanceRepository.findAll(example, pageable);
    }

    @Override
    public List<Maintenance> getMaintenancesByVehicleId(String vehicleId) {
        return maintenanceRepository.findByVehicleId(vehicleId);
    }

    @Override
    public List<Maintenance> getMaintenancesByUserId(String userId) {
        return maintenanceRepository.findByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean createMaintenance(Maintenance maintenance, List<MaintenanceItem> items) {
        // 检查车辆是否存在
        Optional<Vehicle> vehicleOpt = vehicleService.getByVehicleId(maintenance.getVehicleNo());
        if (!vehicleOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆不存在");
        }

        // 生成维修保养编号：M + 时间戳
        maintenance.setMaintenanceNo("M" + System.currentTimeMillis());

        // 设置默认值
        maintenance.setStatus(0); // 默认待处理状态

        // 保存维修保养记录
        Maintenance savedMaintenance = maintenanceRepository.save(maintenance);

        // 保存维修保养项目
        if (savedMaintenance != null && items != null && !items.isEmpty()) {
            maintenanceItemService.batchSaveItems(savedMaintenance.getMaintenanceNo(), items);

            // 计算总费用
            BigDecimal totalCost = items.stream()
                    .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // 更新总费用
            savedMaintenance.setCost(totalCost);
            maintenanceRepository.save(savedMaintenance);
        }

        return savedMaintenance != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateMaintenance(Maintenance maintenance, List<MaintenanceItem> items) {
        // 检查维修保养记录是否存在
        Optional<Maintenance> existMaintenanceOpt = maintenanceRepository.findById(maintenance.getId());
        if (!existMaintenanceOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "维修保养记录不存在");
        }

        Maintenance existMaintenance = existMaintenanceOpt.get();

        // 检查状态是否允许修改
        if (existMaintenance.getStatus() != 0) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有待处理状态的记录才能修改");
        }

        // 更新维修保养记录
        Maintenance updatedMaintenance = maintenanceRepository.save(maintenance);

        // 更新维修保养项目
        if (updatedMaintenance != null && items != null) {
            // 先删除原有项目
            maintenanceItemService.deleteByMaintenanceNo(maintenance.getMaintenanceNo());

            // 保存新项目
            if (!items.isEmpty()) {
                maintenanceItemService.batchSaveItems(maintenance.getMaintenanceNo(), items);

                // 计算总费用
                BigDecimal totalCost = items.stream()
                        .map(item -> item.getUnitPrice().multiply(new BigDecimal(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                // 更新总费用
                updatedMaintenance.setCost(totalCost);
                maintenanceRepository.save(updatedMaintenance);
            }
        }

        return updatedMaintenance != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean cancelMaintenance(String maintenanceNo) {
        // 检查维修保养记录是否存在
        Maintenance maintenance = maintenanceRepository.findByMaintenanceNo(maintenanceNo)
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "维修保养记录不存在"));

        // 检查状态是否允许取消
        if (maintenance.getStatus() != 0) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有待处理状态的记录才能取消");
        }

        // 更新状态为已取消
        maintenance.setStatus(3); // 已取消

        Maintenance updatedMaintenance = maintenanceRepository.save(maintenance);
        return updatedMaintenance != null;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean completeMaintenance(String maitenanceNo) {
        // 检查维修保养记录是否存在
        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findByMaintenanceNo(maitenanceNo);
        if (!maintenanceOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "维修保养记录不存在");
        }

        Maintenance maintenance = maintenanceOpt.get();

        // 检查状态是否允许完成
        if (maintenance.getStatus() != 1) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有处理中状态的记录才能完成");
        }

        // 更新状态为已完成
        maintenance.setStatus(2); // 已完成

        Maintenance updatedMaintenance = maintenanceRepository.save(maintenance);
        return updatedMaintenance != null;
    }

    @Override
    public Maintenance getMaintenanceDetail(String maintenanceNo) {
        // 获取维修保养记录
        Optional<Maintenance> maintenanceOpt = maintenanceRepository.findByMaintenanceNo(maintenanceNo);
        if (!maintenanceOpt.isPresent()) {
            return null;
        }

        Maintenance maintenance = maintenanceOpt.get();

        // 获取维修保养项目
        List<MaintenanceItem> items = maintenanceItemService.getItemsByMaintenanceNo(maintenanceNo);
        maintenance.setItems(items);

        return maintenance;
    }

    @Override
    public Page<Maintenance> getAllMaintenances(Pageable pageable) {
        return maintenanceRepository.findAll(pageable);
    }

    @Override
    public Maintenance getMaintenanceByNo(String maintenanceNo) {
        Maintenance maintenance = maintenanceRepository.findByMaintenanceNo(maintenanceNo)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        return maintenance;
    }

    @Override
    public Maintenance updateMaintenanceByNo(String maintenanceNo, com.carservice.dto.MaintenanceDto maintenanceDto,
            String username) {
        Maintenance maintenance = maintenanceRepository.findByMaintenanceNo(maintenanceNo)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public Maintenance cancelMaintenanceByNo(String maintenanceNo) {
        Maintenance maintenance = maintenanceRepository.findByMaintenanceNo(maintenanceNo)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        maintenance.setStatus(3); // 已取消
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public Maintenance completeMaintenanceByNo(String maintenanceNo) {
        Maintenance maintenance = maintenanceRepository.findByMaintenanceNo(maintenanceNo)
                .orElseThrow(() -> new RuntimeException("记录不存在"));
        maintenance.setStatus(2); // 已完成
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public Maintenance createMaintenance(com.carservice.dto.MaintenanceDto maintenanceDto, String username) {
        Maintenance maintenance = new Maintenance();
        // ...根据dto和username填充字段...
        maintenance.setMaintenanceNo("M" + System.currentTimeMillis());
        return maintenanceRepository.save(maintenance);
    }

    @Override
    public List<Maintenance> getCurrentUserMaintenances(String username) {
        com.carservice.entity.User user = userRepository.findByUsername(username);
        if (user == null) return List.of();
        return maintenanceRepository.findByUserId(String.valueOf(user.getId()));
    }

    @Override
    public Optional<Maintenance> findByMaitenanceId(String maitenanceId) {
        return maintenanceRepository.findByMaintenanceNo(maitenanceId);
    }

    @Override
    public void deleteByMaitenanceId(String maitenanceId) {
        maintenanceRepository.findByMaintenanceNo(maitenanceId).ifPresent(maintenanceRepository::delete);
    }

    @Override
    public Optional<WorkOrder> findByOrderId(String orderId) {
        return workOrderRepository.findByOrderNo(orderId);
    }
}