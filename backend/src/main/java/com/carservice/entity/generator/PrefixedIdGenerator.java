package com.carservice.entity.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 带前缀的ID生成器
 * 生成格式: PREFIX + YYYYMMDD + 6位序列号
 * 例如: MSG20241204000001, TS20241204000001
 * 
 * Entity	Prefix
BookingChange	BC
BookingReview	BR
EquipmentMessage	EQM
FaceAuth	FA
MessageDelivery	MD
MessageSetting	MS
MessageTemplate	MT
PersonInfo	PI
SiteBooking	SB
SiteMessage	SM
SiteSchedule	SS
TaskVehicle	TV
TestContent	TC
WeatherRecord	WR
 */
public class PrefixedIdGenerator implements IdentifierGenerator {
    
    private static final String PREFIX_PARAM = "prefix";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final AtomicLong counter = new AtomicLong(1);
    
    private String prefix;
    
    @Override
    public void configure(Properties params) {
        this.prefix = params.getProperty(PREFIX_PARAM, "ID");
    }
    
    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) 
            throws HibernateException {
        
        String dateStr = LocalDateTime.now().format(DATE_FORMATTER);
        long sequence = counter.getAndIncrement();
        
        // 重置计数器（每天重置）
        if (sequence > 999999) {
            counter.set(1);
            sequence = 1;
        }
        
        return String.format("%s%s%06d", prefix, dateStr, sequence);
    }
}
