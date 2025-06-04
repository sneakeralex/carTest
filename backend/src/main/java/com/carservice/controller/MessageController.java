package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.dto.message.*;
import com.carservice.service.MessageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * 消息管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
@Tag(name = "消息管理", description = "消息发送、接收、模板管理等功能")
public class MessageController {
    
    private final MessageService messageService;
    
    /**
     * 获取用户消息列表
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "获取用户消息列表", description = "支持按消息类型、状态筛选")
    public ResponseEntity<ApiResponse<Page<MessageDTO>>> getUserMessages(
            @PathVariable String userId,
            @Parameter(description = "消息类型") @RequestParam(required = false) String messageType,
            @Parameter(description = "消息状态") @RequestParam(required = false) String status,
            @Parameter(description = "是否已读") @RequestParam(required = false) Boolean isRead,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<MessageDTO> messages = messageService.getInboxMessages(userId, messageType, isRead, pageable);
            log.info("获取用户消息列表成功: 用户={}, 类型={}, 状态={}, 已读={}", userId, messageType, status, isRead);
            return ResponseEntity.ok(ApiResponse.success(messages));
        } catch (Exception e) {
            log.error("获取用户消息列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取消息详情
     */
    @GetMapping("/{messageId}")
    @Operation(summary = "获取消息详情")
    public ResponseEntity<ApiResponse<MessageDTO>> getMessageDetail(@PathVariable String messageId) {
        try {
            // For now, we'll use a dummy userId. In real implementation, get from authentication context
            String userId = "current_user";
            MessageDTO message = messageService.getMessageDetail(messageId, userId);
            log.info("获取消息详情成功: {}", messageId);
            return ResponseEntity.ok(ApiResponse.success(message));
        } catch (Exception e) {
            log.error("获取消息详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 标记消息为已读
     */
    @PostMapping("/{messageId}/read")
    @Operation(summary = "标记消息为已读")
    public ResponseEntity<ApiResponse<Void>> markMessageAsRead(@PathVariable String messageId) {
        try {
            // For now, we'll use a dummy userId. In real implementation, get from authentication context
            String userId = "current_user";
            messageService.markMessageAsRead(messageId, userId);
            log.info("标记消息为已读成功: {}", messageId);
            return ResponseEntity.ok(ApiResponse.success(null, "标记消息为已读成功"));
        } catch (Exception e) {
            log.error("标记消息为已读失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 批量标记消息为已读
     */
    @PostMapping("/batch-read")
    @Operation(summary = "批量标记消息为已读")
    public ResponseEntity<ApiResponse<Void>> batchMarkMessagesAsRead(@RequestBody BatchReadRequest request) {
        try {
            // For now, we'll use a dummy userId. In real implementation, get from authentication context
            String userId = "current_user";
            messageService.markMessagesAsRead(request.getMessageIds(), userId);
            log.info("批量标记消息为已读成功: 数量={}", request.getMessageIds().size());
            return ResponseEntity.ok(ApiResponse.success(null, "批量标记消息为已读成功"));
        } catch (Exception e) {
            log.error("批量标记消息为已读失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 删除消息
     */
    @DeleteMapping("/{messageId}")
    @Operation(summary = "删除消息")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable String messageId) {
        try {
            // For now, we'll use a dummy userId. In real implementation, get from authentication context
            String userId = "current_user";
            messageService.deleteMessage(messageId, userId);
            log.info("删除消息成功: {}", messageId);
            return ResponseEntity.ok(ApiResponse.success(null, "删除消息成功"));
        } catch (Exception e) {
            log.error("删除消息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 批量删除消息
     */
    @PostMapping("/batch-delete")
    @Operation(summary = "批量删除消息")
    public ResponseEntity<ApiResponse<Void>> batchDeleteMessages(@RequestBody BatchDeleteRequest request) {
        try {
            // For now, we'll use a dummy userId. In real implementation, get from authentication context
            String userId = "current_user";
            messageService.deleteMessages(request.getMessageIds(), userId);
            log.info("批量删除消息成功: 数量={}", request.getMessageIds().size());
            return ResponseEntity.ok(ApiResponse.success(null, "批量删除消息成功"));
        } catch (Exception e) {
            log.error("批量删除消息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 发送消息
     */
    @PostMapping("/send")
    @Operation(summary = "发送消息")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        try {
            // Convert request to MessageDTO
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setSenderId(request.getSenderId());
            messageDTO.setReceiverId(request.getRecipientId());
            messageDTO.setTitle(request.getTitle());
            messageDTO.setContent(request.getContent());
            messageDTO.setMessageType(request.getMessageType());
            messageDTO.setPriority(request.getPriority() != null ? request.getPriority() : "1");

            MessageDTO message = messageService.sendMessage(messageDTO);
            log.info("发送消息成功: 发送者={}, 接收者={}, 类型={}", request.getSenderId(), request.getRecipientId(), request.getMessageType());
            return ResponseEntity.ok(ApiResponse.success(message, "消息发送成功"));
        } catch (Exception e) {
            log.error("发送消息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取未读消息数量
     */
    @GetMapping("/user/{userId}/unread-count")
    @Operation(summary = "获取未读消息数量")
    public ResponseEntity<ApiResponse<UnreadCountDTO>> getUnreadMessageCount(@PathVariable String userId) {
        try {
            Long totalCount = messageService.getUnreadMessageCount(userId);
            Object countByType = messageService.getUnreadMessageCountByType(userId);

            UnreadCountDTO count = new UnreadCountDTO();
            count.setTotalUnread(totalCount.intValue());

            // Extract counts from the returned object (assuming it's a Map)
            if (countByType instanceof java.util.Map) {
                java.util.Map<String, Object> countMap = (java.util.Map<String, Object>) countByType;
                count.setSystemMessages((Integer) countMap.get("systemMessages"));
                count.setNotifications((Integer) countMap.get("notifications"));
                count.setAlerts((Integer) countMap.get("alerts"));
            }

            log.info("获取未读消息数量成功: 用户={}", userId);
            return ResponseEntity.ok(ApiResponse.success(count));
        } catch (Exception e) {
            log.error("获取未读消息数量失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取消息模板列表
     */
    @GetMapping("/templates")
    @Operation(summary = "获取消息模板列表")
    public ResponseEntity<ApiResponse<List<MessageTemplateDTO>>> getMessageTemplates(
            @Parameter(description = "模板类型") @RequestParam(required = false) String templateType) {
        try {
            // TODO: 实现获取消息模板列表逻辑 - 返回模拟数据
            List<MessageTemplateDTO> templates = createMockTemplates(templateType);
            log.info("获取消息模板列表成功: 类型={}", templateType);
            return ResponseEntity.ok(ApiResponse.success(templates));
        } catch (Exception e) {
            log.error("获取消息模板列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取消息模板详情
     */
    @GetMapping("/templates/{templateId}")
    @Operation(summary = "获取消息模板详情")
    public ResponseEntity<ApiResponse<MessageTemplateDTO>> getMessageTemplateDetail(@PathVariable String templateId) {
        try {
            // TODO: 实现获取消息模板详情逻辑 - 返回模拟数据
            MessageTemplateDTO template = createMockTemplate(templateId);
            log.info("获取消息模板详情成功: {}", templateId);
            return ResponseEntity.ok(ApiResponse.success(template));
        } catch (Exception e) {
            log.error("获取消息模板详情失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 使用模板发送消息
     */
    @PostMapping("/send-with-template")
    @Operation(summary = "使用模板发送消息")
    public ResponseEntity<ApiResponse<MessageDTO>> sendMessageWithTemplate(@Valid @RequestBody SendTemplateMessageRequest request) {
        try {
            // TODO: 实现使用模板发送消息逻辑 - 创建模拟消息
            MessageDTO messageDTO = new MessageDTO();
            messageDTO.setSenderId(request.getSenderId());
            messageDTO.setReceiverId(request.getRecipientId());
            messageDTO.setTitle("模板消息标题");
            messageDTO.setContent("使用模板 " + request.getTemplateId() + " 发送的消息");
            messageDTO.setMessageType("TEMPLATE");
            messageDTO.setPriority("1");

            MessageDTO message = messageService.sendMessage(messageDTO);
            log.info("使用模板发送消息成功: 模板={}, 接收者={}", request.getTemplateId(), request.getRecipientId());
            return ResponseEntity.ok(ApiResponse.success(message, "模板消息发送成功"));
        } catch (Exception e) {
            log.error("使用模板发送消息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取用户消息设置
     */
    @GetMapping("/settings/user/{userId}")
    @Operation(summary = "获取用户消息设置")
    public ResponseEntity<ApiResponse<MessageSettingDTO>> getUserMessageSettings(@PathVariable String userId) {
        try {
            // TODO: 实现获取用户消息设置逻辑 - 返回模拟数据
            MessageSettingDTO settings = createMockSettings(userId);
            log.info("获取用户消息设置成功: 用户={}", userId);
            return ResponseEntity.ok(ApiResponse.success(settings));
        } catch (Exception e) {
            log.error("获取用户消息设置失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新用户消息设置
     */
    @PutMapping("/settings/user/{userId}")
    @Operation(summary = "更新用户消息设置")
    public ResponseEntity<ApiResponse<MessageSettingDTO>> updateUserMessageSettings(
            @PathVariable String userId,
            @Valid @RequestBody MessageSettingDTO settingDTO) {
        try {
            // TODO: 实现更新用户消息设置逻辑 - 返回更新后的设置
            settingDTO.setUserId(userId);
            log.info("更新用户消息设置成功: 用户={}", userId);
            return ResponseEntity.ok(ApiResponse.success(settingDTO, "消息设置更新成功"));
        } catch (Exception e) {
            log.error("更新用户消息设置失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Helper methods for creating mock data

    /**
     * 创建模拟消息模板列表
     */
    private List<MessageTemplateDTO> createMockTemplates(String templateType) {
        List<MessageTemplateDTO> templates = new ArrayList<>();

        for (int i = 1; i <= 3; i++) {
            MessageTemplateDTO template = new MessageTemplateDTO();
            template.setTemplateId("TEMPLATE00" + i);
            template.setTemplateName("消息模板" + i);
            template.setTemplateType(templateType != null ? templateType : "SYSTEM");
            template.setTitle("模板标题" + i);
            template.setContent("这是模板" + i + "的内容，包含变量 {name} 和 {date}");
            template.setVariables("{\"name\": \"用户名\", \"date\": \"日期\"}");
            template.setIsActive(true);
            templates.add(template);
        }

        return templates;
    }

    /**
     * 创建模拟消息模板
     */
    private MessageTemplateDTO createMockTemplate(String templateId) {
        MessageTemplateDTO template = new MessageTemplateDTO();
        template.setTemplateId(templateId);
        template.setTemplateName("消息模板");
        template.setTemplateType("SYSTEM");
        template.setTitle("模板标题");
        template.setContent("这是模板的内容，包含变量 {name} 和 {date}");
        template.setVariables("{\"name\": \"用户名\", \"date\": \"日期\"}");
        template.setIsActive(true);
        return template;
    }

    /**
     * 创建模拟用户消息设置
     */
    private MessageSettingDTO createMockSettings(String userId) {
        MessageSettingDTO settings = new MessageSettingDTO();
        settings.setUserId(userId);
        settings.setEmailNotification(true);
        settings.setSmsNotification(false);
        settings.setPushNotification(true);
        settings.setSystemMessages(true);
        settings.setBookingNotifications(true);
        settings.setMaintenanceAlerts(true);
        return settings;
    }

    /**
     * 批量读取请求DTO
     */
    public static class BatchReadRequest {
        private List<String> messageIds;
        
        public List<String> getMessageIds() { return messageIds; }
        public void setMessageIds(List<String> messageIds) { this.messageIds = messageIds; }
    }
    
    /**
     * 批量删除请求DTO
     */
    public static class BatchDeleteRequest {
        private List<String> messageIds;
        
        public List<String> getMessageIds() { return messageIds; }
        public void setMessageIds(List<String> messageIds) { this.messageIds = messageIds; }
    }
    
    /**
     * 发送消息请求DTO
     */
    public static class SendMessageRequest {
        private String senderId;
        private String recipientId;
        private String messageType;
        private String title;
        private String content;
        private String priority;
        
        // Getters and Setters
        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }
        public String getRecipientId() { return recipientId; }
        public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
        public String getMessageType() { return messageType; }
        public void setMessageType(String messageType) { this.messageType = messageType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }
    }
    
    /**
     * 使用模板发送消息请求DTO
     */
    public static class SendTemplateMessageRequest {
        private String templateId;
        private String senderId;
        private String recipientId;
        private String variables; // JSON格式的模板变量
        
        // Getters and Setters
        public String getTemplateId() { return templateId; }
        public void setTemplateId(String templateId) { this.templateId = templateId; }
        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }
        public String getRecipientId() { return recipientId; }
        public void setRecipientId(String recipientId) { this.recipientId = recipientId; }
        public String getVariables() { return variables; }
        public void setVariables(String variables) { this.variables = variables; }
    }
    
    /**
     * 未读消息数量DTO
     */
    public static class UnreadCountDTO {
        private Integer totalUnread;
        private Integer systemMessages;
        private Integer notifications;
        private Integer alerts;

        // Getters and Setters
        public Integer getTotalUnread() { return totalUnread; }
        public void setTotalUnread(Integer totalUnread) { this.totalUnread = totalUnread; }
        public Integer getSystemMessages() { return systemMessages; }
        public void setSystemMessages(Integer systemMessages) { this.systemMessages = systemMessages; }
        public Integer getNotifications() { return notifications; }
        public void setNotifications(Integer notifications) { this.notifications = notifications; }
        public Integer getAlerts() { return alerts; }
        public void setAlerts(Integer alerts) { this.alerts = alerts; }
    }

    /**
     * 消息模板DTO
     */
    public static class MessageTemplateDTO {
        private String templateId;
        private String templateName;
        private String templateType;
        private String title;
        private String content;
        private String variables;
        private Boolean isActive;

        // Getters and Setters
        public String getTemplateId() { return templateId; }
        public void setTemplateId(String templateId) { this.templateId = templateId; }
        public String getTemplateName() { return templateName; }
        public void setTemplateName(String templateName) { this.templateName = templateName; }
        public String getTemplateType() { return templateType; }
        public void setTemplateType(String templateType) { this.templateType = templateType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getVariables() { return variables; }
        public void setVariables(String variables) { this.variables = variables; }
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    /**
     * 消息设置DTO
     */
    public static class MessageSettingDTO {
        private String userId;
        private Boolean emailNotification;
        private Boolean smsNotification;
        private Boolean pushNotification;
        private Boolean systemMessages;
        private Boolean bookingNotifications;
        private Boolean maintenanceAlerts;

        // Getters and Setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public Boolean getEmailNotification() { return emailNotification; }
        public void setEmailNotification(Boolean emailNotification) { this.emailNotification = emailNotification; }
        public Boolean getSmsNotification() { return smsNotification; }
        public void setSmsNotification(Boolean smsNotification) { this.smsNotification = smsNotification; }
        public Boolean getPushNotification() { return pushNotification; }
        public void setPushNotification(Boolean pushNotification) { this.pushNotification = pushNotification; }
        public Boolean getSystemMessages() { return systemMessages; }
        public void setSystemMessages(Boolean systemMessages) { this.systemMessages = systemMessages; }
        public Boolean getBookingNotifications() { return bookingNotifications; }
        public void setBookingNotifications(Boolean bookingNotifications) { this.bookingNotifications = bookingNotifications; }
        public Boolean getMaintenanceAlerts() { return maintenanceAlerts; }
        public void setMaintenanceAlerts(Boolean maintenanceAlerts) { this.maintenanceAlerts = maintenanceAlerts; }
    }
}
