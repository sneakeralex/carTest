package com.carservice.repository;

import com.carservice.entity.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * 工单数据访问接口
 */
@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    
    Optional<WorkOrder> findByOrderNo(String orderNo);
    /**
     * 根据维修保养ID查询工单
     * @param maintenanceId 维修保养ID
     * @return 工单对象
     */
    Optional<WorkOrder> findByMaintenanceId(String maintenanceId);
    
    /**
     * 根据技师ID查询工单列表
     * @param technicianId 技师ID
     * @return 工单列表
     */
    List<WorkOrder> findByTechnicianIdOrderByCreateTimeDesc(String technicianId);
}