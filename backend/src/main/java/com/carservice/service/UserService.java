package com.carservice.service;

import com.carservice.entity.User;
import com.carservice.dto.RegisterRequest;
import com.carservice.dto.LoginRequest;
import com.carservice.dto.LoginResponse;
import com.carservice.dto.UpdateUserRequest;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务接口
 */
public interface UserService {
    
    /**
     * 保存用户
     * @param user 用户对象
     * @return 保存后的用户对象
     */
    User save(User user);
    
    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户对象（可能为空）
     */
    Optional<User> findById(Long id);
    
    /**
     * 查询所有用户
     * @return 用户列表
     */
    List<User> findAll();
    
    /**
     * 删除用户
     * @param id 用户ID
     */
    void deleteById(Long id);
    
    /**
     * 根据用户名获取用户
     * @param username 用户名
     * @return 用户对象
     */
    User getByUsername(String username);
    
    /**
     * 用户注册
     * @param user 用户信息
     * @return 注册结果
     */
    boolean register(User user);
    
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return JWT token
     */
    String login(String username, String password);
    
    /**
     * 更新用户信息
     * @param user 用户信息
     * @return 更新结果
     */
    boolean updateUserInfo(User user);
    
    /**
     * 修改密码
     * @param userId 用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     * @return 修改结果
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);

    User getCurrentUser(String username);
    User registerUser(RegisterRequest registerRequest);
    LoginResponse loginUser(LoginRequest loginRequest);
    User updateUser(String username, UpdateUserRequest updateUserRequest);
    void changePassword(String username, String oldPassword, String newPassword);
}