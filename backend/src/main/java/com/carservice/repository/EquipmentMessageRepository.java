package com.carservice.repository;

import com.carservice.entity.EquipmentMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 设备消息Repository接口
 */
@Repository
public interface EquipmentMessageRepository extends JpaRepository<EquipmentMessage, Long> {
    
    /**
     * 根据设备消息ID查找设备消息
     * @param equipmentMessageId 设备消息ID
     * @return 设备消息对象
     */
    EquipmentMessage findByEquipmentMessageId(String equipmentMessageId);
    
    /**
     * 根据设备ID查找设备消息列表
     * @param equipmentId 设备ID
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByEquipmentId(String equipmentId);
    
    /**
     * 根据消息ID查找设备消息列表
     * @param messageId 消息ID
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByMessageId(String messageId);
    
    /**
     * 根据通知类型查找设备消息列表
     * @param notificationType 通知类型
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByNotificationType(EquipmentMessage.EquipmentNotificationType notificationType);

    /**
     * 根据借用记录ID查找设备消息列表
     * @param borrowRecordId 借用记录ID
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByBorrowRecordId(String borrowRecordId);

    /**
     * 根据归还截止日期范围查找设备消息
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * 根据设备ID和通知类型查找设备消息
     * @param equipmentId 设备ID
     * @param notificationType 通知类型
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByEquipmentIdAndNotificationType(String equipmentId, EquipmentMessage.EquipmentNotificationType notificationType);

    /**
     * 根据设备ID和借用记录ID查找设备消息
     * @param equipmentId 设备ID
     * @param borrowRecordId 借用记录ID
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByEquipmentIdAndBorrowRecordId(String equipmentId, String borrowRecordId);
    
    /**
     * 查找归还提醒消息
     * @param equipmentId 设备ID
     * @return 归还提醒消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId AND em.notificationType = 'RETURN_REMINDER' ORDER BY em.dueDate ASC")
    List<EquipmentMessage> findReturnRemindersByEquipmentId(@Param("equipmentId") String equipmentId);

    /**
     * 查找超期提醒消息
     * @param equipmentId 设备ID
     * @return 超期提醒消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId AND em.notificationType = 'OVERDUE_ALERT' ORDER BY em.dueDate DESC")
    List<EquipmentMessage> findOverdueAlertsByEquipmentId(@Param("equipmentId") String equipmentId);

    /**
     * 查找维护到期消息
     * @return 维护到期消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.notificationType = 'MAINTENANCE_DUE' ORDER BY em.dueDate ASC")
    List<EquipmentMessage> findMaintenanceDueMessages();

    /**
     * 查找损坏报告消息
     * @param equipmentId 设备ID
     * @return 损坏报告消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId AND em.notificationType = 'DAMAGE_REPORT' ORDER BY em.dueDate DESC")
    List<EquipmentMessage> findDamageReportsByEquipmentId(@Param("equipmentId") String equipmentId);

    /**
     * 查找即将到期的设备消息
     * @param dueDate 到期日期
     * @return 即将到期的设备消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.dueDate <= :dueDate AND em.actualReturnDate IS NULL ORDER BY em.dueDate ASC")
    List<EquipmentMessage> findUpcomingDueMessages(@Param("dueDate") LocalDateTime dueDate);

    /**
     * 统计指定设备的消息数量
     * @param equipmentId 设备ID
     * @return 消息数量
     */
    @Query("SELECT COUNT(em) FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId")
    long countMessagesByEquipmentId(@Param("equipmentId") String equipmentId);

    /**
     * 统计指定通知类型的消息数量
     * @param notificationType 通知类型
     * @return 消息数量
     */
    @Query("SELECT COUNT(em) FROM EquipmentMessage em WHERE em.notificationType = :notificationType")
    long countByNotificationType(@Param("notificationType") EquipmentMessage.EquipmentNotificationType notificationType);

    /**
     * 查找超期未归还的设备消息
     * @param currentDate 当前日期
     * @return 超期未归还的设备消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.dueDate < :currentDate AND em.actualReturnDate IS NULL ORDER BY em.overdueHours DESC")
    List<EquipmentMessage> findOverdueEquipmentMessages(@Param("currentDate") LocalDateTime currentDate);
}
