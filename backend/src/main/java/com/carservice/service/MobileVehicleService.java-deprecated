package com.carservice.service;

import com.carservice.controller.MobileVehicleController.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 移动端车辆服务接口
 */
public interface MobileVehicleService {
    
    /**
     * 获取车辆列表
     */
    Page<VehicleDTO> getVehicleList(String brand, String model, String status, String keyword, Pageable pageable);
    
    /**
     * 获取车辆详情
     */
    VehicleDTO getVehicleDetail(String vehicleId);
    
    /**
     * 获取用户车辆列表
     */
    List<VehicleDTO> getUserVehicles(String userId);
    
    /**
     * 添加用户车辆
     */
    VehicleDTO addUserVehicle(String userId, VehicleDTO vehicleDTO);
    
    /**
     * 更新车辆信息
     */
    VehicleDTO updateVehicle(String vehicleId, VehicleDTO vehicleDTO);
    
    /**
     * 删除车辆信息
     */
    void deleteVehicle(String vehicleId);
    
    /**
     * 上传车辆图片
     */
    List<String> uploadVehicleImages(String vehicleId, List<MultipartFile> files);
    
    /**
     * 获取车辆图片列表
     */
    List<VehicleImageDTO> getVehicleImages(String vehicleId);
    
    /**
     * 获取车辆品牌列表
     */
    List<VehicleBrandDTO> getVehicleBrands();
    
    /**
     * 获取车辆型号列表
     */
    List<VehicleModelDTO> getVehicleModels(String brandId);
}
