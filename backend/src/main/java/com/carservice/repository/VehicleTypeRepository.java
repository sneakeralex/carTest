package com.carservice.repository;

import com.carservice.entity.VehicleType;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VehicleTypeRepository extends JpaRepository<VehicleType, Long> {
    Optional<VehicleType> findByTypeCode(String typeCode);
    Optional<VehicleType> findByTypeId(String typeId);
    Optional<VehicleType> findByTypeName(String typeName);
}
