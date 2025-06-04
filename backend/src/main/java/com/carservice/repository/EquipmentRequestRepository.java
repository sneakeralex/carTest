package com.carservice.repository;

import com.carservice.entity.EquipmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备申请Repository接口
 */
@Repository
public interface EquipmentRequestRepository extends JpaRepository<EquipmentRequest, Long> {
    
    /**
     * 根据设备ID查找申请记录列表
     * @param equipmentId 设备ID
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByEquipmentId(String equipmentId);
    
    /**
     * 根据申请人查找申请记录列表
     * @param requesterId 申请人ID
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByRequesterId(String requesterId);
    
    /**
     * 根据审批人查找申请记录列表
     * @param approverId 审批人ID
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByApproverId(String approverId);
    
    /**
     * 根据申请状态查找申请记录列表
     * @param status 申请状态
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByStatus(Integer status);
    
    /**
     * 根据申请类型查找申请记录列表
     * @param requestType 申请类型
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByRequestType(String requestType);
    
    /**
     * 根据申请时间范围查找申请记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByRequestTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据审批时间范围查找申请记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByApprovalTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据申请人和状态查找申请记录
     * @param requesterId 申请人ID
     * @param status 申请状态
     * @return 申请记录列表
     */
    List<EquipmentRequest> findByRequesterIdAndStatus(String requesterId, Integer status);
    
    /**
     * 查找待审批的申请记录
     * @return 待审批申请记录列表
     */
    @Query("SELECT er FROM EquipmentRequest er WHERE er.status = 0 ORDER BY er.requestTime ASC")
    List<EquipmentRequest> findPendingRequests();
    
    /**
     * 根据审批人查找待审批的申请记录
     * @param approverId 审批人ID
     * @return 待审批申请记录列表
     */
    @Query("SELECT er FROM EquipmentRequest er WHERE er.approverId = :approverId AND er.status = 0 ORDER BY er.requestTime ASC")
    List<EquipmentRequest> findPendingRequestsByApproverId(@Param("approverId") String approverId);
    
    /**
     * 统计指定状态的申请记录数量
     * @param status 申请状态
     * @return 申请记录数量
     */
    @Query("SELECT COUNT(er) FROM EquipmentRequest er WHERE er.status = :status")
    long countByStatus(@Param("status") Integer status);
    
    /**
     * 统计指定申请类型的记录数量
     * @param requestType 申请类型
     * @return 申请记录数量
     */
    @Query("SELECT COUNT(er) FROM EquipmentRequest er WHERE er.requestType = :requestType")
    long countByRequestType(@Param("requestType") String requestType);
}
