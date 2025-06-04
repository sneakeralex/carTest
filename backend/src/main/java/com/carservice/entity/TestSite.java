package com.carservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.GenericGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Table;

import java.math.BigDecimal;

/**
 * 试验场地实体
 */
@Data
@Entity
@Table(name = "test_site")
@EqualsAndHashCode(callSuper = true)
public class TestSite extends BaseEntity {

    @GeneratedValue(generator = "test-site-id")
    @GenericGenerator(name = "test-site-id", strategy = "com.carservice.entity.generator.PrefixedIdGenerator",
                     parameters = @org.hibernate.annotations.Parameter(name = "prefix", value = "TS"))
    @Column(name = "site_id", unique = true)
    private String siteId;

    @Column(nullable = false, unique = true)
    private String siteName;  // 场地名称

    @Column(nullable = false, unique = true)
    private String siteCode;  // 场地编号

    @Column(length = 1000)
    private String description;  // 场地描述

    private BigDecimal area;  // 场地面积(平方米)

    @Column(nullable = false)
    private Integer maxVehicles;  // 最大容纳车辆数

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SiteType siteType;  // 场地类型

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SiteStatus status;  // 场地状态

    @Column(length = 500)
    private String facilities;  // 场地设施

    @Column(length = 500)
    private String location;  // 场地位置

    public enum SiteType {
        PERFORMANCE_TEST,    // 性能测试场
        SAFETY_TEST,        // 安全测试场
        DURABILITY_TEST,    // 耐久性测试场
        WEATHER_TEST,       // 气候测试场
        COMPREHENSIVE       // 综合测试场
    }

    public enum SiteStatus {
        AVAILABLE,      // 可用
        MAINTENANCE,    // 维护中
        RESERVED,      // 已预约
        UNAVAILABLE    // 不可用
    }
}
