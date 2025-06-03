package com.carservice.repository;

import com.carservice.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * 角色数据访问接口
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    /**
     * 根据角色编码查询角色
     * @param roleCode 角色编码
     * @return 角色对象
     */
    Role findByRoleCode(String roleCode);
    
    /**
     * 根据角色名称查询角色
     * @param roleName 角色名称
     * @return 角色对象
     */
    Role findByRoleName(String roleName);
}