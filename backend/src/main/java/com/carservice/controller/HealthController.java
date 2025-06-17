package com.carservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    /**
     * 健康检查
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");
        result.put("timestamp", System.currentTimeMillis());
        
        // 检查数据库连接
        try (Connection connection = dataSource.getConnection()) {
            result.put("database", "UP");
            result.put("databaseUrl", connection.getMetaData().getURL());
        } catch (SQLException e) {
            result.put("database", "DOWN");
            result.put("databaseError", e.getMessage());
        }
        
        return ResponseEntity.ok(result);
    }

    /**
     * 数据库连接测试
     */
    @GetMapping("/db")
    public ResponseEntity<Map<String, Object>> databaseHealth() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            result.put("status", "UP");
            result.put("url", connection.getMetaData().getURL());
            result.put("driverName", connection.getMetaData().getDriverName());
            result.put("driverVersion", connection.getMetaData().getDriverVersion());
            result.put("databaseProductName", connection.getMetaData().getDatabaseProductName());
            result.put("databaseProductVersion", connection.getMetaData().getDatabaseProductVersion());
            
            // 测试简单查询
            var statement = connection.createStatement();
            var resultSet = statement.executeQuery("SELECT COUNT(*) as count FROM user");
            if (resultSet.next()) {
                result.put("userCount", resultSet.getInt("count"));
            }
            
        } catch (SQLException e) {
            result.put("status", "DOWN");
            result.put("error", e.getMessage());
            return ResponseEntity.status(500).body(result);
        }
        
        return ResponseEntity.ok(result);
    }
}
