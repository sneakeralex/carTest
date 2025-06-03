package com.carservice.repository;

import com.carservice.entity.Maintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * 维修保养Repository接口
 */
@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
    
    /**
     * 根据用户ID查找维修保养记录
     * @param userId 用户ID
     * @return 维修保养记录列表
     */
    List<Maintenance> findByUserId(String userId);
    
    /**
     * 根据车辆ID查找维修保养记录
     * @param vehicleId 车辆ID
     * @return 维修保养记录列表
     */
    List<Maintenance> findByVehicleId(String vehicleId);
    
    /**
     * 根据维修保养编号查找维修保养记录
     * @param maintenanceNo 维修保养编号
     * @return 维修保养记录
     */
    Optional<Maintenance> findByMaintenanceNo(String maintenanceNo);
    
    /**
     * 根据状态查找维修保养记录
     * @param status 状态
     * @return 维修保养记录列表
     */
    List<Maintenance> findByStatus(Integer status);
    
    /**
     * 根据类型查找维修保养记录
     * @param type 类型：1保养，2维修
     * @return 维修保养记录列表
     */
    List<Maintenance> findByType(Integer type);
    
    /**
     * 根据开始时间范围查找维修保养记录
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 维修保养记录列表
     */
    List<Maintenance> findByStartTimeBetween(Date startDate, Date endDate);
    
    /**
     * 根据操作人ID查找维修保养记录
     * @param operatorId 操作人ID
     * @return 维修保养记录列表
     */
    List<Maintenance> findByOperatorId(Long operatorId);
}