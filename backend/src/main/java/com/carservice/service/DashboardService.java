package com.carservice.service;

import com.carservice.controller.DashboardController.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 仪表板服务接口
 */
public interface DashboardService {
    
    /**
     * 获取用户仪表板数据
     * @param userId 用户ID
     * @return 用户仪表板数据
     */
    UserDashboardDTO getUserDashboard(String userId);
    
    /**
     * 获取用户统计信息
     * @param userId 用户ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 用户统计信息
     */
    UserStatsDTO getUserStats(String userId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 获取最近活动
     * @param userId 用户ID
     * @param limit 数量限制
     * @return 最近活动列表
     */
    List<ActivityDTO> getRecentActivities(String userId, int limit);
    
    /**
     * 获取待办事项
     * @param userId 用户ID
     * @return 待办事项列表
     */
    List<TodoDTO> getUserTodos(String userId);
    
    /**
     * 获取快捷操作
     * @param userId 用户ID
     * @return 快捷操作列表
     */
    List<QuickActionDTO> getQuickActions(String userId);
    
    /**
     * 获取系统公告
     * @param limit 数量限制
     * @return 系统公告列表
     */
    List<AnnouncementDTO> getAnnouncements(int limit);
    
    /**
     * 获取天气信息
     * @param location 位置
     * @return 天气信息
     */
    WeatherInfoDTO getWeatherInfo(String location);
}
