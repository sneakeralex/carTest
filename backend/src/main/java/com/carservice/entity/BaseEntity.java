package com.carservice.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.Where;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
@Where(clause = "deleted = 0")
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @CreatedBy
    @Column(name = "created_by")
    private String createdBy;
    
    @CreatedDate
    @Column(name = "created_time", nullable = false, updatable = false)
    private LocalDateTime createdTime;
    
    @LastModifiedBy
    @Column(name = "updated_by")
    private String updatedBy;
    
    @LastModifiedDate
    @Column(name = "updated_time")
    private LocalDateTime updatedTime;
    
    @Column(name = "deleted", nullable = false)
    private Integer deleted = 0;
    
    @Version
    @Column(name = "version")
    private Long version;
    
    @PrePersist
    protected void onCreate() {
        if (createdTime == null) {
            createdTime = LocalDateTime.now();
        }
        if (updatedTime == null) {
            updatedTime = createdTime;
        }
        setCurrentAuditor();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedTime = LocalDateTime.now();
        setCurrentAuditor();
    }

    private void setCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            String currentUsername = authentication.getName();
            if (createdBy == null) {
                createdBy = currentUsername;
            }
            updatedBy = currentUsername;
        }
    }

    /**
     * 软删除
     */
    public void delete() {
        this.deleted = 1;
        this.onUpdate();
    }

    /**
     * 恢复
     */
    public void restore() {
        this.deleted = 0;
        this.onUpdate();
    }
}
