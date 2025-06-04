package com.carservice.repository;

import com.carservice.entity.Message;
import com.carservice.entity.MessageSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 消息设置Repository接口
 */
@Repository
public interface MessageSettingRepository extends JpaRepository<MessageSetting, Long> {
    
    /**
     * 根据设置ID查找设置
     * @param settingId 设置ID
     * @return 设置对象
     */
    MessageSetting findBySettingId(String settingId);
    
    /**
     * 根据用户ID查找设置列表
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserId(String userId);
    
    /**
     * 根据用户ID和消息类型查找设置
     * @param userId 用户ID
     * @param messageType 消息类型
     * @return 设置对象
     */
    MessageSetting findByUserIdAndMessageType(String userId, Message.MessageType messageType);
    
    /**
     * 根据消息类型查找设置列表
     * @param messageType 消息类型
     * @return 设置列表
     */
    List<MessageSetting> findByMessageType(Message.MessageType messageType);
    
    /**
     * 根据通知频率查找设置列表
     * @param frequency 通知频率
     * @return 设置列表
     */
    List<MessageSetting> findByFrequency(MessageSetting.NotificationFrequency frequency);
    
    /**
     * 根据用户ID查找启用邮件通知的设置
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserIdAndEmailEnabledTrue(String userId);
    
    /**
     * 根据用户ID查找启用短信通知的设置
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserIdAndSmsEnabledTrue(String userId);
    
    /**
     * 根据用户ID查找启用推送通知的设置
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserIdAndPushEnabledTrue(String userId);
    
    /**
     * 根据用户ID查找启用应用内通知的设置
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserIdAndInAppEnabledTrue(String userId);
    
    /**
     * 根据用户ID查找未静音的设置
     * @param userId 用户ID
     * @return 设置列表
     */
    List<MessageSetting> findByUserIdAndMuteAllFalse(String userId);
    
    /**
     * 查找启用指定通知方式的用户设置
     * @param messageType 消息类型
     * @param notificationType 通知方式（email, sms, push, inApp）
     * @return 设置列表
     */
    @Query("SELECT ms FROM MessageSetting ms WHERE ms.messageType = :messageType AND " +
           "CASE :notificationType " +
           "WHEN 'email' THEN ms.emailEnabled = true " +
           "WHEN 'sms' THEN ms.smsEnabled = true " +
           "WHEN 'push' THEN ms.pushEnabled = true " +
           "WHEN 'inApp' THEN ms.inAppEnabled = true " +
           "ELSE false END AND ms.muteAll = false")
    List<MessageSetting> findEnabledSettingsByTypeAndChannel(@Param("messageType") Message.MessageType messageType, 
                                                            @Param("notificationType") String notificationType);
    
    /**
     * 统计启用指定消息类型的用户数量
     * @param messageType 消息类型
     * @return 用户数量
     */
    @Query("SELECT COUNT(DISTINCT ms.userId) FROM MessageSetting ms WHERE ms.messageType = :messageType AND ms.muteAll = false")
    long countEnabledUsersByMessageType(@Param("messageType") Message.MessageType messageType);
}
