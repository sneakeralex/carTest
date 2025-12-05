package com.carservice.repository;

import com.carservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户Repository接口
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    /**
     * 根据用户名查找用户
     * @param username 用户名
     * @return 用户对象
     */
    User findByUsername(String username);

    /**
     * 根据用户ID查找用户
     * @param userId 用户ID
     * @return 用户对象
     */
    User findByUserId(String userId);

    /**
     * 根据手机号查找用户
     * @param phone 手机号
     * @return 用户对象
     */
    User findByPhone(String phone);

    /**
     * 根据UnionID查找用户
     * @param unionid UnionID
     * @return 用户对象
     */
    Optional<User> findByUnionid(String unionid);
}