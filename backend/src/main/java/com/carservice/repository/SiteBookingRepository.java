package com.carservice.repository;

import com.carservice.entity.SiteBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 场地预约Repository接口
 */
@Repository
public interface SiteBookingRepository extends JpaRepository<SiteBooking, Long> {
    
    /**
     * 根据预约ID查找预约
     * @param bookingId 预约ID
     * @return 预约对象
     */
    SiteBooking findByBookingId(String bookingId);
    
    /**
     * 根据场地ID查找预约列表
     * @param siteId 场地ID
     * @return 预约列表
     */
    List<SiteBooking> findBySiteId(String siteId);
    
    /**
     * 根据用户ID查找预约列表
     * @param userId 用户ID
     * @return 预约列表
     */
    List<SiteBooking> findByUserId(String userId);
    
    /**
     * 根据车辆ID查找预约列表
     * @param vehicleId 车辆ID
     * @return 预约列表
     */
    List<SiteBooking> findByVehicleId(String vehicleId);
    
    /**
     * 根据预约状态查找预约列表
     * @param status 预约状态
     * @return 预约列表
     */
    List<SiteBooking> findByStatus(SiteBooking.BookingStatus status);
    
    /**
     * 根据试验内容ID查找预约列表
     * @param testContentId 试验内容ID
     * @return 预约列表
     */
    List<SiteBooking> findByTestContentId(String testContentId);
    
    /**
     * 根据排期ID查找预约列表
     * @param scheduleId 排期ID
     * @return 预约列表
     */
    List<SiteBooking> findByScheduleId(String scheduleId);
    
    /**
     * 根据开始时间范围查找预约
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 预约列表
     */
    List<SiteBooking> findByStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据场地ID和时间范围查找预约
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 预约列表
     */
    @Query("SELECT sb FROM SiteBooking sb WHERE sb.siteId = :siteId AND " +
           "((sb.startTime <= :endTime AND sb.endTime >= :startTime)) AND " +
           "sb.status NOT IN ('CANCELLED')")
    List<SiteBooking> findConflictingBookings(@Param("siteId") String siteId, 
                                             @Param("startTime") LocalDateTime startTime, 
                                             @Param("endTime") LocalDateTime endTime);
    
    /**
     * 根据用户ID和状态查找预约
     * @param userId 用户ID
     * @param status 预约状态
     * @return 预约列表
     */
    List<SiteBooking> findByUserIdAndStatus(String userId, SiteBooking.BookingStatus status);
    
    /**
     * 查找今日预约
     * @param startOfDay 今日开始时间
     * @param endOfDay 今日结束时间
     * @return 今日预约列表
     */
    @Query("SELECT sb FROM SiteBooking sb WHERE sb.startTime >= :startOfDay AND sb.startTime < :endOfDay ORDER BY sb.startTime ASC")
    List<SiteBooking> findTodayBookings(@Param("startOfDay") LocalDateTime startOfDay, 
                                       @Param("endOfDay") LocalDateTime endOfDay);
    
    /**
     * 统计指定状态的预约数量
     * @param status 预约状态
     * @return 预约数量
     */
    @Query("SELECT COUNT(sb) FROM SiteBooking sb WHERE sb.status = :status")
    long countByStatus(@Param("status") SiteBooking.BookingStatus status);
    
    /**
     * 查找即将开始的预约（开始时间在指定时间范围内）
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 预约列表
     */
    List<SiteBooking> findByStartTimeBetweenAndStatus(LocalDateTime startTime, LocalDateTime endTime, SiteBooking.BookingStatus status);
}
