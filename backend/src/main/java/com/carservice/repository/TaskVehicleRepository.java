package com.carservice.repository;

import com.carservice.entity.TaskVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 任务车辆Repository接口
 */
@Repository
public interface TaskVehicleRepository extends JpaRepository<TaskVehicle, Long> {
    
    /**
     * 根据任务车辆ID查找记录
     * @param taskVehicleId 任务车辆ID
     * @return 任务车辆对象
     */
    TaskVehicle findByTaskVehicleId(String taskVehicleId);
    
    /**
     * 根据车辆ID查找任务车辆列表
     * @param vehicleId 车辆ID
     * @return 任务车辆列表
     */
    List<TaskVehicle> findByVehicleId(String vehicleId);
    
    /**
     * 根据车辆试验状态查找任务车辆列表
     * @param status 车辆试验状态
     * @return 任务车辆列表
     */
    List<TaskVehicle> findByStatus(TaskVehicle.VehicleTestStatus status);
    
    /**
     * 查找待测试的任务车辆
     * @return 待测试任务车辆列表
     */
    @Query("SELECT tv FROM TaskVehicle tv WHERE tv.status = 'PENDING' ORDER BY tv.createdTime ASC")
    List<TaskVehicle> findPendingTaskVehicles();
    
    /**
     * 查找测试中的任务车辆
     * @return 测试中任务车辆列表
     */
    @Query("SELECT tv FROM TaskVehicle tv WHERE tv.status = 'TESTING' ORDER BY tv.createdTime ASC")
    List<TaskVehicle> findTestingTaskVehicles();
    
    /**
     * 统计指定状态的任务车辆数量
     * @param status 车辆试验状态
     * @return 任务车辆数量
     */
    @Query("SELECT COUNT(tv) FROM TaskVehicle tv WHERE tv.status = :status")
    long countByStatus(@Param("status") TaskVehicle.VehicleTestStatus status);
    
    /**
     * 根据车辆ID和状态查找任务车辆
     * @param vehicleId 车辆ID
     * @param status 车辆试验状态
     * @return 任务车辆列表
     */
    List<TaskVehicle> findByVehicleIdAndStatus(String vehicleId, TaskVehicle.VehicleTestStatus status);
}
