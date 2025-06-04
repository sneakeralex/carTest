package com.carservice.repository;

import com.carservice.entity.TestContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 试验内容Repository接口
 */
@Repository
public interface TestContentRepository extends JpaRepository<TestContent, Long> {
    
    /**
     * 根据内容ID查找试验内容
     * @param contentId 内容ID
     * @return 试验内容对象
     */
    TestContent findByContentId(String contentId);
    
    /**
     * 根据测试项目查找试验内容列表
     * @param testItem 测试项目
     * @return 试验内容列表
     */
    List<TestContent> findByTestItemContainingIgnoreCase(String testItem);
    
    /**
     * 根据测试状态查找试验内容列表
     * @param status 测试状态
     * @return 试验内容列表
     */
    List<TestContent> findByStatus(TestContent.TestStatus status);
    
    /**
     * 根据计划开始时间范围查找试验内容
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 试验内容列表
     */
    List<TestContent> findByPlannedStartTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据计划结束时间范围查找试验内容
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 试验内容列表
     */
    List<TestContent> findByPlannedEndTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 查找进行中的试验内容
     * @return 进行中的试验内容列表
     */
    @Query("SELECT tc FROM TestContent tc WHERE tc.status = 'IN_PROGRESS' ORDER BY tc.plannedEndTime ASC")
    List<TestContent> findInProgressTests();
    
    /**
     * 查找即将开始的试验内容（计划开始时间在指定时间范围内）
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 试验内容列表
     */
    @Query("SELECT tc FROM TestContent tc WHERE tc.plannedStartTime BETWEEN :startTime AND :endTime AND tc.status = 'NOT_STARTED'")
    List<TestContent> findUpcomingTests(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);
    
    /**
     * 统计指定状态的试验内容数量
     * @param status 测试状态
     * @return 试验内容数量
     */
    @Query("SELECT COUNT(tc) FROM TestContent tc WHERE tc.status = :status")
    long countByStatus(@Param("status") TestContent.TestStatus status);
    
    /**
     * 查找超期未完成的试验内容
     * @param currentTime 当前时间
     * @return 超期试验内容列表
     */
    @Query("SELECT tc FROM TestContent tc WHERE tc.plannedEndTime < :currentTime AND tc.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<TestContent> findOverdueTests(@Param("currentTime") LocalDateTime currentTime);
    
    /**
     * 根据测试方法查找试验内容
     * @param testMethod 测试方法
     * @return 试验内容列表
     */
    List<TestContent> findByTestMethodContainingIgnoreCase(String testMethod);
    
    /**
     * 查找已完成的试验内容，按完成时间排序
     * @return 已完成的试验内容列表
     */
    @Query("SELECT tc FROM TestContent tc WHERE tc.status = 'COMPLETED' ORDER BY tc.actualEndTime DESC")
    List<TestContent> findCompletedTestsOrderByEndTime();
}
