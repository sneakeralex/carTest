package com.carservice.repository;

import com.carservice.entity.BookingReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 预约审批Repository接口
 */
@Repository
public interface BookingReviewRepository extends JpaRepository<BookingReview, Long> {
    
    /**
     * 根据审批ID查找审批记录
     * @param reviewId 审批ID
     * @return 审批记录对象
     */
    BookingReview findByReviewId(String reviewId);
    
    /**
     * 根据预约ID查找审批记录列表
     * @param bookingId 预约ID
     * @return 审批记录列表
     */
    List<BookingReview> findByBookingId(String bookingId);
    
    /**
     * 根据审批人ID查找审批记录列表
     * @param reviewerId 审批人ID
     * @return 审批记录列表
     */
    List<BookingReview> findByReviewerId(String reviewerId);
    
    /**
     * 根据审批状态查找审批记录列表
     * @param status 审批状态
     * @return 审批记录列表
     */
    List<BookingReview> findByStatus(BookingReview.ReviewStatus status);
    
    /**
     * 根据审批时间范围查找审批记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 审批记录列表
     */
    List<BookingReview> findByReviewTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据优先级查找审批记录列表
     * @param priority 优先级
     * @return 审批记录列表
     */
    List<BookingReview> findByPriority(Integer priority);
    
    /**
     * 根据是否需要后续跟进查找审批记录
     * @param needsFollowUp 是否需要后续跟进
     * @return 审批记录列表
     */
    List<BookingReview> findByNeedsFollowUp(Boolean needsFollowUp);
    
    /**
     * 根据审批人和状态查找审批记录
     * @param reviewerId 审批人ID
     * @param status 审批状态
     * @return 审批记录列表
     */
    List<BookingReview> findByReviewerIdAndStatus(String reviewerId, BookingReview.ReviewStatus status);
    
    /**
     * 查找待审批的记录
     * @return 待审批记录列表
     */
    @Query("SELECT br FROM BookingReview br WHERE br.status = 'PENDING' ORDER BY br.priority DESC, br.reviewTime ASC")
    List<BookingReview> findPendingReviews();
    
    /**
     * 根据审批人查找待审批的记录
     * @param reviewerId 审批人ID
     * @return 待审批记录列表
     */
    @Query("SELECT br FROM BookingReview br WHERE br.reviewerId = :reviewerId AND br.status = 'PENDING' ORDER BY br.priority DESC, br.reviewTime ASC")
    List<BookingReview> findPendingReviewsByReviewerId(@Param("reviewerId") String reviewerId);
    
    /**
     * 查找需要后续跟进的审批记录
     * @return 需要跟进的审批记录列表
     */
    @Query("SELECT br FROM BookingReview br WHERE br.needsFollowUp = true ORDER BY br.reviewTime DESC")
    List<BookingReview> findReviewsNeedingFollowUp();
    
    /**
     * 统计指定状态的审批记录数量
     * @param status 审批状态
     * @return 审批记录数量
     */
    @Query("SELECT COUNT(br) FROM BookingReview br WHERE br.status = :status")
    long countByStatus(@Param("status") BookingReview.ReviewStatus status);
    
    /**
     * 统计指定审批人的审批记录数量
     * @param reviewerId 审批人ID
     * @return 审批记录数量
     */
    @Query("SELECT COUNT(br) FROM BookingReview br WHERE br.reviewerId = :reviewerId")
    long countByReviewerId(@Param("reviewerId") String reviewerId);
    
    /**
     * 查找被驳回的审批记录
     * @return 被驳回的审批记录列表
     */
    @Query("SELECT br FROM BookingReview br WHERE br.status = 'REJECTED' ORDER BY br.reviewTime DESC")
    List<BookingReview> findRejectedReviews();
}
