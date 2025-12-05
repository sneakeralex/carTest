package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;

/**
 * 预约试驾实体
 */
@Data
@Entity
@EqualsAndHashCode(callSuper = true)
@Table(name = "appointment")
public class Appointment extends BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 预约编号
     */
    @Column(name = "appointment_no")
    private String appointmentNo;

    /**
     * 用户ID
     */
    @Column(name = "user_id")
    private String userId;

    /**
     * 车辆ID
     */
    @Column(name = "vehicle_id")
    private String vehicleId;

    /**
     * 预约时间
     */
    @Column(name = "appointment_time")
    private LocalDateTime appointmentTime;

    /**
     * 预计时长(分钟)
     */
    @Column(name = "duration")
    private Integer duration;

    /**
     * 状态：0待审核，1已审核，2已完成，3已取消
     */
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private AppointmentStatusEnum status;

    /**
     * 联系人姓名
     */
    @Column(name = "contact_name")
    private String contactName;

    /**
     * 联系人电话
     */
    @Column(name = "contact_phone")
    private String contactPhone;


    @Column(name = "description")
    private String description;

    /**
     * 备注
     */
    @Column(name = "remark")
    private String remark;

    /**
     * 试驾反馈
     */
    @Column(name = "feedback")
    private String feedback;

    public enum AppointmentStatusEnum {
        /**
         * 待审核
         */
        PENDING(0, "待审核"),
        
        /**
         * 已审核
         */
        APPROVED(1, "已审核"),
        
        /**
         * 已完成
         */
        COMPLETED(2, "已完成"),
        
        /**
         * 已取消
         */
        CANCELLED(3, "已取消");

        private final int code;
        private final String description;

        AppointmentStatusEnum(int code, String description) {
            this.code = code;
            this.description = description;
        }

        public int getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }

        public static AppointmentStatusEnum fromCode(int code) {
            for (AppointmentStatusEnum status : AppointmentStatusEnum.values()) {
                if (status.getCode() == code) {
                    return status;
                }
            }
            throw new IllegalArgumentException("Invalid status code: " + code);
        }
    }
}