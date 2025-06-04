package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

/**
 * 面部认证信息实体
 */
@Data
@Entity
@Table(name = "face_auth")
@EqualsAndHashCode(callSuper = true)
public class FaceAuth extends BaseEntity {

    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    private String authId;

    private String userId;  // 关联的用户ID

    @Column(nullable = false)
    private String faceImageUrl;  // 面部图像URL

    @Column(nullable = false)
    private String faceFeatureData;  // 面部特征数据

    @Column(nullable = false)
    private LocalDateTime registrationTime;  // 注册时间

    private LocalDateTime lastUpdateTime;  // 最后更新时间

    private LocalDateTime lastVerifyTime;  // 最后验证时间

    @Column(nullable = false)
    private Boolean isActive;  // 是否启用

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthStatus status;  // 认证状态

    private Integer verifyCount;  // 验证次数

    @Column(length = 1000)
    private String metadata;  // 元数据（如设备信息、位置等）

    public enum AuthStatus {
        PENDING,     // 待认证
        VERIFIED,    // 已认证
        REJECTED,    // 已拒绝
        EXPIRED      // 已过期
    }
}
