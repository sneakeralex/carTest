package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
    private Integer status;

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


}