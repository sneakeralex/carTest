package com.carservice.entity.generator;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.Type;

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

    public PrefixedIdGenerator() {
    }

    public PrefixedIdGenerator(String prefix) {
        this.prefix = prefix;
    }

    /**
     * 静态方法生成ID
     */
    public static String generateId(String prefix) {
        String date = LocalDateTime.now().format(DATE_FORMATTER);
        long sequence = counter.getAndIncrement();
        if (sequence > 999999) {
            counter.set(1);
            sequence = 1;
        }
        return String.format("%s%s%06d", prefix, date, sequence);
    }
    
    @Override
    public void configure(Type type, Properties parameters, ServiceRegistry serviceRegistry) {
        this.prefix = parameters.getProperty(PREFIX_PARAM, "ID");
    }
    
    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object) 
            throws HibernateException {
        return generateId(prefix);
    }
}
