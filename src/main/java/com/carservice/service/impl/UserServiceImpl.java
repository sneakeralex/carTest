package com.carservice.service.impl;

import com.carservice.entity.User;
import com.carservice.repository.UserRepository;
import com.carservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 用户服务实现类 - 简化版本
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

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

    // 简化的注册方法
    @Override
    public boolean register(User user) {
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 简化的登录方法
    @Override
    public String login(String username, String password) {
        User user = getByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return "login_success_token"; // 简化的token
        }
        throw new RuntimeException("用户名或密码错误");
    }

    // 简化的更新方法
    @Override
    public boolean updateUserInfo(User user) {
        try {
            userRepository.save(user);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 简化的密码修改方法
    @Override
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                if (user.getPassword().equals(oldPassword)) {
                    user.setPassword(newPassword);
                    userRepository.save(user);
                    return true;
                }
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }
}
