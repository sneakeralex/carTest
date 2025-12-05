package com.carservice.service;

import com.carservice.entity.Vehicle;
import com.carservice.dto.VehicleDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 车辆服务接口
 */
public interface VehicleService {
    
    /**
     * 保存车辆
     * @param vehicle 车辆信息
     * @return 保存后的车辆
     */
    Vehicle save(Vehicle vehicle);
    
    /**
     * 根据ID查询车辆
     * @param id 车辆ID
     * @return 车辆信息
     */
    Optional<Vehicle> getByVehicleId(String vehicleId);
    
    /**
     * 查询所有车辆
     * @return 车辆列表
     */
    List<Vehicle> findAll();
    
    /**
     * 根据ID删除车辆
     * @param id 车辆ID
     */
    void deleteByVehicleId(String vehicleId);
    
    /**
     * 分页查询车辆列表
     * @param pageable 分页参数
     * @param vehicle 查询条件
     * @return 分页结果
     */
    Page<Vehicle> pageList(Pageable pageable, Vehicle vehicle);
    
    /**
     * 获取用户的车辆列表
     * @param userId 用户ID
     * @return 车辆列表
     */
    List<Vehicle> getVehiclesByUserId(Long userId);
    
    /**
     * 更新车辆信息
     * @param vehicle 车辆信息
     * @return 更新结果
     */
    Optional<Vehicle> updateVehicle(String vehicleId, VehicleDto vehicleDto);

    /**
     * 获取所有车辆（带分页）
     * @param pageable 分页参数
     * @return 车辆分页信息
     */
    Page<Vehicle> getAllVehicles(Pageable pageable);

    /**
     * 获取当前用户的车辆列表
     * @param username 用户名
     * @return 车辆列表
     */
    List<Vehicle> getCurrentUserVehicles(String username);

    /**
     * 添加车辆
     * @param vehicleDto 车辆信息
     * @param username 用户名
     * @return 添加后的车辆
     */
    Vehicle addVehicle(VehicleDto vehicleDto, String username);
}