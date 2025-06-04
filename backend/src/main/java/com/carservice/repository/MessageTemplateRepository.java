package com.carservice.repository;

import com.carservice.entity.Message;
import com.carservice.entity.MessageTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 消息模板Repository接口
 */
@Repository
public interface MessageTemplateRepository extends JpaRepository<MessageTemplate, Long> {
    
    /**
     * 根据模板ID查找模板
     * @param templateId 模板ID
     * @return 模板对象
     */
    MessageTemplate findByTemplateId(String templateId);
    
    /**
     * 根据模板编码查找模板
     * @param templateCode 模板编码
     * @return 模板对象
     */
    MessageTemplate findByTemplateCode(String templateCode);
    
    /**
     * 根据模板名称查找模板
     * @param templateName 模板名称
     * @return 模板对象
     */
    MessageTemplate findByTemplateName(String templateName);
    
    /**
     * 根据消息类型查找模板列表
     * @param messageType 消息类型
     * @return 模板列表
     */
    List<MessageTemplate> findByMessageType(Message.MessageType messageType);
    
    /**
     * 根据模板类型查找模板列表
     * @param templateType 模板类型
     * @return 模板列表
     */
    List<MessageTemplate> findByTemplateType(MessageTemplate.TemplateType templateType);
    
    /**
     * 根据是否启用查找模板列表
     * @param isActive 是否启用
     * @return 模板列表
     */
    List<MessageTemplate> findByIsActive(Boolean isActive);
    
    /**
     * 根据消息类型和模板类型查找模板
     * @param messageType 消息类型
     * @param templateType 模板类型
     * @return 模板列表
     */
    List<MessageTemplate> findByMessageTypeAndTemplateType(Message.MessageType messageType, MessageTemplate.TemplateType templateType);
    
    /**
     * 根据消息类型和是否启用查找模板
     * @param messageType 消息类型
     * @param isActive 是否启用
     * @return 模板列表
     */
    List<MessageTemplate> findByMessageTypeAndIsActive(Message.MessageType messageType, Boolean isActive);
    
    /**
     * 根据模板名称模糊查询
     * @param templateName 模板名称关键字
     * @return 模板列表
     */
    List<MessageTemplate> findByTemplateNameContainingIgnoreCase(String templateName);
    
    /**
     * 查找所有启用的模板
     * @return 启用的模板列表
     */
    @Query("SELECT mt FROM MessageTemplate mt WHERE mt.isActive = true ORDER BY mt.messageType, mt.templateType, mt.templateName")
    List<MessageTemplate> findAllActiveTemplates();
    
    /**
     * 根据消息类型、模板类型和启用状态查找模板
     * @param messageType 消息类型
     * @param templateType 模板类型
     * @param isActive 是否启用
     * @return 模板对象
     */
    MessageTemplate findByMessageTypeAndTemplateTypeAndIsActive(Message.MessageType messageType, 
                                                               MessageTemplate.TemplateType templateType, 
                                                               Boolean isActive);
    
    /**
     * 统计指定消息类型的模板数量
     * @param messageType 消息类型
     * @return 模板数量
     */
    @Query("SELECT COUNT(mt) FROM MessageTemplate mt WHERE mt.messageType = :messageType AND mt.isActive = true")
    long countActiveTemplatesByMessageType(@Param("messageType") Message.MessageType messageType);
}
