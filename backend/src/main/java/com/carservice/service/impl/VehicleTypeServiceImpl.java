package com.carservice.service.impl;

import com.carservice.entity.VehicleType;
import com.carservice.repository.VehicleTypeRepository;
import com.carservice.service.VehicleTypeService;

import jakarta.annotation.Resource;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


/**
 * 车辆类型服务实现类
 */
@Service
public class VehicleTypeServiceImpl implements VehicleTypeService {

    @Resource
    private VehicleTypeRepository vehicleTypeRepository;

    @Override
    public VehicleType saveVehicleType(VehicleType vehicleType) {
        return vehicleTypeRepository.save(vehicleType);
    }

    @Override
    public Optional<VehicleType> getByTypeId(String typeId) {
        return vehicleTypeRepository.findByTypeId(typeId);
    }

    @Override
    public List<VehicleType> findAll() {
        return vehicleTypeRepository.findAll();
    }

    @Override
    public void deleteById(Long id) {
        vehicleTypeRepository.deleteById(id);
    }

    @Override
    public Optional<VehicleType> getByTypeCode(String typeCode) {
        return vehicleTypeRepository.findByTypeCode(typeCode);
    }

    @Override
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll();
    }

    @Override
    public VehicleType getVehicleTypeByCode(String typeCode) {
        return vehicleTypeRepository.findByTypeCode(typeCode)
                .orElseThrow(() -> new RuntimeException("车辆类型不存在: " + typeCode));
    }

    @Override
    public VehicleType createVehicleType(VehicleType vehicleType) {
        // 可加唯一性校验
        return vehicleTypeRepository.save(vehicleType);
    }

    @Override
    public VehicleType updateVehicleTypeByCode(String typeCode, VehicleType vehicleType) {
        VehicleType existing = getVehicleTypeByCode(typeCode);
        existing.setTypeName(vehicleType.getTypeName());
        existing.setDescription(vehicleType.getDescription());
        // 只允许更新部分字段，typeCode不允许变更
        return vehicleTypeRepository.save(existing);
    }

    @Override
    public void deleteVehicleTypeByCode(String typeCode) {
        VehicleType existing = getVehicleTypeByCode(typeCode);
        vehicleTypeRepository.delete(existing);
    }

}