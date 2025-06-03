package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/**
 * 角色实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "role")
public class Role extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;


    /**
     * 角色名称
     */
    @Column(name = "role_name")
    private String roleName;

    /**
     * 角色编码
     */
    @Column(name = "role_code")
    private String roleCode;

    /**
     * 角色描述
     */
    @Column(name = "description")
    private String description;

    /**
     * 状态：0禁用，1启用
     */
    @Column(name = "status")
    private Integer status;


}