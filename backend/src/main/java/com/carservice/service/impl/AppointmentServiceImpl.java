package com.carservice.service.impl;

import com.carservice.common.exception.BusinessException;
import com.carservice.dto.AppointmentDto;
import com.carservice.common.api.ResultCode;
import com.carservice.entity.Appointment;
import com.carservice.entity.Vehicle;
import com.carservice.repository.AppointmentRepository;
import com.carservice.service.AppointmentService;
import com.carservice.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 预约服务实现类
 */
@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private VehicleService vehicleService;

    @Override
    public Appointment save(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    @Override
    public Optional<Appointment> findByNo(String number) {
        return appointmentRepository.findByAppointmentNo(number);
    }

    @Override
    public List<Appointment> findAll() {
        return appointmentRepository.findAll();
    }

    @Override
    public void deleteByNo(String number) {
        appointmentRepository.deleteByAppointmentNo(number);
    }

    @Override
    public Page<Appointment> pageList(Pageable pageable) {
        // 分页查询
        return appointmentRepository.findAll(pageable);
    }

    @Override
    public List<Appointment> getAppointmentsByUserId(String userId) {
        return appointmentRepository.findByUserId(userId);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Appointment createAppointment(AppointmentDto appointmentDto) {
        // 检查车辆是否存在
        if (appointmentDto.getVehicleId() != null) {
            Optional<Vehicle> vehicleOpt = vehicleService.getByVehicleNo(appointmentDto.getVehicleId());
            if (!vehicleOpt.isPresent()) {
                throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆不存在");
            }
        }

        // 生成预约编号：A + 时间戳
        appointmentDto.setAppointmentNo("A" + System.currentTimeMillis());

        // 设置默认值
        appointmentDto.setStatus(0); // 默认待审核状态

        // Convert DTO to entity
        Appointment appointment = new Appointment();
        appointment.setAppointmentNo(appointmentDto.getAppointmentNo());
        appointment.setVehicleId(appointmentDto.getVehicleId());
        appointment.setUserId(appointmentDto.getUserId());
        appointment.setStatus(appointmentDto.getStatus());
        appointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        appointment.setDescription(appointmentDto.getDescription());

        return appointmentRepository.save(appointment);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean completeAppointmentByNo(String appointmentNo) {
        // 检查预约是否存在
        Optional<Appointment> appointmentOpt = appointmentRepository.findByAppointmentNo(appointmentNo);
        if (!appointmentOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "预约不存在");
        }

        Appointment appointment = appointmentOpt.get();

        // 检查状态是否允许完成
        if (appointment.getStatus() != 1) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "只有已审核状态的预约才能完成");
        }

        // 更新状态和反馈
        appointment.setStatus(2); // 已完成

        appointmentRepository.save(appointment);
        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean cancelAppointmentByNo(String appointmentNo) {
        // 检查预约是否存在
        Optional<Appointment> appointmentOpt = appointmentRepository.findByAppointmentNo(appointmentNo);
        if (!appointmentOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "预约不存在");
        }

        Appointment appointment = appointmentOpt.get();

        // 检查状态是否允许取消
        if (appointment.getStatus() == 2 || appointment.getStatus() == 3) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "已完成或已取消的预约不能取消");
        }

        // 更新状态为已取消
        appointment.setStatus(3); // 已取消

        appointmentRepository.save(appointment);
        return true;
    }

    @Override
    public Appointment approveAppointmentByNo(String appointmentNo) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'approveAppointmentByNo'");
    }
}