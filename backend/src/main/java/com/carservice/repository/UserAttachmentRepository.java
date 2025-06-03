package com.carservice.repository;

import com.carservice.entity.UserAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserAttachmentRepository extends JpaRepository<UserAttachment, Long> {
    List<UserAttachment> findByUserId(Long userId);
}
