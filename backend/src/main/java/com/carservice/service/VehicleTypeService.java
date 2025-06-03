package com.carservice.service;

import com.carservice.entity.VehicleType;
import java.util.List;
import java.util.Optional;

public interface VehicleTypeService {
    VehicleType saveVehicleType(VehicleType vehicleType);
    Optional<VehicleType> getByTypeId(String typeId);
    List<VehicleType> findAll();
    void deleteById(Long id);
    Optional<VehicleType> getByTypeCode(String typeCode);
    List<VehicleType> getAllVehicleTypes();
    VehicleType getVehicleTypeByCode(String typeCode);
    VehicleType createVehicleType(VehicleType vehicleType);
    VehicleType updateVehicleTypeByCode(String typeCode, VehicleType vehicleType);
    void deleteVehicleTypeByCode(String typeCode);
}
