package com.carservice.service;

import com.carservice.entity.Maintenance;
import com.carservice.entity.MaintenanceItem;
import com.carservice.entity.WorkOrder;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 维修保养记录服务接口
 */
public interface MaintenanceService {
    
    /**
     * 保存维修保养记录
     * @param maintenance 维修保养记录信息
     * @return 保存的维修保养记录
     */
    Maintenance save(Maintenance maintenance);
    
    /**
     * 根据ID查找维修保养记录
     * @param id 维修保养记录ID
     * @return 维修保养记录信息
     */
    Optional<Maintenance> findByMaitenanceId(String maitenanceId);
    
    /**
     * 查找所有维修保养记录
     * @return 维修保养记录列表
     */
    List<Maintenance> findAll();
    
    /**
     * 删除维修保养记录
     * @param id 维修保养记录ID
     */
    void deleteByMaitenanceId(String maitenanceId);
    
    /**
     * 分页查询维修保养记录
     * @param pageable 分页参数
     * @param maintenance 查询条件
     * @return 分页结果
     */
    Page<Maintenance> pageList(Pageable pageable, Maintenance maintenance);
    
    /**
     * 获取车辆的维修保养记录
     * @param vehicleId 车辆ID
     * @return 维修保养记录列表
     */
    List<Maintenance> getMaintenancesByVehicleId(String vehicleId);
    
    /**
     * 获取用户的维修保养记录
     * @param userId 用户ID
     * @return 维修保养记录列表
     */
    List<Maintenance> getMaintenancesByUserId(String userId);
    
    /**
     * 创建维修保养记录
     * @param maintenance 维修保养记录信息
     * @param items 维修保养项目列表
     * @return 创建结果
     */
    boolean createMaintenance(Maintenance maintenance, List<MaintenanceItem> items);
    
    /**
     * 更新维修保养记录
     * @param maintenance 维修保养记录信息
     * @param items 维修保养项目列表
     * @return 更新结果
     */
    boolean updateMaintenance(Maintenance maintenance, List<MaintenanceItem> items);
    
    /**
     * 取消维修保养记录
     * @param id 维修保养记录ID
     * @return 取消结果
     */
    boolean cancelMaintenance(String maintenanceId);
    
    /**
     * 完成维修保养记录
     * @param id 维修保养记录ID
     * @return 完成结果
     */
    boolean completeMaintenance(String maintenanceId);
    
    /**
     * 获取维修保养记录详情，包括维修保养项目
     * @param id 维修保养记录ID
     * @return 维修保养记录详情
     */
    Maintenance getMaintenanceDetail(String maitenanceId);

    /**
     * 根据维修单号获取维修保养记录
     * @param maintenanceNo 维修单号
     * @return 维修保养记录信息
     */
    Maintenance getMaintenanceByNo(String maintenanceNo);

    /**
     * 根据维修单号更新维修保养记录
     * @param maintenanceNo 维修单号
     * @param maintenanceDto 维修保养记录数据传输对象
     * @param username 操作用户名
     * @return 更新后的维修保养记录
     */
    Maintenance updateMaintenanceByNo(String maintenanceNo, com.carservice.dto.MaintenanceDto maintenanceDto, String username);

    /**
     * 根据维修单号取消维修保养记录
     * @param maintenanceNo 维修单号
     * @return 取消后的维修保养记录
     */
    Maintenance cancelMaintenanceByNo(String maintenanceNo);

    /**
     * 根据维修单号完成维修保养记录
     * @param maintenanceNo 维修单号
     * @return 完成后的维修保养记录
     */
    Maintenance completeMaintenanceByNo(String maintenanceNo);

    /**
     * 获取所有维修保养记录（带分页）
     * @param pageable 分页参数
     * @return 分页结果
     */
    Page<Maintenance> getAllMaintenances(Pageable pageable);

    /**
     * 根据维修单号创建维修保养记录
     * @param maintenanceDto 维修保养记录数据传输对象
     * @param username 操作用户名
     * @return 创建后的维修保养记录
     */
    Maintenance createMaintenance(com.carservice.dto.MaintenanceDto maintenanceDto, String username);

    /**
     * 获取当前用户的维修保养记录
     * @param username 用户名
     * @return 维修保养记录列表
     */
    List<Maintenance> getCurrentUserMaintenances(String username);

    Optional<WorkOrder> findByOrderId(String orderId);
}