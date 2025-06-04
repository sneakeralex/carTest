package com.carservice.repository;

import com.carservice.entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 合同Repository接口
 */
@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    /**
     * 根据合同编号查找合同
     * @param contractNo 合同编号
     * @return 合同对象
     */
    Contract findByContractNo(String contractNo);
    
    /**
     * 根据合同名称查找合同
     * @param contractName 合同名称
     * @return 合同对象
     */
    Contract findByContractName(String contractName);
    
    /**
     * 根据客户ID查找合同列表
     * @param customerId 客户ID
     * @return 合同列表
     */
    List<Contract> findByCustomerId(String customerId);
    
    /**
     * 根据合同状态查找合同列表
     * @param status 合同状态
     * @return 合同列表
     */
    List<Contract> findByStatus(Integer status);
    
    /**
     * 根据签订时间范围查找合同
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 合同列表
     */
    List<Contract> findBySignTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据生效时间范围查找合同
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 合同列表
     */
    List<Contract> findByEffectiveTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 根据到期时间范围查找合同
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 合同列表
     */
    List<Contract> findByExpiryTimeBetween(LocalDateTime startTime, LocalDateTime endTime);
    
    /**
     * 查找有效的合同
     * @return 有效合同列表
     */
    @Query("SELECT c FROM Contract c WHERE c.status = 1 ORDER BY c.signTime DESC")
    List<Contract> findActiveContracts();
    
    /**
     * 查找即将到期的合同
     * @param expiryDate 到期日期
     * @return 即将到期的合同列表
     */
    @Query("SELECT c FROM Contract c WHERE c.expiryTime <= :expiryDate AND c.status = 1 ORDER BY c.expiryTime ASC")
    List<Contract> findExpiringContracts(@Param("expiryDate") LocalDateTime expiryDate);
    
    /**
     * 统计指定状态的合同数量
     * @param status 合同状态
     * @return 合同数量
     */
    @Query("SELECT COUNT(c) FROM Contract c WHERE c.status = :status")
    long countByStatus(@Param("status") Integer status);
    
    /**
     * 根据客户ID和状态查找合同
     * @param customerId 客户ID
     * @param status 合同状态
     * @return 合同列表
     */
    List<Contract> findByCustomerIdAndStatus(String customerId, Integer status);
}
