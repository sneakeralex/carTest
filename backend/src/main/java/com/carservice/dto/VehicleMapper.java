package com.carservice.dto;

import com.carservice.entity.Vehicle;

public class VehicleMapper {
    public static VehicleDto toDto(Vehicle entity) {
        if (entity == null) return null;
        VehicleDto dto = new VehicleDto();
        dto.setVehicleNo(entity.getVehicleNo());
        dto.setVin(entity.getVin());
        dto.setTypeId(entity.getTypeId());
        dto.setBrand(entity.getBrand());
        dto.setModel(entity.getModel());
        dto.setColor(entity.getColor());
        dto.setEngineNo(entity.getEngineNo());
        dto.setPurchaseDate(entity.getPurchaseDate());
        dto.setMileage(entity.getMileage());
        dto.setStatus(entity.getStatus());
        dto.setOwnerId(entity.getOwnerId());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}
