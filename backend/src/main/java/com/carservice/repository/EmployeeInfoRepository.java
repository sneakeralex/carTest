package com.carservice.repository;

import com.carservice.entity.EmployeeInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 员工信息Repository接口
 */
@Repository
public interface EmployeeInfoRepository extends JpaRepository<EmployeeInfo, Long> {
    
    /**
     * 根据员工ID查找员工
     * @param employeeId 员工ID
     * @return 员工对象
     */
    EmployeeInfo findByEmployeeId(String employeeId);
    
    /**
     * 根据用户ID查找员工
     * @param userId 用户ID
     * @return 员工对象
     */
    EmployeeInfo findByUserId(String userId);
    
    /**
     * 根据工号查找员工
     * @param employeeNo 工号
     * @return 员工对象
     */
    EmployeeInfo findByEmployeeNo(String employeeNo);
    
    /**
     * 根据身份证号查找员工
     * @param idCardNo 身份证号
     * @return 员工对象
     */
    EmployeeInfo findByIdCardNo(String idCardNo);
    
    /**
     * 根据部门查找员工列表
     * @param department 部门
     * @return 员工列表
     */
    List<EmployeeInfo> findByDepartment(String department);
    
    /**
     * 根据职位查找员工列表
     * @param position 职位
     * @return 员工列表
     */
    List<EmployeeInfo> findByPosition(String position);
    
    /**
     * 根据员工状态查找员工列表
     * @param status 员工状态
     * @return 员工列表
     */
    List<EmployeeInfo> findByStatus(EmployeeInfo.EmployeeStatus status);
    
    /**
     * 根据入职日期范围查找员工
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 员工列表
     */
    List<EmployeeInfo> findByEntryDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * 根据部门和状态查找员工
     * @param department 部门
     * @param status 员工状态
     * @return 员工列表
     */
    List<EmployeeInfo> findByDepartmentAndStatus(String department, EmployeeInfo.EmployeeStatus status);
    
    /**
     * 查找所有在职员工
     * @return 在职员工列表
     */
    @Query("SELECT e FROM EmployeeInfo e WHERE e.status = 'ACTIVE' ORDER BY e.department, e.employeeNo")
    List<EmployeeInfo> findAllActiveEmployees();
    
    /**
     * 统计部门员工数量
     * @param department 部门
     * @return 员工数量
     */
    @Query("SELECT COUNT(e) FROM EmployeeInfo e WHERE e.department = :department AND e.status = 'ACTIVE'")
    long countActiveEmployeesByDepartment(@Param("department") String department);
    
    /**
     * 查找即将离职的员工（离职日期在指定日期之前）
     * @param date 指定日期
     * @return 员工列表
     */
    List<EmployeeInfo> findByDepartureDateLessThanEqualAndStatus(LocalDate date, EmployeeInfo.EmployeeStatus status);
}
