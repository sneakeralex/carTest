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
@Mapper(componentModel = "spring")
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
        switch (status) {
            case ACTIVE: return "在职";
            case PROBATION: return "试用期";
            case TERMINATED: return "离职";
            default: return "未知";
        }
    }
    
    default String getPersonStatusName(PersonInfo.PersonStatus status) {
        if (status == null) return null;
        switch (status) {
            case PENDING: return "待审核";
            case ACTIVE: return "正常";
            case SUSPENDED: return "暂停";
            case REJECTED: return "已拒绝";
            default: return "未知";
        }
    }
    
    default String getFaceAuthStatusName(FaceAuth.AuthStatus status) {
        if (status == null) return null;
        switch (status) {
            case PENDING: return "待认证";
            case VERIFIED: return "已认证";
            case FAILED: return "认证失败";
            case EXPIRED: return "已过期";
            default: return "未知";
        }
    }
}
