package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.entity.MaintenanceItem;
import com.carservice.service.MaintenanceItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import java.util.List;

/**
 * 维修项目控制器
 */
@Tag(name = "维修项目管理")
@RestController
@RequestMapping("/api/maintenanceItem")
public class MaintenanceItemController {

    @Autowired
    private MaintenanceItemService maintenanceItemService;

    @Operation(summary = "获取维修保养记录的项目列表")
    @GetMapping("/list/{maintenanceNo}")
    public ResponseEntity<Result<List<MaintenanceItem>>> getItemsByMaintenanceId(@PathVariable String maintenanceNo) {
        List<MaintenanceItem> items = maintenanceItemService.getItemsByMaintenanceNo(maintenanceNo);
        return ResponseEntity.ok(Result.success(items));
    }

    @Operation(summary = "批量添加维修项目")
    @PostMapping("/batchSave/{maintenanceId}")
    public ResponseEntity<Result<Boolean>> batchSaveItems(@PathVariable String maintenanceNO, @RequestBody List<MaintenanceItem> items) {
        boolean result = maintenanceItemService.batchSaveItems(maintenanceNO, items);
        return ResponseEntity.ok(Result.success(result));
    }

   
    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable String itemId) {
        maintenanceItemService.deleteByItemId(itemId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "删除维修保养记录的所有项目")
    @DeleteMapping("/maintenance/{maintenanceNo}")
    public ResponseEntity<Void> deleteItemsByMaintenanceId(@PathVariable String maintenanceNo) {
        maintenanceItemService.deleteByMaintenanceNo(maintenanceNo);
        return ResponseEntity.noContent().build();
    }
}