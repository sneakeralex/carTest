package com.carservice.service.impl;

import com.carservice.common.exception.BusinessException;
import com.carservice.common.api.ResultCode;
import com.carservice.common.util.JwtTokenUtil;
import com.carservice.entity.User;
import com.carservice.entity.UserRoleRel;
import com.carservice.repository.UserRepository;
import com.carservice.repository.UserRoleRelRepository;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private UserRoleRelRepository userRoleRelRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public List<User> findAll() {
        return userRepository.findAll();
    }
    
    @Override
    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
    
    @Override
    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean register(User user) {
        // 检查用户名是否已存在
        User existUser = getByUsername(user.getUsername());
        if (existUser != null) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户名已存在");
        }
        
        // 设置默认值
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(1); // 默认启用
        
        // 保存用户
        User savedUser = userRepository.save(user);
        
        // 分配默认角色（普通用户角色，ID为2）
        UserRoleRel userRoleRel = new UserRoleRel();
        userRoleRel.setUserId(savedUser.getUserId());
        userRoleRel.setRoleCode("2"); // 默认分配普通用户角色
        userRoleRelRepository.save(userRoleRel);
        return true;
    }

    @Override
    public String login(String username, String password) {
        // 根据用户名获取用户
        User user = getByUsername(username);
        if (user == null) {
            throw new BadCredentialsException("用户名或密码错误");
        }
        
        // 检查用户状态
        if (user.getStatus() == 0) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "账号已被禁用");
        }
        
        // 验证密码
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("用户名或密码错误");
        }
        
        // 创建UserDetails对象
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("ROLE_USER")
                .build();
        
        // 生成JWT token
        return jwtTokenUtil.generateToken(userDetails);
    }

    @Override
    public boolean updateUserInfo(User user) {
        Optional<User> existUserOpt = userRepository.findById(user.getId());
        if (!existUserOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户不存在");
        }
        
        User existUser = existUserOpt.get();
        
        // 不允许修改用户名和密码
        if (user.getRealName() != null) existUser.setRealName(user.getRealName());
        if (user.getPhone() != null) existUser.setPhone(user.getPhone());
        if (user.getEmail() != null) existUser.setEmail(user.getEmail());
        if (user.getAvatar() != null) existUser.setAvatar(user.getAvatar());
        if (user.getGender() != null) existUser.setGender(user.getGender());
        
        userRepository.save(existUser);
        return true;
    }

    @Override
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (!userOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户不存在");
        }
        
        User user = userOpt.get();
        
        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "原密码错误");
        }
        
        // 更新密码
        user.setPassword(passwordEncoder.encode(newPassword));
        
        userRepository.save(user);
        return true;
    }

    @Override
    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User registerUser(com.carservice.dto.RegisterRequest registerRequest) {
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getEmail());
        user.setPhone(registerRequest.getPhone());
        // 可补充其他注册字段
        return userRepository.save(user);
    }

    @Override
    public com.carservice.dto.LoginResponse loginUser(com.carservice.dto.LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());
        if (user == null || !passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("用户名或密码错误");
        }
        com.carservice.dto.LoginResponse resp = new com.carservice.dto.LoginResponse();
        resp.setUsername(user.getUsername());
        // 这里需要UserDetails对象
        org.springframework.security.core.userdetails.UserDetails userDetails =
            org.springframework.security.core.userdetails.User.withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("USER") // 可根据实际角色调整
                .build();
        resp.setToken(jwtTokenUtil.generateToken(userDetails));
        return resp;
    }

    @Override
    public User updateUser(String username, com.carservice.dto.UpdateUserRequest updateUserRequest) {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户不存在");
        user.setRealName(updateUserRequest.getRealName());
        user.setEmail(updateUserRequest.getEmail());
        user.setPhone(updateUserRequest.getPhone());
        user.setAvatar(updateUserRequest.getAvatar());
        // 可补充其他可更新字段
        return userRepository.save(user);
    }

    @Override
    public void changePassword(String username, String oldPassword, String newPassword) {
        User user = userRepository.findByUsername(username);
        if (user == null) throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户不存在");
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadCredentialsException("原密码错误");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}