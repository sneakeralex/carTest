package com.carservice.repository;

import com.carservice.entity.ContractUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 合同单位Repository接口
 */
@Repository
public interface ContractUnitRepository extends JpaRepository<ContractUnit, Long> {
    
    /**
     * 根据单位名称查找合同单位
     * @param unitName 单位名称
     * @return 合同单位对象
     */
    ContractUnit findByUnitName(String unitName);
    
    /**
     * 根据单位编码查找合同单位
     * @param unitCode 单位编码
     * @return 合同单位对象
     */
    ContractUnit findByUnitCode(String unitCode);
    
    /**
     * 根据单位类型查找合同单位列表
     * @param unitType 单位类型
     * @return 合同单位列表
     */
    List<ContractUnit> findByUnitType(String unitType);
    
    /**
     * 根据状态查找合同单位列表
     * @param status 状态
     * @return 合同单位列表
     */
    List<ContractUnit> findByStatus(Integer status);
    
    /**
     * 根据单位名称模糊查询
     * @param unitName 单位名称关键字
     * @return 合同单位列表
     */
    List<ContractUnit> findByUnitNameContainingIgnoreCase(String unitName);
    
    /**
     * 查找所有有效的合同单位
     * @return 有效合同单位列表
     */
    @Query("SELECT cu FROM ContractUnit cu WHERE cu.status = 1 ORDER BY cu.unitName ASC")
    List<ContractUnit> findActiveUnits();
    
    /**
     * 统计指定类型的单位数量
     * @param unitType 单位类型
     * @return 单位数量
     */
    @Query("SELECT COUNT(cu) FROM ContractUnit cu WHERE cu.unitType = :unitType AND cu.status = 1")
    long countActiveUnitsByType(@Param("unitType") String unitType);
}
