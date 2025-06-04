package com.carservice.service.impl;

import com.carservice.dto.user.*;
import com.carservice.entity.*;
import com.carservice.mapper.UserMapper;
import com.carservice.repository.*;
import com.carservice.service.UserManagementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

/**
 * 用户管理服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class UserManagementServiceImpl implements UserManagementService {
    
    private final UserRepository userRepository;
    private final EmployeeInfoRepository employeeInfoRepository;
    private final PersonInfoRepository personInfoRepository;
    private final FaceAuthRepository faceAuthRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public UserInfoDTO login(UserLoginDTO loginDTO) {
        log.info("用户登录: {}", loginDTO.getUsername());
        
        User user = findUserByLoginType(loginDTO);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
            throw new RuntimeException("密码错误");
        }
        
        if (user.getStatus() != 1) {
            throw new RuntimeException("用户状态异常");
        }
        
        // 更新最后登录时间
        user.setLastLoginTime(LocalDateTime.now());
        userRepository.save(user);
        
        // 构建用户信息
        UserInfoDTO userInfo = userMapper.toUserInfoDTO(user);
        
        // 加载关联信息
        loadUserRelatedInfo(userInfo);
        
        return userInfo;
    }
    
    @Override
    public void logout(String userId) {
        log.info("用户登出: {}", userId);
        // 这里可以实现token失效等逻辑
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserInfoDTO getUserInfo(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        UserInfoDTO userInfo = userMapper.toUserInfoDTO(user);
        loadUserRelatedInfo(userInfo);
        
        return userInfo;
    }
    
    @Override
    public UserInfoDTO updateUserInfo(String userId, UserInfoDTO userInfo) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        userMapper.updateUser(user, userInfo);
        user.setUpdatedTime(LocalDateTime.now());
        userRepository.save(user);
        
        return userMapper.toUserInfoDTO(user);
    }
    
    @Override
    public void changePassword(String userId, String oldPassword, String newPassword) {
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("原密码错误");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedTime(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("用户 {} 修改密码成功", userId);
    }
    
    @Override
    public String uploadAvatar(String userId, MultipartFile avatarFile) {
        // TODO: 实现文件上传逻辑
        String avatarUrl = "http://example.com/avatar/" + userId + ".jpg";
        
        User user = userRepository.findByUserId(userId);
        if (user != null) {
            user.setAvatar(avatarUrl);
            user.setUpdatedTime(LocalDateTime.now());
            userRepository.save(user);
        }
        
        return avatarUrl;
    }
    
    @Override
    @Transactional(readOnly = true)
    public EmployeeInfoDTO getEmployeeInfo(String userId) {
        EmployeeInfo employeeInfo = employeeInfoRepository.findByUserId(userId);
        return employeeInfo != null ? userMapper.toEmployeeInfoDTO(employeeInfo) : null;
    }
    
    @Override
    public EmployeeInfoDTO updateEmployeeInfo(String userId, EmployeeInfoDTO employeeInfoDTO) {
        EmployeeInfo employeeInfo = employeeInfoRepository.findByUserId(userId);
        if (employeeInfo == null) {
            throw new RuntimeException("员工信息不存在");
        }
        
        userMapper.updateEmployeeInfo(employeeInfo, employeeInfoDTO);
        employeeInfo.setUpdatedTime(LocalDateTime.now());
        employeeInfoRepository.save(employeeInfo);
        
        return userMapper.toEmployeeInfoDTO(employeeInfo);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PersonInfoDTO getPersonInfo(String userId) {
        PersonInfo personInfo = personInfoRepository.findByUserId(userId);
        return personInfo != null ? userMapper.toPersonInfoDTO(personInfo) : null;
    }
    
    @Override
    public PersonInfoDTO updatePersonInfo(String userId, PersonInfoDTO personInfoDTO) {
        PersonInfo personInfo = personInfoRepository.findByUserId(userId);
        if (personInfo == null) {
            throw new RuntimeException("个人信息不存在");
        }
        
        userMapper.updatePersonInfo(personInfo, personInfoDTO);
        personInfo.setUpdatedTime(LocalDateTime.now());
        personInfoRepository.save(personInfo);
        
        return userMapper.toPersonInfoDTO(personInfo);
    }
    
    @Override
    public FaceAuthDTO registerFaceAuth(String userId, MultipartFile faceImage) {
        // TODO: 实现面部特征提取和存储
        FaceAuth faceAuth = faceAuthRepository.findByUserId(userId);
        if (faceAuth == null) {
            faceAuth = new FaceAuth();
            faceAuth.setUserId(userId);
        }
        
        faceAuth.setStatus(FaceAuth.AuthStatus.VERIFIED);
        faceAuth.setIsActive(true);
        faceAuth.setRegistrationTime(LocalDateTime.now());
        faceAuth.setUpdatedTime(LocalDateTime.now());
        
        faceAuthRepository.save(faceAuth);
        
        return userMapper.toFaceAuthDTO(faceAuth);
    }
    
    @Override
    public Boolean verifyFaceAuth(String userId, MultipartFile faceImage) {
        // TODO: 实现面部识别验证
        FaceAuth faceAuth = faceAuthRepository.findByUserId(userId);
        if (faceAuth == null || !faceAuth.getIsActive()) {
            return false;
        }
        
        // 更新验证记录
        faceAuth.setLastVerifyTime(LocalDateTime.now());
        faceAuth.setVerifyCount(faceAuth.getVerifyCount() + 1);
        faceAuthRepository.save(faceAuth);
        
        return true;
    }
    
    @Override
    @Transactional(readOnly = true)
    public FaceAuthDTO getFaceAuthInfo(String userId) {
        FaceAuth faceAuth = faceAuthRepository.findByUserId(userId);
        return faceAuth != null ? userMapper.toFaceAuthDTO(faceAuth) : null;
    }
    
    @Override
    public void updateFaceAuthStatus(String userId, Boolean isActive) {
        FaceAuth faceAuth = faceAuthRepository.findByUserId(userId);
        if (faceAuth != null) {
            faceAuth.setIsActive(isActive);
            faceAuth.setUpdatedTime(LocalDateTime.now());
            faceAuthRepository.save(faceAuth);
        }
    }
    
    // 私有辅助方法
    private User findUserByLoginType(UserLoginDTO loginDTO) {
        switch (loginDTO.getLoginType()) {
            case "phone":
                return userRepository.findByPhone(loginDTO.getUsername());
            case "employeeNo":
                EmployeeInfo emp = employeeInfoRepository.findByEmployeeNo(loginDTO.getUsername());
                return emp != null ? userRepository.findByUserId(emp.getUserId()) : null;
            case "idCard":
                PersonInfo person = personInfoRepository.findByIdCardNo(loginDTO.getUsername());
                return person != null ? userRepository.findByUserId(person.getUserId()) : null;
            default:
                return userRepository.findByUsername(loginDTO.getUsername());
        }
    }
    
    private void loadUserRelatedInfo(UserInfoDTO userInfo) {
        // 加载员工信息
        userInfo.setEmployeeInfo(getEmployeeInfo(userInfo.getUserId()));
        
        // 加载个人信息
        userInfo.setPersonInfo(getPersonInfo(userInfo.getUserId()));
        
        // 加载面部认证信息
        userInfo.setFaceAuth(getFaceAuthInfo(userInfo.getUserId()));
    }
}
