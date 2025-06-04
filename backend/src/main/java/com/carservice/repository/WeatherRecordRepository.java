package com.carservice.repository;

import com.carservice.entity.WeatherRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 天气记录Repository接口
 */
@Repository
public interface WeatherRecordRepository extends JpaRepository<WeatherRecord, Long> {
    
    /**
     * 根据天气ID查找天气记录
     * @param weatherId 天气ID
     * @return 天气记录对象
     */
    WeatherRecord findByWeatherId(String weatherId);
    
    /**
     * 根据场地ID查找天气记录列表
     * @param siteId 场地ID
     * @return 天气记录列表
     */
    List<WeatherRecord> findBySiteId(String siteId);
    
    /**
     * 根据天气类型查找天气记录列表
     * @param weatherType 天气类型
     * @return 天气记录列表
     */
    List<WeatherRecord> findByWeatherType(WeatherRecord.WeatherType weatherType);
    
    /**
     * 根据是否适合测试查找天气记录
     * @param isSuitable 是否适合测试
     * @return 天气记录列表
     */
    List<WeatherRecord> findByIsSuitable(Boolean isSuitable);
    
    /**
     * 根据记录时间范围查找天气记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 天气记录列表
     */
    List<WeatherRecord> findByRecordTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据场地ID和时间范围查找天气记录
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 天气记录列表
     */
    List<WeatherRecord> findBySiteIdAndRecordTimeBetween(String siteId, LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据温度范围查找天气记录
     * @param minTemp 最低温度
     * @param maxTemp 最高温度
     * @return 天气记录列表
     */
    List<WeatherRecord> findByTemperatureBetween(BigDecimal minTemp, BigDecimal maxTemp);
    
    /**
     * 根据湿度范围查找天气记录
     * @param minHumidity 最低湿度
     * @param maxHumidity 最高湿度
     * @return 天气记录列表
     */
    List<WeatherRecord> findByHumidityBetween(BigDecimal minHumidity, BigDecimal maxHumidity);
    
    /**
     * 根据风速范围查找天气记录
     * @param minWindSpeed 最低风速
     * @param maxWindSpeed 最高风速
     * @return 天气记录列表
     */
    List<WeatherRecord> findByWindSpeedBetween(BigDecimal minWindSpeed, BigDecimal maxWindSpeed);
    
    /**
     * 查找最新的天气记录
     * @param siteId 场地ID
     * @return 最新天气记录
     */
    @Query("SELECT wr FROM WeatherRecord wr WHERE wr.siteId = :siteId ORDER BY wr.recordTime DESC LIMIT 1")
    WeatherRecord findLatestBySiteId(@Param("siteId") String siteId);
    
    /**
     * 查找适合测试的天气记录
     * @param siteId 场地ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 适合测试的天气记录列表
     */
    @Query("SELECT wr FROM WeatherRecord wr WHERE wr.siteId = :siteId AND wr.recordTime BETWEEN :startTime AND :endTime AND wr.isSuitable = true ORDER BY wr.recordTime ASC")
    List<WeatherRecord> findSuitableWeatherInTimeRange(@Param("siteId") String siteId, 
                                                       @Param("startTime") LocalDateTime startTime, 
                                                       @Param("endTime") LocalDateTime endTime);
    
    /**
     * 统计指定天气类型的记录数量
     * @param weatherType 天气类型
     * @return 记录数量
     */
    @Query("SELECT COUNT(wr) FROM WeatherRecord wr WHERE wr.weatherType = :weatherType")
    long countByWeatherType(@Param("weatherType") WeatherRecord.WeatherType weatherType);
    
    /**
     * 查找恶劣天气记录
     * @param siteId 场地ID
     * @param days 天数
     * @return 恶劣天气记录列表
     */
    @Query("SELECT wr FROM WeatherRecord wr WHERE wr.siteId = :siteId AND wr.recordTime >= :startTime AND wr.isSuitable = false ORDER BY wr.recordTime DESC")
    List<WeatherRecord> findBadWeatherInRecentDays(@Param("siteId") String siteId, @Param("startTime") LocalDateTime startTime);
}
