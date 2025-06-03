package com.carservice.service;

import com.carservice.entity.MaintenanceItem;

import java.util.List;

/**
 * 维修保养项目服务接口
 */
public interface MaintenanceItemService {
    Boolean deleteByItemId(String itemId);

    /**
     * 保存维修保养项目
     * @param item 维修保养项目
     * @return 保存后的维修保养项目
     */
    MaintenanceItem save(MaintenanceItem item);
    
    /**
     * 查询所有维修保养项目
     * @return 维修保养项目列表
     */
    List<MaintenanceItem> findAll();
    
    /**
     * 根据维修保养记录ID获取维修保养项目列表
     * @param maintenanceNo 维修保养记录ID
     * @return 维修保养项目列表
     */
    List<MaintenanceItem> getItemsByMaintenanceNo(String maintenanceNo);
    
    /**
     * 批量保存维修保养项目
     * @param maintenanceId 维修保养记录ID
     * @param items 维修保养项目列表
     * @return 保存结果
     */
    boolean batchSaveItems(String maintenanceNo, List<MaintenanceItem> items);
    
    /**
     * 删除维修保养记录的所有项目
     * @param maintenanceId 维修保养记录ID
     * @return 删除结果
     */
    Boolean deleteByMaintenanceNo(String maintenanceNo);
}