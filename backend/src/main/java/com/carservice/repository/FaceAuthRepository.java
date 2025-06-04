package com.carservice.repository;

import com.carservice.entity.FaceAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 人脸认证Repository接口
 */
@Repository
public interface FaceAuthRepository extends JpaRepository<FaceAuth, Long> {
    
    /**
     * 根据认证ID查找认证记录
     * @param authId 认证ID
     * @return 认证记录对象
     */
    FaceAuth findByAuthId(String authId);
    
    /**
     * 根据用户ID查找认证记录
     * @param userId 用户ID
     * @return 认证记录对象
     */
    FaceAuth findByUserId(String userId);
    
    /**
     * 根据认证状态查找认证记录列表
     * @param status 认证状态
     * @return 认证记录列表
     */
    List<FaceAuth> findByStatus(FaceAuth.AuthStatus status);
    
    /**
     * 根据是否启用查找认证记录列表
     * @param isActive 是否启用
     * @return 认证记录列表
     */
    List<FaceAuth> findByIsActive(Boolean isActive);
    
    /**
     * 根据注册时间范围查找认证记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 认证记录列表
     */
    List<FaceAuth> findByRegistrationTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据最后验证时间范围查找认证记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 认证记录列表
     */
    List<FaceAuth> findByLastVerifyTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 查找已验证且启用的认证记录
     * @return 已验证且启用的认证记录列表
     */
    @Query("SELECT fa FROM FaceAuth fa WHERE fa.status = 'VERIFIED' AND fa.isActive = true ORDER BY fa.registrationTime DESC")
    List<FaceAuth> findVerifiedAndActiveAuths();
    
    /**
     * 查找待认证的记录
     * @return 待认证记录列表
     */
    @Query("SELECT fa FROM FaceAuth fa WHERE fa.status = 'PENDING' ORDER BY fa.registrationTime ASC")
    List<FaceAuth> findPendingAuths();
    
    /**
     * 统计指定状态的认证记录数量
     * @param status 认证状态
     * @return 认证记录数量
     */
    @Query("SELECT COUNT(fa) FROM FaceAuth fa WHERE fa.status = :status")
    long countByStatus(@Param("status") FaceAuth.AuthStatus status);
    
    /**
     * 查找过期的认证记录
     * @return 过期认证记录列表
     */
    @Query("SELECT fa FROM FaceAuth fa WHERE fa.status = 'EXPIRED' ORDER BY fa.lastUpdateTime DESC")
    List<FaceAuth> findExpiredAuths();
    
    /**
     * 根据用户ID和状态查找认证记录
     * @param userId 用户ID
     * @param status 认证状态
     * @return 认证记录对象
     */
    FaceAuth findByUserIdAndStatus(String userId, FaceAuth.AuthStatus status);
}
