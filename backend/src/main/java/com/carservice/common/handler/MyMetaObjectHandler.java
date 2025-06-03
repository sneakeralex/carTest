package com.carservice.common.handler;

import org.springframework.stereotype.Component;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.lang.reflect.Field;
import java.util.Date;

/**
 * JPA实体监听器，用于自动填充创建时间和更新时间
 */
@Component
public class MyMetaObjectHandler {

    /**
     * 实体保存前自动填充
     * @param entity 实体对象
     */
    @PrePersist
    public void prePersist(Object entity) {
        setFieldValue(entity, "createTime", new Date());
        setFieldValue(entity, "updateTime", new Date());
    }

    /**
     * 实体更新前自动填充
     * @param entity 实体对象
     */
    @PreUpdate
    public void preUpdate(Object entity) {
        setFieldValue(entity, "updateTime", new Date());
    }
    
    /**
     * 设置字段值
     * @param entity 实体对象
     * @param fieldName 字段名
     * @param value 字段值
     */
    private void setFieldValue(Object entity, String fieldName, Object value) {
        try {
            Field field = getField(entity.getClass(), fieldName);
            if (field != null) {
                field.setAccessible(true);
                field.set(entity, value);
            }
        } catch (Exception e) {
            // 忽略异常，如果字段不存在则不设置
        }
    }
    
    /**
     * 获取字段，包括父类字段
     * @param clazz 类
     * @param fieldName 字段名
     * @return 字段对象
     */
    private Field getField(Class<?> clazz, String fieldName) {
        Field field = null;
        while (clazz != null && field == null) {
            try {
                field = clazz.getDeclaredField(fieldName);
            } catch (NoSuchFieldException e) {
                clazz = clazz.getSuperclass();
            }
        }
        return field;
    }
}