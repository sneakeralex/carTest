package com.carservice.service.impl;

import com.carservice.common.exception.BusinessException;
import com.carservice.dto.VehicleDto;
import com.carservice.common.api.ResultCode;
import com.carservice.entity.Vehicle;
import com.carservice.entity.VehicleType;
import com.carservice.repository.VehicleRepository;
import com.carservice.service.VehicleService;
import com.carservice.service.VehicleTypeService;
import com.carservice.repository.UserRepository;
import com.carservice.entity.User;

import jakarta.annotation.Resource;
import jakarta.persistence.EntityExistsException;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Optional;

/**
 * 车辆服务实现类
 */
@Service
public class VehicleServiceImpl implements VehicleService {

    @Resource
    private VehicleRepository vehicleRepository;

    @Resource
    private VehicleTypeService vehicleTypeService;

    @Resource
    private UserRepository userRepository;

    @Override
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Override
    public List<Vehicle> findAll() {
        return vehicleRepository.findAll();
    }

    @Override
    public Page<Vehicle> pageList(Pageable pageable, Vehicle vehicle) {
        // 创建匹配器，即如何使用查询条件
        ExampleMatcher matcher = ExampleMatcher.matching()
                .withStringMatcher(ExampleMatcher.StringMatcher.CONTAINING) // 改变默认字符串匹配方式：模糊查询
                .withIgnoreCase(true); // 改变默认大小写忽略方式：忽略大小写

        // 创建实例
        Example<Vehicle> example = Example.of(vehicle, matcher);

        return vehicleRepository.findAll(example, pageable);
    }

    @Override
    public Optional<Vehicle> getByVehicleNo(String vehicleNo) {
        return Optional.ofNullable(vehicleRepository.findByVehicleNo(vehicleNo));
    }

    @Override
    public List<Vehicle> getVehiclesByUserId(Long userId) {
        return vehicleRepository.findByOwnerId(userId);
    }

    @Override
    public Vehicle addVehicle(Vehicle vehicle) {
        // 检查车牌号是否已存在
        getByVehicleNo(vehicle.getVehicleNo())
                .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车牌号已存在"));

        // 检查车辆类型是否存在
        if (vehicle.getTypeId() != null) {
            Optional<VehicleType> vehicleTypeOpt = vehicleTypeService.getByTypeId(vehicle.getTypeId());
            if (vehicleTypeOpt.isPresent()) {
                throw new IllegalArgumentException("vehicle type already exist");
            }
        }

        // 设置默认值
        vehicle.setStatus(1); // 默认正常状态

        return vehicleRepository.save(vehicle);
    }

    @Override
    public Optional<Vehicle> updateVehicle(Vehicle vehicle) {
        // 检查车辆是否存在
        Optional<Vehicle> existVehicleOpt = vehicleRepository.findById(vehicle.getId());
        if (!existVehicleOpt.isPresent()) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆不存在");
        }

        Vehicle existVehicle = existVehicleOpt.get();

        // 如果修改了车牌号，检查新车牌号是否已存在
        if (StringUtils.hasText(vehicle.getVehicleNo())
                && !vehicle.getVehicleNo().equals(existVehicle.getVehicleNo())) {
            getByVehicleNo(vehicle.getVehicleNo())
                    .orElseThrow(() -> new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车牌号已存在"));
        }

        // 检查车辆类型是否存在
        if (vehicle.getTypeId() != null && !vehicle.getTypeId().equals(existVehicle.getTypeId())) {
            Optional<VehicleType> vehicleTypeOpt = vehicleTypeService.getByTypeId(vehicle.getTypeId());
            if (vehicleTypeOpt.isPresent()) {
                throw new EntityExistsException();
            }
        }

        // 更新车辆信息
        if (vehicle.getVehicleNo() != null)
            existVehicle.setVehicleNo(vehicle.getVehicleNo());
        if (vehicle.getVin() != null)
            existVehicle.setVin(vehicle.getVin());
        if (vehicle.getTypeId() != null)
            existVehicle.setTypeId(vehicle.getTypeId());
        if (vehicle.getBrand() != null)
            existVehicle.setBrand(vehicle.getBrand());
        if (vehicle.getModel() != null)
            existVehicle.setModel(vehicle.getModel());
        if (vehicle.getColor() != null)
            existVehicle.setColor(vehicle.getColor());
        if (vehicle.getEngineNo() != null)
            existVehicle.setEngineNo(vehicle.getEngineNo());
        if (vehicle.getPurchaseDate() != null)
            existVehicle.setPurchaseDate(vehicle.getPurchaseDate());
        if (vehicle.getMileage() != null)
            existVehicle.setMileage(vehicle.getMileage());
        if (vehicle.getStatus() != null)
            existVehicle.setStatus(vehicle.getStatus());

        return Optional.of(vehicleRepository.save(existVehicle));

    }

