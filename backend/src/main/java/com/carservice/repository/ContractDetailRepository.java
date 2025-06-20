package com.carservice.repository;

import com.carservice.entity.ContractDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 合同详情Repository接口
 */
@Repository
public interface ContractDetailRepository extends JpaRepository<ContractDetail, Long> {
    
    /**
     * 根据合同编号查找合同详情列表
     * @param contractId 合同编号
     * @return 合同详情列表
     */
    List<ContractDetail> findByContractId(String contractId);


    

    
    /**
     * 统计指定合同的详情数量
     * @param contractId 合同编号
     * @return 详情数量
     */
    @Query("SELECT COUNT(cd) FROM ContractDetail cd WHERE cd.contractId = :contractId")
    long countByContractId(@Param("contractId") String contractId);
}
