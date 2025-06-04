package com.carservice.repository;

import com.carservice.entity.TestSite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 试验场地Repository接口
 */
@Repository
public interface TestSiteRepository extends JpaRepository<TestSite, Long> {
    
    /**
     * 根据场地ID查找场地
     * @param siteId 场地ID
     * @return 场地对象
     */
    TestSite findBySiteId(String siteId);
    
    /**
     * 根据场地名称查找场地
     * @param siteName 场地名称
     * @return 场地对象
     */
    TestSite findBySiteName(String siteName);
    
    /**
     * 根据场地编号查找场地
     * @param siteCode 场地编号
     * @return 场地对象
     */
    TestSite findBySiteCode(String siteCode);
    
    /**
     * 根据场地类型查找场地列表
     * @param siteType 场地类型
     * @return 场地列表
     */
    List<TestSite> findBySiteType(TestSite.SiteType siteType);
    
    /**
     * 根据场地状态查找场地列表
     * @param status 场地状态
     * @return 场地列表
     */
    List<TestSite> findByStatus(TestSite.SiteStatus status);
    
    /**
     * 查找可用的场地列表
     * @return 可用场地列表
     */
    List<TestSite> findByStatusOrderBySiteNameAsc(TestSite.SiteStatus status);
    
    /**
     * 根据最大容纳车辆数查找场地
     * @param minVehicles 最小车辆数
     * @return 场地列表
     */
    List<TestSite> findByMaxVehiclesGreaterThanEqual(Integer minVehicles);
    
    /**
     * 根据场地类型和状态查找场地
     * @param siteType 场地类型
     * @param status 场地状态
     * @return 场地列表
     */
    List<TestSite> findBySiteTypeAndStatus(TestSite.SiteType siteType, TestSite.SiteStatus status);
    
    /**
     * 查找所有可用场地，按场地名称排序
     * @return 可用场地列表
     */
    @Query("SELECT ts FROM TestSite ts WHERE ts.status = 'AVAILABLE' ORDER BY ts.siteName ASC")
    List<TestSite> findAllAvailableSitesOrderByName();
    
    /**
     * 根据位置模糊查询场地
     * @param location 位置关键字
     * @return 场地列表
     */
    List<TestSite> findByLocationContainingIgnoreCase(String location);
    
    /**
     * 统计指定类型的场地数量
     * @param siteType 场地类型
     * @return 场地数量
     */
    @Query("SELECT COUNT(ts) FROM TestSite ts WHERE ts.siteType = :siteType")
    long countBySiteType(@Param("siteType") TestSite.SiteType siteType);
}
