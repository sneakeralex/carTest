package com.carservice.repository;

import com.carservice.entity.UserRoleRel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 用户角色关联Repository接口
 */
@Repository
public interface UserRoleRelRepository extends JpaRepository<UserRoleRel, Long> {
    
    /**
     * 根据用户ID查找用户角色关联
     * @param userId 用户ID
     * @return 用户角色关联列表
     */
    List<UserRoleRel> findByUserId(String userId);
    
    /**
     * 根据角色ID查找用户角色关联
     * @param roleId 角色ID
     * @return 用户角色关联列表
     */
    List<UserRoleRel> findByRoleId(String roleId);
}