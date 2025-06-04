package com.carservice.service;

import com.carservice.dto.message.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 消息管理服务接口
 */
public interface MessageService {
    
    /**
     * 发送消息
     * @param messageDTO 消息信息
     * @return 发送的消息
     */
    MessageDTO sendMessage(MessageDTO messageDTO);
    
    /**
     * 获取用户收件箱
     * @param userId 用户ID
     * @param messageType 消息类型
     * @param isRead 是否已读
     * @param pageable 分页信息
     * @return 消息列表
     */
    Page<MessageDTO> getInboxMessages(String userId, String messageType, Boolean isRead, Pageable pageable);
    
    /**
     * 获取用户发件箱
     * @param userId 用户ID
     * @param messageType 消息类型
     * @param pageable 分页信息
     * @return 消息列表
     */
    Page<MessageDTO> getSentMessages(String userId, String messageType, Pageable pageable);
    
    /**
     * 获取消息详情
     * @param messageId 消息ID
     * @param userId 用户ID
     * @return 消息详情
     */
    MessageDTO getMessageDetail(String messageId, String userId);
    
    /**
     * 标记消息为已读
     * @param messageId 消息ID
     * @param userId 用户ID
     */
    void markMessageAsRead(String messageId, String userId);
    
    /**
     * 批量标记消息为已读
     * @param messageIds 消息ID列表
     * @param userId 用户ID
     */
    void markMessagesAsRead(List<String> messageIds, String userId);
    
    /**
     * 删除消息
     * @param messageId 消息ID
     * @param userId 用户ID
     */
    void deleteMessage(String messageId, String userId);
    
    /**
     * 批量删除消息
     * @param messageIds 消息ID列表
     * @param userId 用户ID
     */
    void deleteMessages(List<String> messageIds, String userId);
    
    /**
     * 获取未读消息数量
     * @param userId 用户ID
     * @return 未读消息数量
     */
    Long getUnreadMessageCount(String userId);
    
    /**
     * 获取各类型未读消息数量
     * @param userId 用户ID
     * @return 各类型未读消息数量
     */
    Object getUnreadMessageCountByType(String userId);
    
    /**
     * 搜索消息
     * @param userId 用户ID
     * @param keyword 关键词
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageable 分页信息
     * @return 消息列表
     */
    Page<MessageDTO> searchMessages(String userId, String keyword, LocalDateTime startTime, LocalDateTime endTime, Pageable pageable);
    
    /**
     * 获取审批消息列表
     * @param userId 用户ID
     * @param approvalType 审批类型
     * @param pageable 分页信息
     * @return 审批消息列表
     */
    Page<ApprovalMessageDTO> getApprovalMessages(String userId, String approvalType, Pageable pageable);
    
    /**
     * 获取待审批消息
     * @param userId 用户ID
     * @param pageable 分页信息
     * @return 待审批消息列表
     */
    Page<ApprovalMessageDTO> getPendingApprovalMessages(String userId, Pageable pageable);
    
    /**
     * 处理审批消息
     * @param approvalMessageId 审批消息ID
     * @param approved 是否批准
     * @param comments 审批意见
     * @param approverId 审批人ID
     */
    void processApprovalMessage(String approvalMessageId, Boolean approved, String comments, String approverId);
    
    /**
     * 发送系统通知
     * @param userIds 用户ID列表
     * @param title 标题
     * @param content 内容
     * @param messageType 消息类型
     * @param relatedId 关联ID
     */
    void sendSystemNotification(List<String> userIds, String title, String content, String messageType, String relatedId);
}
