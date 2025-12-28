package com.carservice.mapper;

import com.carservice.dto.booking.*;
import com.carservice.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * 预约相关DTO映射器
 */
@Mapper(componentModel = "spring")
public interface BookingMapper {

    /**
     * SiteBooking实体转SiteBookingDTO
     */
    @Mapping(target = "statusName", expression = "java(getBookingStatusName(siteBooking.getStatus()))")
    @Mapping(target = "siteName", ignore = true)
    @Mapping(target = "userName", ignore = true)
    @Mapping(target = "vehiclePlateNo", ignore = true)
    @Mapping(target = "testContentName", ignore = true)
    @Mapping(target = "siteInfo", ignore = true)
    @Mapping(target = "weatherInfo", ignore = true)
    @Mapping(target = "scheduleInfo", ignore = true)
    SiteBookingDTO toSiteBookingDTO(SiteBooking siteBooking);

    /**
     * TestSite实体转TestSiteDTO
     */
    @Mapping(target = "siteTypeName", expression = "java(getSiteTypeName(testSite.getSiteType()))")
    @Mapping(target = "statusName", expression = "java(getSiteStatusName(testSite.getStatus()))")
    @Mapping(target = "safetyRequirements", ignore = true)
    @Mapping(target = "operatingHours", ignore = true)
    @Mapping(target = "contactInfo", ignore = true)
    TestSiteDTO toTestSiteDTO(TestSite testSite);

    /**
     * SiteSchedule实体转SiteScheduleDTO
     */
    @Mapping(target = "scheduleTypeName", expression = "java(getScheduleTypeName(siteSchedule.getScheduleType()))")
    @Mapping(target = "siteName", expression = "java(siteSchedule.getSite() == null ? null : siteSchedule.getSite().getName())")
    @Mapping(target = "totalSlots", expression = "java(siteSchedule.getSite() == null ? null : siteSchedule.getSite().getTotalSlots())")
    @Mapping(target = "availableSlots", expression = "java(siteSchedule.getSite() == null ? null : siteSchedule.getSite().getAvailableSlots())")
    @Mapping(target = "description", expression = "java(siteSchedule.getSite() == null ? null : siteSchedule.getSite().getDescription())")
    SiteScheduleDTO toSiteScheduleDTO(SiteSchedule siteSchedule);

    /**
     * WeatherRecord实体转WeatherRecordDTO
     */
    @Mapping(target = "weatherTypeName", expression = "java(getWeatherTypeName(weatherRecord.getWeatherType()))")
    @Mapping(target = "siteName", expression = "java(weatherRecord.getSite() == null ? null : weatherRecord.getSite().getName())")
    @Mapping(target = "suitabilityReason", ignore = true)
    WeatherRecordDTO toWeatherRecordDTO(WeatherRecord weatherRecord);

    /**
     * SiteBookingDTO转SiteBooking实体
     */
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "weatherId", ignore = true)
    @Mapping(target = "cancellationReason", ignore = true)
    SiteBooking toSiteBooking(SiteBookingDTO siteBookingDTO);

    /**
     * 更新SiteBooking实体
     */
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "weatherId", ignore = true)
    @Mapping(target = "cancellationReason", ignore = true)
    void updateSiteBooking(@MappingTarget SiteBooking siteBooking, SiteBookingDTO siteBookingDTO);

    // 辅助方法
    default String getBookingStatusName(SiteBooking.BookingStatus status) {
        if (status == null) return null;
        return switch (status) {
            case PENDING -> "待确认";
            case APPROVED -> "已批准";
            case REJECTED -> "已拒绝";
            case CONFIRMED -> "已确认";
            case IN_PROGRESS -> "进行中";
            case COMPLETED -> "已完成";
            case CANCELLED -> "已取消";
            case NO_SHOW -> "未到场";
        };
    }

    default String getSiteTypeName(TestSite.SiteType siteType) {
        if (siteType == null) return null;
        return switch (siteType) {
            case PERFORMANCE_TEST -> "性能测试场";
            case SAFETY_TEST -> "安全测试场";
            case DURABILITY_TEST -> "耐久性测试场";
            case WEATHER_TEST -> "气候测试场";
            case COMPREHENSIVE -> "综合测试场";
        };
    }

    default String getSiteStatusName(TestSite.SiteStatus status) {
        if (status == null) return null;
        return switch (status) {
            case AVAILABLE -> "可用";
            case MAINTENANCE -> "维护中";
            case RESERVED -> "已预约";
            case UNAVAILABLE -> "不可用";
        };
    }

    default String getScheduleTypeName(SiteSchedule.ScheduleType scheduleType) {
        if (scheduleType == null) return null;
        return switch (scheduleType) {
            case NORMAL -> "正常营业";
            case MAINTENANCE -> "场地维护";
            case RESERVED -> "特殊预留";
            case HOLIDAY -> "节假日";
        };
    }

    default String getWeatherTypeName(WeatherRecord.WeatherType weatherType) {
        if (weatherType == null) return null;
        return switch (weatherType) {
            case SUNNY -> "晴天";
            case CLOUDY -> "多云";
            case OVERCAST -> "阴天";
            case RAINY -> "雨天";
            case SNOWY -> "雪天";
            case FOGGY -> "雾天";
            case WINDY -> "大风";
        };
    }
}