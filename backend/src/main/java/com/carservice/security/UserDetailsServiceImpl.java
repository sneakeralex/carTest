package com.carservice.security;

import com.carservice.entity.User;
import com.carservice.service.RoleService;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户详情服务实现类
 * 实现Spring Security的UserDetailsService接口，用于加载用户特定数据
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserService userService;
    
    @Autowired
    private RoleService roleService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 根据用户名获取用户信息
        User user = userService.getByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("用户名不存在");
        }
        
        // 获取用户角色列表
        List<SimpleGrantedAuthority> authorities = roleService.getRolesByUserId(user.getUserId())
                .stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleCode()))
                .collect(Collectors.toList());
        
        // 返回UserDetails实现类
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.getStatus() == 1, // 账号是否启用
                true, // 账号是否过期
                true, // 密码是否过期
                true, // 账号是否锁定
                authorities);
    }
}