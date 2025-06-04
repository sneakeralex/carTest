package com.carservice.service;

import com.carservice.dto.booking.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 预约服务接口
 */
public interface BookingService {
    
    /**
     * 获取场地列表
     * @param siteType 场地类型
     * @param status 场地状态
     * @param pageable 分页信息
     * @return 场地列表
     */
    Page<TestSiteDTO> getSites(String siteType, String status, Pageable pageable);
    
    /**
     * 获取场地详情
     * @param siteId 场地ID
     * @return 场地详情
     */
    TestSiteDTO getSiteDetail(String siteId);
    
    /**
     * 获取场地排期
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 排期列表
     */
    List<SiteScheduleDTO> getSiteSchedules(String siteId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 检查场地可用性
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 是否可用
     */
    Boolean checkSiteAvailability(String siteId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 创建预约
     * @param bookingDTO 预约信息
     * @return 预约详情
     */
    SiteBookingDTO createBooking(SiteBookingDTO bookingDTO);
    
    /**
     * 获取用户预约列表
     * @param userId 用户ID
     * @param status 预约状态
     * @param pageable 分页信息
     * @return 预约列表
     */
    Page<SiteBookingDTO> getUserBookings(String userId, String status, Pageable pageable);
    
    /**
     * 获取预约详情
     * @param bookingId 预约ID
     * @return 预约详情
     */
    SiteBookingDTO getBookingDetail(String bookingId);
    
    /**
     * 更新预约
     * @param bookingId 预约ID
     * @param bookingDTO 预约信息
     * @return 更新后的预约详情
     */
    SiteBookingDTO updateBooking(String bookingId, SiteBookingDTO bookingDTO);
    
    /**
     * 取消预约
     * @param bookingId 预约ID
     * @param reason 取消原因
     */
    void cancelBooking(String bookingId, String reason);
    
    /**
     * 获取天气信息
     * @param siteId 场地ID
     * @param date 日期
     * @return 天气信息
     */
    WeatherRecordDTO getWeatherInfo(String siteId, LocalDateTime date);
    
    /**
     * 获取天气历史记录
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 天气记录列表
     */
    List<WeatherRecordDTO> getWeatherHistory(String siteId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 检查天气适宜性
     * @param siteId 场地ID
     * @param testTime 测试时间
     * @return 是否适宜测试
     */
    Boolean checkWeatherSuitability(String siteId, LocalDateTime testTime);
}
