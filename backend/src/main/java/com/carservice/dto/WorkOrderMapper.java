package com.carservice.dto;

import com.carservice.entity.WorkOrder;

public class WorkOrderMapper {
    public static WorkOrderDto toDto(WorkOrder entity) {
        if (entity == null) return null;
        WorkOrderDto dto = new WorkOrderDto();
        dto.setOrderNo(entity.getOrderNo());
        dto.setMaintenanceId(entity.getMaintenanceId());
        dto.setVehicleId(entity.getVehicleNo());
        dto.setTechnicianId(entity.getTechnicianId());
        dto.setStatus(entity.getStatus());
        dto.setStartTime(entity.getStartTime());
        dto.setEndTime(entity.getEndTime());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}
