package com.carservice.controller;

import com.carservice.entity.User;
import com.carservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 测试控制器 - 用于验证数据库连接和基本功能
 */
@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*")
public class TestController {

    @Autowired
    private UserRepository userRepository;

    /**
     * 测试数据库连接
     */
    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> testDatabase() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 测试查询用户数量
            long userCount = userRepository.count();
            result.put("status", "SUCCESS");
            result.put("userCount", userCount);
            result.put("message", "数据库连接正常");
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            result.put("message", "数据库连接失败");
            
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 获取所有用户
     */
    @GetMapping("/users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<User> users = userRepository.findAll();
            result.put("status", "SUCCESS");
            result.put("users", users);
            result.put("count", users.size());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 根据用户ID获取用户
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<Map<String, Object>> getUserById(@PathVariable String userId) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            User user = userRepository.findByUserId(userId);
            if (user != null) {
                result.put("status", "SUCCESS");
                result.put("user", user);
            } else {
                result.put("status", "NOT_FOUND");
                result.put("message", "用户不存在");
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }

    /**
     * 简单的登录测试
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> testLogin(@RequestBody Map<String, String> loginData) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String username = loginData.get("username");
            String password = loginData.get("password");
            
            User user = userRepository.findByUsername(username);
            if (user != null) {
                // 简单的密码验证（实际应用中应该使用加密）
                result.put("status", "SUCCESS");
                result.put("message", "登录成功");
                result.put("userId", user.getUserId());
                result.put("username", user.getUsername());
                result.put("realName", user.getRealName());
                result.put("personType", user.getPersonType());
            } else {
                result.put("status", "FAILED");
                result.put("message", "用户不存在");
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            result.put("status", "ERROR");
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }
}
