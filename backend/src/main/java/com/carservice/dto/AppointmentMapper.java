package com.carservice.dto;

import com.carservice.entity.Appointment;

public class AppointmentMapper {
    public static Appointment toEntity(AppointmentDto appointmentDto) {
        if (appointmentDto == null) return null;
        Appointment appointment = new Appointment();
        appointment.setAppointmentNo(appointmentDto.getAppointmentNo());
        appointment.setVehicleId(appointmentDto.getVehicleId());
        appointment.setUserId(appointmentDto.getUserId());
        appointment.setStatus(appointmentDto.getStatus());
        appointment.setAppointmentTime(appointmentDto.getAppointmentTime());
        appointment.setDescription(appointmentDto.getDescription());
        return appointment;
    }

    public static AppointmentDto toDto(Appointment appointment) {
        if (appointment == null) return null;
        AppointmentDto appointmentDto = new AppointmentDto();
        appointmentDto.setAppointmentNo(appointment.getAppointmentNo());
        appointmentDto.setVehicleId(appointment.getVehicleId());
        appointmentDto.setUserId(appointment.getUserId());
        appointmentDto.setStatus(appointment.getStatus());
        appointmentDto.setAppointmentTime(appointment.getAppointmentTime());
        appointmentDto.setDescription(appointment.getDescription());
        return appointmentDto;

    }
}
