package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;

/**
 * 用户实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user")
public class User extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    // @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    // private Long id;

    @Column(name = "user_id")
    private String userId;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码（加密存储）
     */
    private String password;

    /**
     * 真实姓名
     */
    private String realName;

    /**
     * 手机号
     */
    private String phone;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像URL
     */
    private String avatar;

    /**
     * 性别：0未知，1男，2女
     */
    private Integer gender;

    /**
     * 状态：0禁用，1启用
     */
    private Integer status;

    /**
     * 人员类型
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonType personType;

    /**
     * 发布状态
     */
    @Column(nullable = false)
    private Boolean isPublished = true;

    /**
     * 附件列表
     */
    @Column(columnDefinition = "json")
    private List<UserAttachment> attachments;

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    /**
     * 人员类型枚举
     */
    public enum PersonType {
        EMPLOYEE, // 员工
        CUSTOMER, // 客户
        SUPPLIER, // 供应商
        PARTNER, // 合作伙伴
        VISITOR // 访客
    }
}