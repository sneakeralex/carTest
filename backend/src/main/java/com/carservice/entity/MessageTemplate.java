package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import com.carservice.entity.Message.MessageType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;


/**
 * 消息模板实体
 */
@Data
@Entity
@Table(name = "message_template")
@EqualsAndHashCode(callSuper = true)
public class MessageTemplate extends BaseEntity {

    @GeneratedValue(generator = "message-template-id")
    @GenericGenerator(name = "message-template-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "MT"))
    @Column(name = "template_id", unique = true)
    private String templateId;

    @Column(nullable = false)
    private String templateCode;  // 模板编码

    @Column(nullable = false)
    private String templateName;  // 模板名称

    @Column(nullable = false, length = 2000)
    private String templateContent;  // 模板内容

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private MessageType messageType;  // 消息类型

    @Column(nullable = false)
    private Boolean isActive;  // 是否启用

    @Column(length = 1000)
    private String description;  // 模板描述

    @Column(length = 500)
    private String placeholders;  // 占位符列表（JSON格式）

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TemplateType templateType;  // 模板类型

    public enum TemplateType {
        EMAIL,      // 邮件模板
        SMS,        // 短信模板
        PUSH,       // 推送模板
        IN_APP      // 应用内消息模板
    }
}
