package com.carservice.repository;

import com.carservice.dto.VehicleDto;
import com.carservice.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 车辆Repository接口
 */
@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    /**
     * 根据车主ID查询车辆列表
     * 
     * @param ownerId 车主ID
     * @return 车辆列表
     */
    List<Vehicle> findByOwnerId(Long ownerId);
    
    /**
     * 根据车牌号查询车辆
     * 
     * @param vehicleNo 车牌号
     * @return 车辆信息
     */
    Vehicle findByVehicleNo(String vehicleNo);
    
    /**
     * 根据车架号查询车辆
     * 
     * @param vin 车架号
     * @return 车辆信息
     */
    Vehicle findByVin(String vin);
    
    /**
     * 根据状态查询车辆列表
     * 
     * @param status 状态
     * @return 车辆列表
     */
    List<Vehicle> findByStatus(Integer status);


    /**
     * 
     */
    Vehicle deleteByVehicleNo(String vehicleNo);

    Vehicle addVehicle(VehicleDto vehicleDto);
}