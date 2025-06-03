package com.carservice.repository;

import com.carservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * 预约Repository接口
 */
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {


    /**
     * 
     * @param number
     * @return void
     */
    void deleteByAppointmentNo(String number);
    
    /**
     * 根据用户ID查找预约
     * 
     * @param userId 用户ID
     * @return 预约列表
     */
    List<Appointment> findByUserId(String userId);

    /**
     * 根据车辆ID查找预约
     * 
     * @param vehicleId 车辆ID
     * @return 预约列表
     */
    List<Appointment> findByVehicleId(String vehicleId);

    /**
     * 根据预约编号查找预约
     * 
     * @param appointmentNo 预约编号
     * @return 预约
     */
    Optional<Appointment> findByAppointmentNo(String appointmentNo);

    /**
     * 根据状态查找预约
     * 
     * @param status 状态
     * @return 预约列表
     */
    List<Appointment> findByStatus(Integer status);

    /**
     * 根据预约时间范围查找预约
     * 
     * @param startTime 开始时间
     * @param endTime   结束时间
     * @return 预约列表
     */
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
}