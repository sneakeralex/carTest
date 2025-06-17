package com.carservice.mapper;

import com.carservice.dto.user.*;
import com.carservice.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

/**
 * 用户DTO映射器
 */
//@Mapper(componentModel = "spring")
public interface UserMapper {
    
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
    
    /**
     * User实体转UserInfoDTO
     */
    @Mapping(target = "statusName", expression = "java(getStatusName(user.getStatus()))")
    @Mapping(target = "employeeInfo", ignore = true)
    @Mapping(target = "personInfo", ignore = true)
    @Mapping(target = "faceAuth", ignore = true)
    UserInfoDTO toUserInfoDTO(User user);
    
    /**
     * EmployeeInfo实体转EmployeeInfoDTO
     */
    @Mapping(target = "statusName", expression = "java(getEmployeeStatusName(employeeInfo.getStatus()))")
    EmployeeInfoDTO toEmployeeInfoDTO(EmployeeInfo employeeInfo);
    
    /**
     * PersonInfo实体转PersonInfoDTO
     */
    @Mapping(target = "statusName", expression = "java(getPersonStatusName(personInfo.getStatus()))")
    PersonInfoDTO toPersonInfoDTO(PersonInfo personInfo);
    
    /**
     * FaceAuth实体转FaceAuthDTO
     */
    @Mapping(target = "statusName", expression = "java(getFaceAuthStatusName(faceAuth.getStatus()))")
    @Mapping(target = "faceImageUrl", ignore = true) // 需要特殊处理
    FaceAuthDTO toFaceAuthDTO(FaceAuth faceAuth);
    
    /**
     * UserInfoDTO转User实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    User toUser(UserInfoDTO userInfoDTO);
    
    /**
     * EmployeeInfoDTO转EmployeeInfo实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    EmployeeInfo toEmployeeInfo(EmployeeInfoDTO employeeInfoDTO);
    
    /**
     * PersonInfoDTO转PersonInfo实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    PersonInfo toPersonInfo(PersonInfoDTO personInfoDTO);
    
    /**
     * 更新User实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    void updateUser(@MappingTarget User user, UserInfoDTO userInfoDTO);
    
    /**
     * 更新EmployeeInfo实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "employeeId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    void updateEmployeeInfo(@MappingTarget EmployeeInfo employeeInfo, EmployeeInfoDTO employeeInfoDTO);
    
    /**
     * 更新PersonInfo实体
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "personId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdTime", ignore = true)
    @Mapping(target = "updatedTime", ignore = true)
    void updatePersonInfo(@MappingTarget PersonInfo personInfo, PersonInfoDTO personInfoDTO);
    
    // 辅助方法
    default String getStatusName(Integer status) {
        if (status == null) return null;
        switch (status) {
            case 0: return "禁用";
            case 1: return "正常";
            case 2: return "锁定";
            default: return "未知";
        }
    }
    
    default String getEmployeeStatusName(EmployeeInfo.EmployeeStatus status) {
        if (status == null) return null;
        return switch (status) {
            case ACTIVE -> "在职";
            case PROBATION -> "试用期";
            case SUSPENDED -> "停职";
            case TERMINATED -> "离职";
        };
    }

    default String getPersonStatusName(PersonInfo.PersonStatus status) {
        if (status == null) return null;
        return switch (status) {
            case PENDING -> "待审核";
            case ACTIVE -> "正常";
            case SUSPENDED -> "暂停";
            case BLACKLISTED -> "黑名单";
        };
    }
    
    default String getFaceAuthStatusName(FaceAuth.AuthStatus status) {
        if (status == null) return null;
        return switch (status) {
            case PENDING -> "待认证";
            case VERIFIED -> "已认证";
            case REJECTED -> "认证失败";
            case EXPIRED -> "已过期";
        };
    }
}
