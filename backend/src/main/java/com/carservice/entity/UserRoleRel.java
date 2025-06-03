package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * 用户角色关联实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "user_role_rel")
public class UserRoleRel extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @Column(name = "user_id")
    private String userId;

    /**
     * 角色ID
     */
    @Column(name = "role_code")
    private String roleCode;


}