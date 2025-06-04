package com.carservice.repository;

import com.carservice.entity.BookingChange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 预约变更Repository接口
 */
@Repository
public interface BookingChangeRepository extends JpaRepository<BookingChange, Long> {
    
    /**
     * 根据变更ID查找变更记录
     * @param changeId 变更ID
     * @return 变更记录对象
     */
    BookingChange findByChangeId(String changeId);
    
    /**
     * 根据预约ID查找变更记录列表
     * @param bookingId 预约ID
     * @return 变更记录列表
     */
    List<BookingChange> findByBookingId(String bookingId);
    
    /**
     * 根据审批记录ID查找变更记录
     * @param reviewId 审批记录ID
     * @return 变更记录对象
     */
    BookingChange findByReviewId(String reviewId);
    
    /**
     * 根据申请人ID查找变更记录列表
     * @param requesterId 申请人ID
     * @return 变更记录列表
     */
    List<BookingChange> findByRequesterId(String requesterId);
    
    /**
     * 根据审批人ID查找变更记录列表
     * @param approverId 审批人ID
     * @return 变更记录列表
     */
    List<BookingChange> findByApproverId(String approverId);
    
    /**
     * 根据变更类型查找变更记录列表
     * @param changeType 变更类型
     * @return 变更记录列表
     */
    List<BookingChange> findByChangeType(BookingChange.ChangeType changeType);
    
    /**
     * 根据变更状态查找变更记录列表
     * @param status 变更状态
     * @return 变更记录列表
     */
    List<BookingChange> findByStatus(BookingChange.ChangeStatus status);
    
    /**
     * 根据申请时间范围查找变更记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 变更记录列表
     */
    List<BookingChange> findByRequestTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据审批时间范围查找变更记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 变更记录列表
     */
    List<BookingChange> findByApprovalTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据申请人和状态查找变更记录
     * @param requesterId 申请人ID
     * @param status 变更状态
     * @return 变更记录列表
     */
    List<BookingChange> findByRequesterIdAndStatus(String requesterId, BookingChange.ChangeStatus status);
    
    /**
     * 查找待审批的变更记录
     * @return 待审批变更记录列表
     */
    @Query("SELECT bc FROM BookingChange bc WHERE bc.status = 'PENDING' ORDER BY bc.requestTime ASC")
    List<BookingChange> findPendingChanges();
    
    /**
     * 根据审批人查找待审批的变更记录
     * @param approverId 审批人ID
     * @return 待审批变更记录列表
     */
    @Query("SELECT bc FROM BookingChange bc WHERE bc.approverId = :approverId AND bc.status = 'PENDING' ORDER BY bc.requestTime ASC")
    List<BookingChange> findPendingChangesByApproverId(@Param("approverId") String approverId);
    
    /**
     * 统计指定状态的变更记录数量
     * @param status 变更状态
     * @return 变更记录数量
     */
    @Query("SELECT COUNT(bc) FROM BookingChange bc WHERE bc.status = :status")
    long countByStatus(@Param("status") BookingChange.ChangeStatus status);
    
    /**
     * 统计指定变更类型的记录数量
     * @param changeType 变更类型
     * @return 变更记录数量
     */
    @Query("SELECT COUNT(bc) FROM BookingChange bc WHERE bc.changeType = :changeType")
    long countByChangeType(@Param("changeType") BookingChange.ChangeType changeType);
}
