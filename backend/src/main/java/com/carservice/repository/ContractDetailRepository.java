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
     * @param contractNo 合同编号
     * @return 合同详情列表
     */
    List<ContractDetail> findByContractNo(String contractNo);
    
    /**
     * 根据合同编号和详情类型查找合同详情
     * @param contractNo 合同编号
     * @param detailType 详情类型
     * @return 合同详情列表
     */
    List<ContractDetail> findByContractNoAndDetailType(String contractNo, String detailType);
    
    /**
     * 根据详情类型查找合同详情列表
     * @param detailType 详情类型
     * @return 合同详情列表
     */
    List<ContractDetail> findByDetailType(String detailType);
    
    /**
     * 统计指定合同的详情数量
     * @param contractNo 合同编号
     * @return 详情数量
     */
    @Query("SELECT COUNT(cd) FROM ContractDetail cd WHERE cd.contractNo = :contractNo")
    long countByContractNo(@Param("contractNo") String contractNo);
}
