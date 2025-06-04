package com.carservice.mapper;

import com.carservice.dto.booking.*;
import com.carservice.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * 预约DTO映射器
 */
@Mapper(componentModel = "spring")
public interface BookingMapper {
    
    BookingMapper INSTANCE = Mappers.getMapper(BookingMapper.class);
    
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
    TestSiteDTO toTestSiteDTO(TestSite testSite);
    
    /**
     * SiteSchedule实体转SiteScheduleDTO
     */
    @Mapping(target = "scheduleTypeName", expression = "java(getScheduleTypeName(siteSchedule.getScheduleType()))")
    @Mapping(target = "siteName", ignore = true)
    SiteScheduleDTO toSiteScheduleDTO(SiteSchedule siteSchedule);
    
    /**
     * WeatherRecord实体转WeatherRecordDTO
     */
    @Mapping(target = "weatherTypeName", expression = "java(getWeatherTypeName(weatherRecord.getWeatherType()))")
    @Mapping(target = "siteName", ignore = true)
    WeatherRecordDTO toWeatherRecordDTO(WeatherRecord weatherRecord);
    
    /**
     * SiteBookingDTO转SiteBooking实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    SiteBooking toSiteBooking(SiteBookingDTO siteBookingDTO);
    
    /**
     * TestSiteDTO转TestSite实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    TestSite toTestSite(TestSiteDTO testSiteDTO);
    
    /**
     * SiteScheduleDTO转SiteSchedule实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    SiteSchedule toSiteSchedule(SiteScheduleDTO siteScheduleDTO);
    
    /**
     * 更新SiteBooking实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "bookingId", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    void updateSiteBooking(@MappingTarget SiteBooking siteBooking, SiteBookingDTO siteBookingDTO);
    
    // 辅助方法
    default String getBookingStatusName(SiteBooking.BookingStatus status) {
        if (status == null) return null;
        switch (status) {
            case PENDING: return "待审核";
            case APPROVED: return "已批准";
            case REJECTED: return "已拒绝";
            case CONFIRMED: return "已确认";
            case IN_PROGRESS: return "进行中";
            case COMPLETED: return "已完成";
            case CANCELLED: return "已取消";
            default: return "未知";
        }
    }
    
    default String getSiteTypeName(TestSite.SiteType siteType) {
        if (siteType == null) return null;
        switch (siteType) {
            case INDOOR: return "室内场地";
            case OUTDOOR: return "室外场地";
            case TRACK: return "跑道";
            case PARKING: return "停车场";
            case WORKSHOP: return "车间";
            default: return "未知";
        }
    }
    
    default String getSiteStatusName(TestSite.SiteStatus status) {
        if (status == null) return null;
        switch (status) {
            case AVAILABLE: return "可用";
            case OCCUPIED: return "占用中";
            case MAINTENANCE: return "维护中";
            case UNAVAILABLE: return "不可用";
            default: return "未知";
        }
    }
    
    default String getScheduleTypeName(SiteSchedule.ScheduleType scheduleType) {
        if (scheduleType == null) return null;
        switch (scheduleType) {
            case NORMAL: return "正常排期";
            case MAINTENANCE: return "维护排期";
            case HOLIDAY: return "节假日";
            case SPECIAL: return "特殊排期";
            default: return "未知";
        }
    }
    
    default String getWeatherTypeName(WeatherRecord.WeatherType weatherType) {
        if (weatherType == null) return null;
        switch (weatherType) {
            case SUNNY: return "晴天";
            case CLOUDY: return "多云";
            case RAINY: return "雨天";
            case SNOWY: return "雪天";
            case FOGGY: return "雾天";
            case WINDY: return "大风";
            default: return "未知";
        }
    }
}
