package com.carservice.repository;

import com.carservice.entity.EquipmentMaintenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备维护Repository接口
 */
@Repository
public interface EquipmentMaintenanceRepository extends JpaRepository<EquipmentMaintenance, Long> {
    
    /**
     * 根据设备ID查找维护记录列表
     * @param equipmentId 设备ID
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByEquipmentId(String equipmentId);
    
    /**
     * 根据维护类型查找维护记录列表
     * @param maintenanceType 维护类型
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByMaintenanceType(String maintenanceType);
    
    /**
     * 根据维护状态查找维护记录列表
     * @param status 维护状态
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByStatus(Integer status);
    
    /**
     * 根据维护人员查找维护记录列表
     * @param maintainerId 维护人员ID
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByMaintainerId(String maintainerId);
    
    /**
     * 根据计划维护时间范围查找维护记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByPlannedTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据实际维护时间范围查找维护记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByActualTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据设备ID和维护类型查找维护记录
     * @param equipmentId 设备ID
     * @param maintenanceType 维护类型
     * @return 维护记录列表
     */
    List<EquipmentMaintenance> findByEquipmentIdAndMaintenanceType(String equipmentId, String maintenanceType);
    
    /**
     * 查找待维护的记录
     * @return 待维护记录列表
     */
    @Query("SELECT em FROM EquipmentMaintenance em WHERE em.status = 0 ORDER BY em.plannedTime ASC")
    List<EquipmentMaintenance> findPendingMaintenance();
    
    /**
     * 查找超期未维护的记录
     * @param currentTime 当前时间
     * @return 超期维护记录列表
     */
    @Query("SELECT em FROM EquipmentMaintenance em WHERE em.plannedTime < :currentTime AND em.status = 0 ORDER BY em.plannedTime ASC")
    List<EquipmentMaintenance> findOverdueMaintenance(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * 根据设备ID查找最新的维护记录
     * @param equipmentId 设备ID
     * @return 最新维护记录
     */
    @Query("SELECT em FROM EquipmentMaintenance em WHERE em.equipmentId = :equipmentId ORDER BY em.actualTime DESC, em.plannedTime DESC LIMIT 1")
    EquipmentMaintenance findLatestByEquipmentId(@Param("equipmentId") String equipmentId);
    
    /**
     * 统计指定设备的维护次数
     * @param equipmentId 设备ID
     * @return 维护次数
     */
    @Query("SELECT COUNT(em) FROM EquipmentMaintenance em WHERE em.equipmentId = :equipmentId AND em.status = 1")
    long countCompletedMaintenanceByEquipmentId(@Param("equipmentId") String equipmentId);
}
