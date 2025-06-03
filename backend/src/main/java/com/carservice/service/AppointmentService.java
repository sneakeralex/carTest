package com.carservice.service;

import com.carservice.dto.AppointmentDto;
import com.carservice.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * 预约服务接口
 */
public interface AppointmentService {
    
    /**
     * 保存预约
     * @param appointment 预约信息
     * @return 保存的预约
     */
    Appointment save(Appointment appointment);
    
    /**
     * 根据ID查找预约
     * @param id 预约ID
     * @return 预约信息
     */
    // Optional<Appointment> findById(Long id);
    Optional<Appointment> findByNo(String appointmentNo);
    
    /**
     * 查找所有预约
     * @return 预约列表
     */
    List<Appointment> findAll();
    
    /**
     * 删除预约
     * @param id 预约ID
     */
    void deleteByNo(String appointmentNo);
    
    /**
     * 分页查询预约列表
     * @param pageable 分页参数
     * @param appointment 查询条件
     * @return 分页结果
     */
    Page<Appointment> pageList(Pageable pageable);
    List<Appointment> getAppointmentsByUserId(String userId);
    Appointment createAppointment(AppointmentDto appointmentDto);
    // Appointment approveAppointment(String appointmentNo);
    Appointment approveAppointmentByNo(String appointmentNo);
    // Boolean completeAppointment(Long id);
    Boolean completeAppointmentByNo(String appointmentNo);
    // Boolean cancelAppointment(Long id);
    Boolean cancelAppointmentByNo(String appointmentNo);
}