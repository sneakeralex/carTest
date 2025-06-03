package com.carservice.service.impl;

import com.carservice.entity.MaintenanceItem;
import com.carservice.repository.MaintenanceItemRepository;
import com.carservice.service.MaintenanceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * 维修保养项目服务实现类
 */
@Service
public class MaintenanceItemServiceImpl implements MaintenanceItemService {
    
    @Autowired
    private MaintenanceItemRepository maintenanceItemRepository;

    @Override
    public MaintenanceItem save(MaintenanceItem item) {
        return maintenanceItemRepository.save(item);
    }

    
    @Override
    public List<MaintenanceItem> findAll() {
        return maintenanceItemRepository.findAll();
    }
    
    @Override
    public List<MaintenanceItem> getItemsByMaintenanceNo(String maintenanceNo) {
        return maintenanceItemRepository.findByMaintenanceNo(maintenanceNo);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean batchSaveItems(String maintenanceNo, List<MaintenanceItem> items) {
        if (items == null || items.isEmpty()) {
            return true;
        }
        
        for (MaintenanceItem item : items) {
            item.setMaintenanceNo(maintenanceNo);
        }
        
        List<MaintenanceItem> savedItems = maintenanceItemRepository.saveAll(items);
        return savedItems != null && !savedItems.isEmpty();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public  Boolean deleteByMaintenanceNo(String maintenanceNo) {
        maintenanceItemRepository.deleteByMaintenanceNo(maintenanceNo);
        return true;
    }


    @Override
    public Boolean deleteByItemId(String itemId) {
        Optional<MaintenanceItem> itemOpt = maintenanceItemRepository.findByItemId(itemId);
        if (itemOpt.isPresent()) {
            maintenanceItemRepository.deleteById(itemOpt.get().getId());
            return Boolean.TRUE;
        }
        return Boolean.FALSE;
    }
}