package com.carservice.repository;

import com.carservice.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备Repository接口
 */
@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    
    /**
     * 根据设备ID查找设备
     * @param equipmentId 设备ID
     * @return 设备对象
     */
    Equipment findByEquipmentId(String equipmentId);
    
    /**
     * 根据设备编号查找设备
     * @param equipmentNo 设备编号
     * @return 设备对象
     */
    Equipment findByEquipmentNo(String equipmentNo);
    
    /**
     * 根据设备名称查找设备列表
     * @param equipmentName 设备名称
     * @return 设备列表
     */
    List<Equipment> findByEquipmentNameContainingIgnoreCase(String equipmentName);
    
    /**
     * 根据设备类型查找设备列表
     * @param equipmentType 设备类型
     * @return 设备列表
     */
    List<Equipment> findByEquipmentType(String equipmentType);
    
    /**
     * 根据设备状态查找设备列表
     * @param status 设备状态
     * @return 设备列表
     */
    List<Equipment> findByStatus(Integer status);
    
    /**
     * 根据使用部门查找设备列表
     * @param departmentId 部门ID
     * @return 设备列表
     */
    List<Equipment> findByDepartmentId(String departmentId);
    
    /**
     * 根据生产厂家查找设备列表
     * @param manufacturer 生产厂家
     * @return 设备列表
     */
    List<Equipment> findByManufacturerContainingIgnoreCase(String manufacturer);
    
    /**
     * 根据存放地点查找设备列表
     * @param location 存放地点
     * @return 设备列表
     */
    List<Equipment> findByLocationContainingIgnoreCase(String location);
    
    /**
     * 查找需要保养的设备（下次保养日期在指定日期之前）
     * @param date 指定日期
     * @return 设备列表
     */
    List<Equipment> findByNextMaintenanceDateLessThanEqualAndStatus(LocalDateTime date, Integer status);
    
    /**
     * 根据部门和状态查找设备
     * @param departmentId 部门ID
     * @param status 设备状态
     * @return 设备列表
     */
    List<Equipment> findByDepartmentIdAndStatus(String departmentId, Integer status);
    
    /**
     * 查找所有可用设备
     * @return 可用设备列表
     */
    @Query("SELECT e FROM Equipment e WHERE e.status IN (0, 1) ORDER BY e.equipmentType, e.equipmentName")
    List<Equipment> findAllAvailableEquipment();
    
    /**
     * 统计指定状态的设备数量
     * @param status 设备状态
     * @return 设备数量
     */
    @Query("SELECT COUNT(e) FROM Equipment e WHERE e.status = :status")
    long countByStatus(@Param("status") Integer status);
    
    /**
     * 根据购置日期范围查找设备
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 设备列表
     */
    List<Equipment> findByPurchaseDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
