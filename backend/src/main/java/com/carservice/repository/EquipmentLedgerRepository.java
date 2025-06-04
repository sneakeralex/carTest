package com.carservice.repository;

import com.carservice.entity.EquipmentLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备台账Repository接口
 */
@Repository
public interface EquipmentLedgerRepository extends JpaRepository<EquipmentLedger, Long> {
    
    /**
     * 根据设备ID查找台账记录列表
     * @param equipmentId 设备ID
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByEquipmentId(String equipmentId);
    
    /**
     * 根据操作类型查找台账记录列表
     * @param operationType 操作类型
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByOperationType(String operationType);
    
    /**
     * 根据操作人查找台账记录列表
     * @param operatorId 操作人ID
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByOperatorId(String operatorId);
    
    /**
     * 根据操作时间范围查找台账记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByOperationTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据设备ID和操作类型查找台账记录
     * @param equipmentId 设备ID
     * @param operationType 操作类型
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByEquipmentIdAndOperationType(String equipmentId, String operationType);
    
    /**
     * 根据设备ID查找最新的台账记录
     * @param equipmentId 设备ID
     * @return 最新台账记录
     */
    @Query("SELECT el FROM EquipmentLedger el WHERE el.equipmentId = :equipmentId ORDER BY el.operationTime DESC LIMIT 1")
    EquipmentLedger findLatestByEquipmentId(@Param("equipmentId") String equipmentId);
    
    /**
     * 统计指定设备的操作次数
     * @param equipmentId 设备ID
     * @return 操作次数
     */
    @Query("SELECT COUNT(el) FROM EquipmentLedger el WHERE el.equipmentId = :equipmentId")
    long countOperationsByEquipmentId(@Param("equipmentId") String equipmentId);
    
    /**
     * 根据设备ID和时间范围查找台账记录
     * @param equipmentId 设备ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 台账记录列表
     */
    List<EquipmentLedger> findByEquipmentIdAndOperationTimeBetween(String equipmentId, LocalDateTime startTime, LocalDateTime endTime);
}
