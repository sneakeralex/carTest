package com.carservice.repository;

import com.carservice.entity.TestProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 试验项目Repository接口
 */
@Repository
public interface TestProjectRepository extends JpaRepository<TestProject, Long> {
    
    /**
     * 根据项目ID查找项目
     * @param projectId 项目ID
     * @return 项目对象
     */
    TestProject findByProjectId(String projectId);
    
    /**
     * 根据项目名称查找项目
     * @param projectName 项目名称
     * @return 项目对象
     */
    TestProject findByProjectName(String projectName);
    
    /**
     * 根据项目编号查找项目
     * @param projectCode 项目编号
     * @return 项目对象
     */
    TestProject findByProjectCode(String projectCode);
    
    /**
     * 根据试验任务ID查找项目列表
     * @param testTaskId 试验任务ID
     * @return 项目列表
     */
    List<TestProject> findByTestTaskId(String testTaskId);
    
    /**
     * 根据项目状态查找项目列表
     * @param status 项目状态
     * @return 项目列表
     */
    List<TestProject> findByStatus(TestProject.ProjectStatus status);
    
    /**
     * 根据试验任务ID和状态查找项目
     * @param testTaskId 试验任务ID
     * @param status 项目状态
     * @return 项目列表
     */
    List<TestProject> findByTestTaskIdAndStatus(String testTaskId, TestProject.ProjectStatus status);
    
    /**
     * 根据项目名称模糊查询
     * @param projectName 项目名称关键字
     * @return 项目列表
     */
    List<TestProject> findByProjectNameContainingIgnoreCase(String projectName);
    
    /**
     * 查找进行中的项目
     * @return 进行中的项目列表
     */
    @Query("SELECT tp FROM TestProject tp WHERE tp.status = 'IN_PROGRESS' ORDER BY tp.projectName ASC")
    List<TestProject> findInProgressProjects();
    
    /**
     * 统计指定状态的项目数量
     * @param status 项目状态
     * @return 项目数量
     */
    @Query("SELECT COUNT(tp) FROM TestProject tp WHERE tp.status = :status")
    long countByStatus(@Param("status") TestProject.ProjectStatus status);
    
    /**
     * 根据试验任务ID统计项目数量
     * @param testTaskId 试验任务ID
     * @return 项目数量
     */
    @Query("SELECT COUNT(tp) FROM TestProject tp WHERE tp.testTaskId = :testTaskId")
    long countByTestTaskId(@Param("testTaskId") String testTaskId);
    
    /**
     * 查找所有项目，按项目名称排序
     * @return 所有项目列表
     */
    List<TestProject> findAllByOrderByProjectNameAsc();
}
