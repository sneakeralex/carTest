package com.carservice.repository;

import com.carservice.entity.TestTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 试验任务Repository接口
 */
@Repository
public interface TestTaskRepository extends JpaRepository<TestTask, Long> {
    
    /**
     * 根据任务ID查找任务
     * @param taskId 任务ID
     * @return 任务对象
     */
    TestTask findByTaskId(String taskId);
    
    /**
     * 根据任务编号查找任务
     * @param taskNo 任务编号
     * @return 任务对象
     */
    TestTask findByTaskNo(String taskNo);
    
    /**
     * 根据合同编号查找任务列表
     * @param contractNo 合同编号
     * @return 任务列表
     */
    List<TestTask> findByContractNo(String contractNo);
    
    /**
     * 根据授权人查找任务列表
     * @param authorizerId 授权人ID
     * @return 任务列表
     */
    List<TestTask> findByAuthorizerId(String authorizerId);
    
    /**
     * 根据任务状态查找任务列表
     * @param status 任务状态
     * @return 任务列表
     */
    List<TestTask> findByStatus(TestTask.TestTaskStatus status);
    
    /**
     * 根据计划开始日期范围查找任务
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 任务列表
     */
    List<TestTask> findByPlannedStartDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * 根据计划结束日期范围查找任务
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 任务列表
     */
    List<TestTask> findByPlannedEndDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * 查找进行中的任务
     * @return 进行中的任务列表
     */
    @Query("SELECT tt FROM TestTask tt WHERE tt.status = 'IN_PROGRESS' ORDER BY tt.plannedEndDate ASC")
    List<TestTask> findInProgressTasks();
    
    /**
     * 查找即将到期的任务（计划结束日期在指定日期之前）
     * @param date 指定日期
     * @return 任务列表
     */
    List<TestTask> findByPlannedEndDateLessThanEqualAndStatus(LocalDateTime date, TestTask.TestTaskStatus status);
    
    /**
     * 根据授权人和状态查找任务
     * @param authorizerId 授权人ID
     * @param status 任务状态
     * @return 任务列表
     */
    List<TestTask> findByAuthorizerIdAndStatus(String authorizerId, TestTask.TestTaskStatus status);
    
    /**
     * 统计指定状态的任务数量
     * @param status 任务状态
     * @return 任务数量
     */
    @Query("SELECT COUNT(tt) FROM TestTask tt WHERE tt.status = :status")
    long countByStatus(@Param("status") TestTask.TestTaskStatus status);
    
    /**
     * 查找超期未完成的任务
     * @param currentDate 当前日期
     * @return 超期任务列表
     */
    @Query("SELECT tt FROM TestTask tt WHERE tt.plannedEndDate < :currentDate AND tt.status NOT IN ('COMPLETED', 'CANCELLED')")
    List<TestTask> findOverdueTasks(@Param("currentDate") LocalDateTime currentDate);
}
