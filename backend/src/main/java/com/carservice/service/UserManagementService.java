package com.carservice.service;

import com.carservice.dto.user.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 用户管理服务接口 - 移动端用户中心功能
 */
public interface UserManagementService {
    
    /**
     * 用户登录
     * @param loginDTO 登录信息
     * @return 用户信息和token
     */
    UserInfoDTO login(UserLoginDTO loginDTO);
    
    /**
     * 用户登出
     * @param userId 用户ID
     */
    void logout(String userId);
    
    /**
     * 获取用户信息
     * @param userId 用户ID
     * @return 用户信息
     */
    UserInfoDTO getUserInfo(String userId);
    
    /**
     * 更新用户基本信息
     * @param userId 用户ID
     * @param userInfo 用户信息
     * @return 更新后的用户信息
     */
    UserInfoDTO updateUserInfo(String userId, UserInfoDTO userInfo);
    
    /**
     * 修改密码
     * @param userId 用户ID
     * @param oldPassword 旧密码
     * @param newPassword 新密码
     */
    void changePassword(String userId, String oldPassword, String newPassword);
    
    /**
     * 上传头像
     * @param userId 用户ID
     * @param avatarFile 头像文件
     * @return 头像URL
     */
    String uploadAvatar(String userId, MultipartFile avatarFile);
    
    /**
     * 获取员工信息
     * @param userId 用户ID
     * @return 员工信息
     */
    EmployeeInfoDTO getEmployeeInfo(String userId);
    
    /**
     * 更新员工信息
     * @param userId 用户ID
     * @param employeeInfo 员工信息
     * @return 更新后的员工信息
     */
    EmployeeInfoDTO updateEmployeeInfo(String userId, EmployeeInfoDTO employeeInfo);
    
    /**
     * 获取个人信息
     * @param userId 用户ID
     * @return 个人信息
     */
    PersonInfoDTO getPersonInfo(String userId);
    
    /**
     * 更新个人信息
     * @param userId 用户ID
     * @param personInfo 个人信息
     * @return 更新后的个人信息
     */
    PersonInfoDTO updatePersonInfo(String userId, PersonInfoDTO personInfo);
    
    /**
     * 注册面部认证
     * @param userId 用户ID
     * @param faceImage 面部图像
     * @return 认证信息
     */
    FaceAuthDTO registerFaceAuth(String userId, MultipartFile faceImage);
    
    /**
     * 面部认证验证
     * @param userId 用户ID
     * @param faceImage 面部图像
     * @return 验证结果
     */
    Boolean verifyFaceAuth(String userId, MultipartFile faceImage);
    
    /**
     * 获取面部认证信息
     * @param userId 用户ID
     * @return 面部认证信息
     */
    FaceAuthDTO getFaceAuthInfo(String userId);
    
    /**
     * 更新面部认证状态
     * @param userId 用户ID
     * @param isActive 是否启用
     */
    void updateFaceAuthStatus(String userId, Boolean isActive);
}
