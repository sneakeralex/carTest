package com.carservice.repository;

import com.carservice.entity.PersonInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * 人员信息Repository接口
 */
@Repository
public interface PersonInfoRepository extends JpaRepository<PersonInfo, Long> {
    
    /**
     * 根据人员ID查找人员
     * @param personId 人员ID
     * @return 人员对象
     */
    PersonInfo findByPersonId(String personId);
    
    /**
     * 根据用户ID查找人员
     * @param userId 用户ID
     * @return 人员对象
     */
    PersonInfo findByUserId(String userId);
    
    /**
     * 根据身份证号查找人员
     * @param idCardNo 身份证号
     * @return 人员对象
     */
    PersonInfo findByIdCardNo(String idCardNo);
    
    /**
     * 根据公司查找人员列表
     * @param company 公司
     * @return 人员列表
     */
    List<PersonInfo> findByCompanyContainingIgnoreCase(String company);
    
    /**
     * 根据职位查找人员列表
     * @param position 职位
     * @return 人员列表
     */
    List<PersonInfo> findByPositionContainingIgnoreCase(String position);
    
    /**
     * 根据人员状态查找人员列表
     * @param status 人员状态
     * @return 人员列表
     */
    List<PersonInfo> findByStatus(PersonInfo.PersonStatus status);
    
    /**
     * 根据注册日期范围查找人员
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 人员列表
     */
    List<PersonInfo> findByRegistrationDateBetween(LocalDate startDate, LocalDate endDate);
    
    /**
     * 根据营业执照号查找人员
     * @param businessLicense 营业执照号
     * @return 人员对象
     */
    PersonInfo findByBusinessLicense(String businessLicense);
    
    /**
     * 根据公司和状态查找人员
     * @param company 公司
     * @param status 人员状态
     * @return 人员列表
     */
    List<PersonInfo> findByCompanyContainingIgnoreCaseAndStatus(String company, PersonInfo.PersonStatus status);
    
    /**
     * 查找所有已激活的人员
     * @return 已激活人员列表
     */
    @Query("SELECT p FROM PersonInfo p WHERE p.status = 'ACTIVE' ORDER BY p.company, p.position")
    List<PersonInfo> findAllActivePersons();
    
    /**
     * 统计指定状态的人员数量
     * @param status 人员状态
     * @return 人员数量
     */
    @Query("SELECT COUNT(p) FROM PersonInfo p WHERE p.status = :status")
    long countByStatus(@Param("status") PersonInfo.PersonStatus status);
    
    /**
     * 根据地址模糊查询人员
     * @param address 地址关键字
     * @return 人员列表
     */
    List<PersonInfo> findByAddressContainingIgnoreCase(String address);
    
    /**
     * 查找待审核的人员
     * @return 待审核人员列表
     */
    List<PersonInfo> findByStatusOrderByRegistrationDateAsc(PersonInfo.PersonStatus status);
}
