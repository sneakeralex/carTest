package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.carservice.entity.generator.PrefixedIdGenerator;

import java.io.Serializable;
import java.time.LocalDateTime;

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

    @Column(name = "user_id", unique = true)
    private String userId;

    @PrePersist
    public void prePersist() {
        if (this.userId == null) {
            this.userId = PrefixedIdGenerator.generateId("USR");
        }
    }

    /**
     * 用户名
     */
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * 密码（加密存储）
     */
    @Column(nullable = false)
    private String password;

    /**
     * 真实姓名
     */
    private String realName;

    @Column(unique = true)
    private String unionid;

    @Column(unique = true)
    private String openid;

    /**
     * 手机号
     */
    @Column(nullable = false)
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
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatusEnum status;

    /**
     * 人员类型
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PersonTypeEnum personType;

    /**
     * 用户角色
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    /**
     * 获取角色编码
     */
    @Transient
    public String getRoleCode() {
        return role != null ? role.getRoleCode() : null;
    }


    // /**
    //  * 发布状态
    //  */
    // @Column(nullable = false)
    // private Boolean isPublished = true;

    public boolean isCompleted() {
        return phone != null && !phone.isEmpty();
    }

    /**
     * 附件列表 - 通过 UserAttachment.userId 关联，不需要在这里定义
     */
    // private List<UserAttachment> attachments;

    /**
     * 最后登录时间
     */
    private LocalDateTime lastLoginTime;

    public enum UserStatusEnum {
        ACTIVE("正常"),
        FREEZE("锁定");

        private final String label;

        UserStatusEnum(String label) {
            this.label = label;
        }

        public String getLabel() {
            return label;
        }
    }

    /**
     * 人员类型枚举
     */
    public enum PersonTypeEnum {
        EMPLOYEE("employee", 0), // 员工
        CUSTOMER("customer", 1), // 客户
        SUPPLIER("supplier", 2), // 供应商
        PARTNER("partner", 3), // 合作伙伴
        VISITOR("visitor", 4); // 访客

        private final String name;
        private final int id;

        PersonTypeEnum(String name, int id) {
            this.name = name;
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public int getId() {
            return id;
        }
    }
}