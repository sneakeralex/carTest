package com.carservice.repository;

import com.carservice.entity.SiteMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 场地消息Repository接口
 */
@Repository
public interface SiteMessageRepository extends JpaRepository<SiteMessage, Long> {
    
    /**
     * 根据场地消息ID查找场地消息
     * @param siteMessageId 场地消息ID
     * @return 场地消息对象
     */
    SiteMessage findBySiteMessageId(String siteMessageId);
    
    /**
     * 根据场地ID查找场地消息列表
     * @param siteId 场地ID
     * @return 场地消息列表
     */
    List<SiteMessage> findBySiteId(String siteId);
    
    /**
     * 根据消息ID查找场地消息列表
     * @param messageId 消息ID
     * @return 场地消息列表
     */
    List<SiteMessage> findByMessageId(String messageId);
    
    /**
     * 根据消息类型查找场地消息列表
     * @param messageType 消息类型
     * @return 场地消息列表
     */
    List<SiteMessage> findByMessageType(SiteMessage.SiteMessageType messageType);
    
    /**
     * 根据消息状态查找场地消息列表
     * @param status 消息状态
     * @return 场地消息列表
     */
    List<SiteMessage> findByStatus(SiteMessage.MessageStatus status);
    
    /**
     * 根据发送时间范围查找场地消息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 场地消息列表
     */
    List<SiteMessage> findBySendTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据场地ID和消息类型查找场地消息
     * @param siteId 场地ID
     * @param messageType 消息类型
     * @return 场地消息列表
     */
    List<SiteMessage> findBySiteIdAndMessageType(String siteId, SiteMessage.SiteMessageType messageType);
    
    /**
     * 根据场地ID和状态查找场地消息
     * @param siteId 场地ID
     * @param status 消息状态
     * @return 场地消息列表
     */
    List<SiteMessage> findBySiteIdAndStatus(String siteId, SiteMessage.MessageStatus status);
    
    /**
     * 查找未处理的场地消息
     * @return 未处理场地消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.status = 'PENDING' ORDER BY sm.sendTime ASC")
    List<SiteMessage> findPendingMessages();
    
    /**
     * 查找场地告警消息
     * @param siteId 场地ID
     * @return 告警消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.messageType = 'ALERT' ORDER BY sm.sendTime DESC")
    List<SiteMessage> findAlertMessagesBySiteId(@Param("siteId") String siteId);
    
    /**
     * 统计指定场地的消息数量
     * @param siteId 场地ID
     * @return 消息数量
     */
    @Query("SELECT COUNT(sm) FROM SiteMessage sm WHERE sm.siteId = :siteId")
    long countMessagesBySiteId(@Param("siteId") String siteId);
    
    /**
     * 统计指定状态的消息数量
     * @param status 消息状态
     * @return 消息数量
     */
    @Query("SELECT COUNT(sm) FROM SiteMessage sm WHERE sm.status = :status")
    long countByStatus(@Param("status") SiteMessage.MessageStatus status);
    
    /**
     * 查找场地维护消息
     * @param siteId 场地ID
     * @return 维护消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.messageType = 'MAINTENANCE' ORDER BY sm.sendTime DESC")
    List<SiteMessage> findMaintenanceMessagesBySiteId(@Param("siteId") String siteId);
}
