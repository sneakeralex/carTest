package com.carservice.service;

import com.carservice.entity.Role;
import com.carservice.entity.User;

import java.util.List;
import java.util.Optional;

/**
 * 角色服务接口
 */
public interface RoleService {
    
    /**
     * 保存角色
     * @param role 角色信息
     * @return 保存后的角色
     */
    Role save(Role role);
    
    /**
     * 根据ID查询角色
     * @param id 角色ID
     * @return 角色对象
     */
    Optional<Role> findById(Long id);
    
    /**
     * 查询所有角色
     * @return 角色列表
     */
    List<Role> findAll();
    
    /**
     * 根据ID删除角色
     * @param id 角色ID
     */
    void deleteById(Long id);
    
    /**
     * 获取用户角色列表
     * @param userId 用户ID
     * @return 角色列表
     */
    List<Role> getRolesByUserId(String userId);
    
    /**
     * 为用户分配角色
     * @param userId 用户ID
     * @param roleIds 角色ID列表
     * @return 分配结果
     */
    boolean assignRoles(String userId, List<String> roleCodes);

    /**
     * 根据角色编码获取角色
     * @param roleCode 角色编码
     * @return 角色对象
     */
    Role getRoleByCode(String roleCode);

    /**
     * 根据角色编码更新角色
     * @param roleCode 角色编码
     * @param role 角色信息
     * @return 更新后的角色
     */
    Role updateRoleByCode(String roleCode, Role role);

    /**
     * 根据角色编码删除角色
     * @param roleCode 角色编码
     */
    void deleteRoleByCode(String roleCode);

    /**
     * 为用户分配角色
     * @param userId 用户ID
     * @param roleCode 角色编码
     * @return 更新后的用户信息
     */
    User assignRoleToUser(String userId, String roleCode);

    /**
     * 添加新角色
     * @param role 角色信息
     * @return 添加后的角色
     */
    Role addRole(Role role);

    /**
     * 获取所有角色
     * @return 角色列表
     */
    List<Role> getAllRoles();
}