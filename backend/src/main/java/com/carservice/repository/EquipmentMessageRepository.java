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
     * 根据消息类型查找设备消息列表
     * @param messageType 消息类型
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByMessageType(EquipmentMessage.EquipmentMessageType messageType);
    
    /**
     * 根据消息状态查找设备消息列表
     * @param status 消息状态
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByStatus(EquipmentMessage.MessageStatus status);
    
    /**
     * 根据发送时间范围查找设备消息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 设备消息列表
     */
    List<EquipmentMessage> findBySendTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据设备ID和消息类型查找设备消息
     * @param equipmentId 设备ID
     * @param messageType 消息类型
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByEquipmentIdAndMessageType(String equipmentId, EquipmentMessage.EquipmentMessageType messageType);
    
    /**
     * 根据设备ID和状态查找设备消息
     * @param equipmentId 设备ID
     * @param status 消息状态
     * @return 设备消息列表
     */
    List<EquipmentMessage> findByEquipmentIdAndStatus(String equipmentId, EquipmentMessage.MessageStatus status);
    
    /**
     * 查找未处理的设备消息
     * @return 未处理设备消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.status = 'PENDING' ORDER BY em.sendTime ASC")
    List<EquipmentMessage> findPendingMessages();
    
    /**
     * 查找设备告警消息
     * @param equipmentId 设备ID
     * @return 告警消息列表
     */
    @Query("SELECT em FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId AND em.messageType = 'ALERT' ORDER BY em.sendTime DESC")
    List<EquipmentMessage> findAlertMessagesByEquipmentId(@Param("equipmentId") String equipmentId);
    
    /**
     * 统计指定设备的消息数量
     * @param equipmentId 设备ID
     * @return 消息数量
     */
    @Query("SELECT COUNT(em) FROM EquipmentMessage em WHERE em.equipmentId = :equipmentId")
    long countMessagesByEquipmentId(@Param("equipmentId") String equipmentId);
    
    /**
     * 统计指定状态的消息数量
     * @param status 消息状态
     * @return 消息数量
     */
    @Query("SELECT COUNT(em) FROM EquipmentMessage em WHERE em.status = :status")
    long countByStatus(@Param("status") EquipmentMessage.MessageStatus status);
}
