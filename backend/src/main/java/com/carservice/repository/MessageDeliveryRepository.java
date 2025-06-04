package com.carservice.repository;

import com.carservice.entity.MessageDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 消息发送Repository接口
 */
@Repository
public interface MessageDeliveryRepository extends JpaRepository<MessageDelivery, Long> {
    
    /**
     * 根据发送ID查找发送记录
     * @param deliveryId 发送ID
     * @return 发送记录对象
     */
    MessageDelivery findByDeliveryId(String deliveryId);
    
    /**
     * 根据消息ID查找发送记录列表
     * @param messageId 消息ID
     * @return 发送记录列表
     */
    List<MessageDelivery> findByMessageId(String messageId);
    
    /**
     * 根据模板ID查找发送记录列表
     * @param templateId 模板ID
     * @return 发送记录列表
     */
    List<MessageDelivery> findByTemplateId(String templateId);
    
    /**
     * 根据发送渠道查找发送记录列表
     * @param channel 发送渠道
     * @return 发送记录列表
     */
    List<MessageDelivery> findByChannel(MessageDelivery.DeliveryChannel channel);
    
    /**
     * 根据发送状态查找发送记录列表
     * @param status 发送状态
     * @return 发送记录列表
     */
    List<MessageDelivery> findByStatus(MessageDelivery.DeliveryStatus status);
    
    /**
     * 根据发送时间范围查找发送记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 发送记录列表
     */
    List<MessageDelivery> findBySendTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据渠道和状态查找发送记录
     * @param channel 发送渠道
     * @param status 发送状态
     * @return 发送记录列表
     */
    List<MessageDelivery> findByChannelAndStatus(MessageDelivery.DeliveryChannel channel, MessageDelivery.DeliveryStatus status);
    
    /**
     * 查找发送失败的记录
     * @return 发送失败的记录列表
     */
    @Query("SELECT md FROM MessageDelivery md WHERE md.status = 'FAILED' ORDER BY md.sendTime DESC")
    List<MessageDelivery> findFailedDeliveries();
    
    /**
     * 查找待发送的记录
     * @return 待发送的记录列表
     */
    @Query("SELECT md FROM MessageDelivery md WHERE md.status = 'PENDING' ORDER BY md.sendTime ASC")
    List<MessageDelivery> findPendingDeliveries();
    
    /**
     * 统计指定状态的发送记录数量
     * @param status 发送状态
     * @return 发送记录数量
     */
    @Query("SELECT COUNT(md) FROM MessageDelivery md WHERE md.status = :status")
    long countByStatus(@Param("status") MessageDelivery.DeliveryStatus status);
    
    /**
     * 统计指定渠道的发送记录数量
     * @param channel 发送渠道
     * @return 发送记录数量
     */
    @Query("SELECT COUNT(md) FROM MessageDelivery md WHERE md.channel = :channel")
    long countByChannel(@Param("channel") MessageDelivery.DeliveryChannel channel);
    
    /**
     * 查找需要重试的发送记录
     * @param maxRetryCount 最大重试次数
     * @return 需要重试的发送记录列表
     */
    @Query("SELECT md FROM MessageDelivery md WHERE md.status = 'FAILED' AND md.retryCount < :maxRetryCount")
    List<MessageDelivery> findRetryableDeliveries(@Param("maxRetryCount") Integer maxRetryCount);
}
