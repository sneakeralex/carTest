package com.carservice.repository;

import com.carservice.entity.ApprovalMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 审批消息Repository接口
 */
@Repository
public interface ApprovalMessageRepository extends JpaRepository<ApprovalMessage, Long> {
    
    /**
     * 根据审批消息ID查找审批消息
     * @param approvalMessageId 审批消息ID
     * @return 审批消息对象
     */
    ApprovalMessage findByApprovalMessageId(String approvalMessageId);
    
    /**
     * 根据消息ID查找审批消息列表
     * @param messageId 消息ID
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByMessageId(String messageId);
    
    /**
     * 根据审批记录ID查找审批消息列表
     * @param approvalId 审批记录ID
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByApprovalId(String approvalId);
    
    /**
     * 根据审批类型查找审批消息列表
     * @param approvalType 审批类型
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByApprovalType(ApprovalMessage.ApprovalType approvalType);
    
    /**
     * 根据上一个审批人查找审批消息列表
     * @param previousApproverId 上一个审批人ID
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByPreviousApproverId(String previousApproverId);
    
    /**
     * 根据下一个审批人查找审批消息列表
     * @param nextApproverId 下一个审批人ID
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByNextApproverId(String nextApproverId);
    
    /**
     * 根据当前审批步骤查找审批消息列表
     * @param currentStep 当前审批步骤
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByCurrentStep(Integer currentStep);
    
    /**
     * 根据审批截止时间范围查找审批消息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByApprovalDeadlineBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 查找即将到期的审批消息（截止时间在指定时间之前）
     * @param deadline 截止时间
     * @return 审批消息列表
     */
    @Query("SELECT am FROM ApprovalMessage am WHERE am.approvalDeadline <= :deadline ORDER BY am.approvalDeadline ASC")
    List<ApprovalMessage> findUpcomingDeadlines(@Param("deadline") LocalDateTime deadline);
    
    /**
     * 根据审批类型和当前步骤查找审批消息
     * @param approvalType 审批类型
     * @param currentStep 当前审批步骤
     * @return 审批消息列表
     */
    List<ApprovalMessage> findByApprovalTypeAndCurrentStep(ApprovalMessage.ApprovalType approvalType, Integer currentStep);
    
    /**
     * 统计指定审批类型的消息数量
     * @param approvalType 审批类型
     * @return 消息数量
     */
    @Query("SELECT COUNT(am) FROM ApprovalMessage am WHERE am.approvalType = :approvalType")
    long countByApprovalType(@Param("approvalType") ApprovalMessage.ApprovalType approvalType);
    
    /**
     * 查找超期未处理的审批消息
     * @param currentTime 当前时间
     * @return 超期审批消息列表
     */
    @Query("SELECT am FROM ApprovalMessage am WHERE am.approvalDeadline < :currentTime ORDER BY am.approvalDeadline ASC")
    List<ApprovalMessage> findOverdueApprovals(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * 根据审批人查找待处理的审批消息
     * @param approverId 审批人ID
     * @return 待处理审批消息列表
     */
    @Query("SELECT am FROM ApprovalMessage am WHERE am.nextApproverId = :approverId ORDER BY am.approvalDeadline ASC")
    List<ApprovalMessage> findPendingApprovalsByApproverId(@Param("approverId") String approverId);
}