    @Override
    public Optional<Vehicle> getByVehicleId(String vehicleId) {
        // 假设 vehicleId 实际为 String 类型主键（如 vehicleNo），否则需转换
        return Optional.ofNullable(vehicleRepository.findByVehicleNo(vehicleId));
    }

    @Override
    public void deleteByVehicleId(String vehicleId) {
        Vehicle vehicle = vehicleRepository.findByVehicleNo(vehicleId);
        if (vehicle != null) {
            vehicleRepository.delete(vehicle);
        }
    }

    @Override
    public Page<Vehicle> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable);
    }

    @Override
    public Optional<Vehicle> getVehicleByNo(String vehicleNo) {
        return Optional.ofNullable(vehicleRepository.findByVehicleNo(vehicleNo));
    }

    @Override
    public List<Vehicle> getCurrentUserVehicles(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null)
            return List.of();
        return vehicleRepository.findByOwnerId(user.getId());
    }

    @Override
    public Vehicle addVehicle(VehicleDto vehicleDto, String username) {
        Vehicle existVehicle = vehicleRepository.findByVehicleNo(vehicleDto.getVehicleNo());
        if (existVehicle != null) {
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车牌号已存在");
        }
        if (vehicleDto.getTypeId() != null) {
            Optional<VehicleType> vehicleTypeOpt = vehicleTypeService.getByTypeId(vehicleDto.getTypeId());
            if (vehicleTypeOpt.isEmpty()) {
                throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆类型不存在");
            }
        }
        User user = userRepository.findByUsername(username);
        if (user == null)
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "用户不存在");
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNo(vehicleDto.getVehicleNo());
        vehicle.setVin(vehicleDto.getVin());
        vehicle.setTypeId(vehicleDto.getTypeId());
        vehicle.setBrand(vehicleDto.getBrand());
        vehicle.setModel(vehicleDto.getModel());
        vehicle.setColor(vehicleDto.getColor());
        vehicle.setEngineNo(vehicleDto.getEngineNo());
        vehicle.setPurchaseDate(vehicleDto.getPurchaseDate());
        vehicle.setMileage(vehicleDto.getMileage());
        vehicle.setStatus(1); // 默认正常
        vehicle.setOwnerId(user.getUserId());
        return vehicleRepository.save(vehicle);
    }

    @Override
    public Optional<Vehicle> updateVehicleByNo(String vehicleNo, VehicleDto vehicleDto, String username) {
        Vehicle vehicle = vehicleRepository.findByVehicleNo(vehicleNo);
        if (vehicle == null)
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆不存在");
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getUserId().equals(vehicle.getOwnerId()))
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权限");
        if (vehicleDto.getVin() != null)
            vehicle.setVin(vehicleDto.getVin());
        if (vehicleDto.getTypeId() != null)
            vehicle.setTypeId(vehicleDto.getTypeId());
        if (vehicleDto.getBrand() != null)
            vehicle.setBrand(vehicleDto.getBrand());
        if (vehicleDto.getModel() != null)
            vehicle.setModel(vehicleDto.getModel());
        if (vehicleDto.getColor() != null)
            vehicle.setColor(vehicleDto.getColor());
        if (vehicleDto.getEngineNo() != null)
            vehicle.setEngineNo(vehicleDto.getEngineNo());
        if (vehicleDto.getPurchaseDate() != null)
            vehicle.setPurchaseDate(vehicleDto.getPurchaseDate());
        if (vehicleDto.getMileage() != null)
            vehicle.setMileage(vehicleDto.getMileage());
        if (vehicleDto.getStatus() != null)
            vehicle.setStatus(vehicleDto.getStatus());
        return Optional.of(vehicleRepository.save(vehicle));
    }

    @Override
    public void deleteVehicleByNo(String vehicleNo, String username) {
        Vehicle vehicle = vehicleRepository.findByVehicleNo(vehicleNo);
        if (vehicle == null)
            throw new BusinessException(ResultCode.VALIDATE_FAILED.getCode(), "车辆不存在");
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getUserId().equals(vehicle.getOwnerId()))
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权限");
        vehicleRepository.delete(vehicle);
    }
}