package com.carservice.service.impl;

import com.carservice.dto.booking.*;
import com.carservice.entity.*;
import com.carservice.mapper.BookingMapper;
import com.carservice.repository.*;
import com.carservice.service.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 预约服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {
    
    private final TestSiteRepository testSiteRepository;
    private final SiteScheduleRepository siteScheduleRepository;
    private final SiteBookingRepository siteBookingRepository;
    private final WeatherRecordRepository weatherRecordRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final TestContentRepository testContentRepository;
    private final BookingMapper bookingMapper;
    
    @Override
    @Transactional(readOnly = true)
    public Page<TestSiteDTO> getSites(String siteType, String status, Pageable pageable) {
        Page<TestSite> sites;
        
        if (siteType != null && status != null) {
            TestSite.SiteType type = TestSite.SiteType.valueOf(siteType);
            TestSite.SiteStatus siteStatus = TestSite.SiteStatus.valueOf(status);
            sites = testSiteRepository.findBySiteTypeAndStatus(type, siteStatus, pageable);
        } else if (siteType != null) {
            TestSite.SiteType type = TestSite.SiteType.valueOf(siteType);
            sites = testSiteRepository.findBySiteType(type, pageable);
        } else if (status != null) {
            TestSite.SiteStatus siteStatus = TestSite.SiteStatus.valueOf(status);
            sites = testSiteRepository.findByStatus(siteStatus, pageable);
        } else {
            sites = testSiteRepository.findAll(pageable);
        }
        
        return sites.map(bookingMapper::toTestSiteDTO);
    }
    
    @Override
    @Transactional(readOnly = true)
    public TestSiteDTO getSiteDetail(String siteId) {
        TestSite site = testSiteRepository.findBySiteId(siteId);
        if (site == null) {
            throw new RuntimeException("场地不存在");
        }
        return bookingMapper.toTestSiteDTO(site);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SiteScheduleDTO> getSiteSchedules(String siteId, LocalDateTime startTime, LocalDateTime endTime) {
        List<SiteSchedule> schedules = siteScheduleRepository.findBySiteIdAndTimeRange(siteId, startTime, endTime);
        return schedules.stream()
                .map(bookingMapper::toSiteScheduleDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Boolean checkSiteAvailability(String siteId, LocalDateTime startTime, LocalDateTime endTime) {
        // 检查是否有冲突的预约
        List<SiteBooking> conflictingBookings = siteBookingRepository.findConflictingBookings(siteId, startTime, endTime);
        
        if (!conflictingBookings.isEmpty()) {
            return false;
        }
        
        // 检查场地排期
        List<SiteSchedule> availableSchedules = siteScheduleRepository.findBySiteIdAndTimeRangeAndAvailability(
                siteId, startTime, endTime, true);
        
        return !availableSchedules.isEmpty();
    }
    
    @Override
    public SiteBookingDTO createBooking(SiteBookingDTO bookingDTO) {
        log.info("创建预约: {}", bookingDTO.getSiteId());
        
        // 验证场地可用性
        if (!checkSiteAvailability(bookingDTO.getSiteId(), bookingDTO.getStartTime(), bookingDTO.getEndTime())) {
            throw new RuntimeException("场地在该时间段不可用");
        }
        
        // 验证天气适宜性
        if (!checkWeatherSuitability(bookingDTO.getSiteId(), bookingDTO.getStartTime())) {
            log.warn("天气条件不适宜，但允许预约");
        }
        
        SiteBooking booking = bookingMapper.toSiteBooking(bookingDTO);
        booking.setStatus(SiteBooking.BookingStatus.PENDING);
        booking.setCreatedTime(LocalDateTime.now());
        booking.setUpdatedTime(LocalDateTime.now());
        
        booking = siteBookingRepository.save(booking);
        
        SiteBookingDTO result = bookingMapper.toSiteBookingDTO(booking);
        loadBookingRelatedInfo(result);
        
        return result;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<SiteBookingDTO> getUserBookings(String userId, String status, Pageable pageable) {
        Page<SiteBooking> bookings;
        
        if (status != null) {
            SiteBooking.BookingStatus bookingStatus = SiteBooking.BookingStatus.valueOf(status);
            bookings = siteBookingRepository.findByUserIdAndStatus(userId, bookingStatus, pageable);
        } else {
            bookings = siteBookingRepository.findByUserId(userId, pageable);
        }
        
        return bookings.map(booking -> {
            SiteBookingDTO dto = bookingMapper.toSiteBookingDTO(booking);
            loadBookingRelatedInfo(dto);
            return dto;
        });
    }
    
    @Override
    @Transactional(readOnly = true)
    public SiteBookingDTO getBookingDetail(String bookingId) {
        SiteBooking booking = siteBookingRepository.findByBookingId(bookingId);
        if (booking == null) {
            throw new RuntimeException("预约不存在");
        }
        
        SiteBookingDTO result = bookingMapper.toSiteBookingDTO(booking);
        loadBookingRelatedInfo(result);
        
        return result;
    }
    
    @Override
    public SiteBookingDTO updateBooking(String bookingId, SiteBookingDTO bookingDTO) {
        SiteBooking booking = siteBookingRepository.findByBookingId(bookingId);
        if (booking == null) {
            throw new RuntimeException("预约不存在");
        }
        
        // 如果修改了时间，需要重新检查可用性
        if (!booking.getStartTime().equals(bookingDTO.getStartTime()) || 
            !booking.getEndTime().equals(bookingDTO.getEndTime())) {
            if (!checkSiteAvailability(booking.getSiteId(), bookingDTO.getStartTime(), bookingDTO.getEndTime())) {
                throw new RuntimeException("场地在新时间段不可用");
            }
        }
        
        bookingMapper.updateSiteBooking(booking, bookingDTO);
        booking.setUpdatedTime(LocalDateTime.now());
        
        booking = siteBookingRepository.save(booking);
        
        return bookingMapper.toSiteBookingDTO(booking);
    }
    
    @Override
    public void cancelBooking(String bookingId, String reason) {
        SiteBooking booking = siteBookingRepository.findByBookingId(bookingId);
        if (booking == null) {
            throw new RuntimeException("预约不存在");
        }
        
        booking.setStatus(SiteBooking.BookingStatus.CANCELLED);
        booking.setNotes(booking.getNotes() + "\n取消原因: " + reason);
        booking.setUpdatedTime(LocalDateTime.now());
        
        siteBookingRepository.save(booking);
        
        log.info("预约 {} 已取消，原因: {}", bookingId, reason);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WeatherRecordDTO getWeatherInfo(String siteId, LocalDateTime date) {
        WeatherRecord weather = weatherRecordRepository.findLatestBySiteId(siteId);
        return weather != null ? bookingMapper.toWeatherRecordDTO(weather) : null;
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<WeatherRecordDTO> getWeatherHistory(String siteId, LocalDateTime startTime, LocalDateTime endTime) {
        List<WeatherRecord> records = weatherRecordRepository.findBySiteIdAndRecordTimeBetween(siteId, startTime, endTime);
        return records.stream()
                .map(bookingMapper::toWeatherRecordDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Boolean checkWeatherSuitability(String siteId, LocalDateTime testTime) {
        List<WeatherRecord> suitableWeather = weatherRecordRepository.findSuitableWeatherInTimeRange(
                siteId, testTime.minusHours(1), testTime.plusHours(1));
        
        return !suitableWeather.isEmpty();
    }
    
    // 私有辅助方法
    private void loadBookingRelatedInfo(SiteBookingDTO bookingDTO) {
        // 加载场地信息
        TestSite site = testSiteRepository.findBySiteId(bookingDTO.getSiteId());
        if (site != null) {
            bookingDTO.setSiteName(site.getSiteName());
            bookingDTO.setSiteInfo(bookingMapper.toTestSiteDTO(site));
        }
        
        // 加载用户信息
        User user = userRepository.findByUserId(bookingDTO.getUserId());
        if (user != null) {
            bookingDTO.setUserName(user.getRealName());
        }
        
        // 加载车辆信息
        if (bookingDTO.getVehicleId() != null) {
            Vehicle vehicle = vehicleRepository.findByVehicleId(bookingDTO.getVehicleId());
            if (vehicle != null) {
                bookingDTO.setVehiclePlateNo(vehicle.getPlateNo());
            }
        }
        
        // 加载试验内容信息
        if (bookingDTO.getTestContentId() != null) {
            TestContent testContent = testContentRepository.findByContentId(bookingDTO.getTestContentId());
            if (testContent != null) {
                bookingDTO.setTestContentName(testContent.getTestItem());
            }
        }
        
        // 加载天气信息
        WeatherRecord weather = weatherRecordRepository.findLatestBySiteId(bookingDTO.getSiteId());
        if (weather != null) {
            bookingDTO.setWeatherInfo(bookingMapper.toWeatherRecordDTO(weather));
        }
    }
}
