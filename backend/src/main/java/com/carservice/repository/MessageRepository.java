package com.carservice.repository;

import com.carservice.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 消息Repository接口
 */
@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    /**
     * 根据消息ID查找消息
     * @param messageId 消息ID
     * @return 消息对象
     */
    Message findByMessageId(String messageId);
    
    /**
     * 根据发送者ID查找消息列表
     * @param senderId 发送者ID
     * @return 消息列表
     */
    List<Message> findBySenderId(String senderId);
    
    /**
     * 根据接收者ID查找消息列表
     * @param receiverId 接收者ID
     * @return 消息列表
     */
    List<Message> findByReceiverId(String receiverId);
    
    /**
     * 根据接收者ID和已读状态查找消息列表
     * @param receiverId 接收者ID
     * @param isRead 是否已读
     * @return 消息列表
     */
    List<Message> findByReceiverIdAndIsRead(String receiverId, Boolean isRead);
    
    /**
     * 根据消息类型查找消息列表
     * @param messageType 消息类型
     * @return 消息列表
     */
    List<Message> findByMessageType(Message.MessageType messageType);
    
    /**
     * 根据优先级查找消息列表
     * @param priority 优先级
     * @return 消息列表
     */
    List<Message> findByPriority(Message.MessagePriority priority);
    
    /**
     * 根据关联业务ID查找消息列表
     * @param relatedId 关联业务ID
     * @return 消息列表
     */
    List<Message> findByRelatedId(String relatedId);
    
    /**
     * 查找指定时间范围内的消息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 消息列表
     */
    List<Message> findBySendTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 统计未读消息数量
     * @param receiverId 接收者ID
     * @return 未读消息数量
     */
    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :receiverId AND m.isRead = false")
    long countUnreadMessages(@Param("receiverId") String receiverId);
    
    /**
     * 根据接收者ID和消息类型查找未读消息
     * @param receiverId 接收者ID
     * @param messageType 消息类型
     * @return 消息列表
     */
    List<Message> findByReceiverIdAndMessageTypeAndIsRead(String receiverId, Message.MessageType messageType, Boolean isRead);
}
