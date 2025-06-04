package com.carservice.repository;

import com.carservice.entity.SiteSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 场地排期Repository接口
 */
@Repository
public interface SiteScheduleRepository extends JpaRepository<SiteSchedule, Long> {
    
    /**
     * 根据排期ID查找排期
     * @param scheduleId 排期ID
     * @return 排期对象
     */
    SiteSchedule findByScheduleId(String scheduleId);
    
    /**
     * 根据场地ID查找排期列表
     * @param siteId 场地ID
     * @return 排期列表
     */
    List<SiteSchedule> findBySiteId(String siteId);
    
    /**
     * 根据排期类型查找排期列表
     * @param scheduleType 排期类型
     * @return 排期列表
     */
    List<SiteSchedule> findByScheduleType(SiteSchedule.ScheduleType scheduleType);
    
    /**
     * 根据是否可预约查找排期列表
     * @param isAvailable 是否可预约
     * @return 排期列表
     */
    List<SiteSchedule> findByIsAvailable(Boolean isAvailable);
    
    /**
     * 根据场地ID和时间范围查找排期
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 排期列表
     */
    @Query("SELECT ss FROM SiteSchedule ss WHERE ss.siteId = :siteId AND " +
           "((ss.startTime <= :endTime AND ss.endTime >= :startTime))")
    List<SiteSchedule> findBySiteIdAndTimeRange(@Param("siteId") String siteId, 
                                               @Param("startTime") LocalDateTime startTime, 
                                               @Param("endTime") LocalDateTime endTime);
    
    /**
     * 根据场地ID和是否可预约查找排期
     * @param siteId 场地ID
     * @param isAvailable 是否可预约
     * @return 排期列表
     */
    List<SiteSchedule> findBySiteIdAndIsAvailable(String siteId, Boolean isAvailable);
    
    /**
     * 查找指定时间范围内的可用排期
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 可用排期列表
     */
    @Query("SELECT ss FROM SiteSchedule ss WHERE ss.isAvailable = true AND " +
           "ss.startTime >= :startTime AND ss.endTime <= :endTime ORDER BY ss.startTime ASC")
    List<SiteSchedule> findAvailableSchedulesInTimeRange(@Param("startTime") LocalDateTime startTime, 
                                                         @Param("endTime") LocalDateTime endTime);
    
    /**
     * 根据场地ID、时间范围和可用性查找排期
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param isAvailable 是否可预约
     * @return 排期列表
     */
    @Query("SELECT ss FROM SiteSchedule ss WHERE ss.siteId = :siteId AND ss.isAvailable = :isAvailable AND " +
           "((ss.startTime <= :endTime AND ss.endTime >= :startTime)) ORDER BY ss.startTime ASC")
    List<SiteSchedule> findBySiteIdAndTimeRangeAndAvailability(@Param("siteId") String siteId, 
                                                              @Param("startTime") LocalDateTime startTime, 
                                                              @Param("endTime") LocalDateTime endTime,
                                                              @Param("isAvailable") Boolean isAvailable);
    
    /**
     * 查找今日排期
     * @param startOfDay 今日开始时间
     * @param endOfDay 今日结束时间
     * @return 今日排期列表
     */
    @Query("SELECT ss FROM SiteSchedule ss WHERE ss.startTime >= :startOfDay AND ss.startTime < :endOfDay ORDER BY ss.startTime ASC")
    List<SiteSchedule> findTodaySchedules(@Param("startOfDay") LocalDateTime startOfDay, 
                                         @Param("endOfDay") LocalDateTime endOfDay);
    
    /**
     * 统计可用排期数量
     * @param siteId 场地ID
     * @return 可用排期数量
     */
    @Query("SELECT COUNT(ss) FROM SiteSchedule ss WHERE ss.siteId = :siteId AND ss.isAvailable = true")
    long countAvailableSchedulesBySiteId(@Param("siteId") String siteId);
    
    /**
     * 查找维护排期
     * @return 维护排期列表
     */
    List<SiteSchedule> findByScheduleTypeOrderByStartTimeAsc(SiteSchedule.ScheduleType scheduleType);
}
