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
     * 根据通知类型查找场地消息列表
     * @param notificationType 通知类型
     * @return 场地消息列表
     */
    List<SiteMessage> findByNotificationType(SiteMessage.SiteNotificationType notificationType);

    /**
     * 根据预约ID查找场地消息列表
     * @param bookingId 预约ID
     * @return 场地消息列表
     */
    List<SiteMessage> findByBookingId(String bookingId);

    /**
     * 根据事件时间范围查找场地消息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 场地消息列表
     */
    List<SiteMessage> findByEventTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 根据场地ID和通知类型查找场地消息
     * @param siteId 场地ID
     * @param notificationType 通知类型
     * @return 场地消息列表
     */
    List<SiteMessage> findBySiteIdAndNotificationType(String siteId, SiteMessage.SiteNotificationType notificationType);

    /**
     * 根据场地ID和预约ID查找场地消息
     * @param siteId 场地ID
     * @param bookingId 预约ID
     * @return 场地消息列表
     */
    List<SiteMessage> findBySiteIdAndBookingId(String siteId, String bookingId);
    
    /**
     * 查找维护提醒消息
     * @param siteId 场地ID
     * @return 维护提醒消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.notificationType = 'MAINTENANCE_ALERT' ORDER BY sm.eventTime DESC")
    List<SiteMessage> findMaintenanceAlertsBySiteId(@Param("siteId") String siteId);

    /**
     * 查找天气预警消息
     * @param siteId 场地ID
     * @return 天气预警消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.notificationType = 'WEATHER_WARNING' ORDER BY sm.eventTime DESC")
    List<SiteMessage> findWeatherWarningsBySiteId(@Param("siteId") String siteId);

    /**
     * 查找紧急通知消息
     * @return 紧急通知消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.notificationType = 'EMERGENCY' ORDER BY sm.eventTime DESC")
    List<SiteMessage> findEmergencyMessages();

    /**
     * 统计指定场地的消息数量
     * @param siteId 场地ID
     * @return 消息数量
     */
    @Query("SELECT COUNT(sm) FROM SiteMessage sm WHERE sm.siteId = :siteId")
    long countMessagesBySiteId(@Param("siteId") String siteId);

    /**
     * 统计指定通知类型的消息数量
     * @param notificationType 通知类型
     * @return 消息数量
     */
    @Query("SELECT COUNT(sm) FROM SiteMessage sm WHERE sm.notificationType = :notificationType")
    long countByNotificationType(@Param("notificationType") SiteMessage.SiteNotificationType notificationType);

    /**
     * 查找排期变更消息
     * @param siteId 场地ID
     * @return 排期变更消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.notificationType = 'SCHEDULE_CHANGE' ORDER BY sm.eventTime DESC")
    List<SiteMessage> findScheduleChangesBySiteId(@Param("siteId") String siteId);

    /**
     * 查找容量预警消息
     * @param siteId 场地ID
     * @return 容量预警消息列表
     */
    @Query("SELECT sm FROM SiteMessage sm WHERE sm.siteId = :siteId AND sm.notificationType = 'CAPACITY_WARNING' ORDER BY sm.eventTime DESC")
    List<SiteMessage> findCapacityWarningsBySiteId(@Param("siteId") String siteId);
}
