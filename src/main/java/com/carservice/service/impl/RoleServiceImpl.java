package com.carservice.service.impl;

import com.carservice.entity.Role;
import com.carservice.service.RoleService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 角色服务实现类 - 简化版本
 */
@Service
public class RoleServiceImpl implements RoleService {

    @Override
    public List<Role> getRolesByUserId(String userId) {
        // 简化实现：返回默认角色
        List<Role> roles = new ArrayList<>();
        Role defaultRole = new Role();
        defaultRole.setRoleCode("USER");
        defaultRole.setRoleName("普通用户");
        roles.add(defaultRole);
        return roles;
    }
}
