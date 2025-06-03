package com.carservice.repository;

import com.carservice.entity.MaintenanceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 维修保养项目Repository接口
 */
@Repository
public interface MaintenanceItemRepository extends JpaRepository<MaintenanceItem, Long> {
    
    /**
     * 根据维修保养ID查询项目列表
     * 
     * @param maintenanceId 维修保养ID
     * @return 项目列表
     */
    List<MaintenanceItem> findByMaintenanceNo(String maintenanceNo);
    
    /**
     * 根据维修保养ID删除项目
     * 
     * @param maintenanceId 维修保养ID
     */
    void deleteByMaintenanceNo(String maintenanceNo);


    Optional<MaintenanceItem> findByItemId(String itemId);

}