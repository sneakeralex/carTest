package com.carservice.service.impl;

import com.carservice.entity.Role;
import com.carservice.entity.User;
import com.carservice.entity.UserRoleRel;
import com.carservice.repository.RoleRepository;
import com.carservice.repository.UserRoleRelRepository;
import com.carservice.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 角色服务实现类
 */
@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRoleRelRepository userRoleRelRepository;

    @Override
    public List<Role> getRolesByUserId(String userId) {
        // 查询用户角色关联
        List<UserRoleRel> userRoleRels = userRoleRelRepository.findByUserId(userId);

        if (userRoleRels.isEmpty()) {
            return new ArrayList<>();
        }

        // 获取角色ID列表
        List<String> roleCodes = userRoleRels.stream()
                .map(UserRoleRel::getRoleCode)
                .collect(Collectors.toList());

        // 查询角色信息
        return roleCodes.stream().map(code -> roleRepository.findByRoleCode(code)).toList();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean assignRoles(String userId, List<String> roleCodes) {
        // 先删除用户现有角色
        List<UserRoleRel> existingRels = userRoleRelRepository.findByUserId(userId);
        for (UserRoleRel rel : existingRels) {
            userRoleRelRepository.delete(rel);
        }

        // 分配新角色
        if (roleCodes != null && !roleCodes.isEmpty()) {
            List<UserRoleRel> userRoleRels = new ArrayList<>();
            for (String roleCode : roleCodes) {
                UserRoleRel userRoleRel = new UserRoleRel();
                userRoleRel.setUserId(userId);
                userRoleRel.setRoleCode(roleCode);
                userRoleRels.add(userRoleRel);
            }

            // 批量插入
            userRoleRelRepository.saveAll(userRoleRels);
        }

        return true;
    }

    @Override
    public Optional<Role> findById(Long id) {
        return roleRepository.findById(id);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    @Override
    public Role save(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public void deleteById(Long id) {
        roleRepository.deleteById(id);
    }

    @Override
    public Role addRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @Override
    public Role getRoleByCode(String roleCode) {
        return roleRepository.findByRoleCode(roleCode);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Role updateRoleByCode(String roleCode, Role role) {
        Role existing = roleRepository.findByRoleCode(roleCode);
        if (existing == null) throw new RuntimeException("角色不存在: " + roleCode);
        existing.setRoleName(role.getRoleName());
        existing.setDescription(role.getDescription());
        // 只允许更新部分字段，roleCode不允许变更
        return roleRepository.save(existing);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRoleByCode(String roleCode) {
        Role existing = roleRepository.findByRoleCode(roleCode);
        if (existing != null) {
            roleRepository.delete(existing);
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User assignRoleToUser(String userId, String roleCode) {
        // 先删除该用户的该角色（防止重复）
        List<UserRoleRel> rels = userRoleRelRepository.findByUserId(userId);
        for (UserRoleRel rel : rels) {
            if (rel.getRoleCode().equals(roleCode)) {
                userRoleRelRepository.delete(rel);
            }
        }
        // 分配新角色
        UserRoleRel userRoleRel = new UserRoleRel();
        userRoleRel.setUserId(userId);
        userRoleRel.setRoleCode(roleCode);
        userRoleRelRepository.save(userRoleRel);
        // 返回用户对象（如需完整实现可查找User）
        return null;
    }
}