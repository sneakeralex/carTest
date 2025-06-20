package com.carservice.service;

import com.carservice.entity.Role;

import java.util.List;

/**
 * 角色服务接口 - 简化版本
 */
public interface RoleService {

    /**
     * 获取用户角色列表
     * @param userId 用户ID
     * @return 角色列表
     */
    List<Role> getRolesByUserId(String userId);
}