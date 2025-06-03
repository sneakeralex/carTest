package com.carservice.service;

import com.carservice.entity.UserAttachment;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface UserAttachmentService {
    UserAttachment storeFile(Long userId, MultipartFile file);
    UserAttachment getAttachment(Long attachmentId);
    List<UserAttachment> getAttachmentsByUserId(Long userId);
    void deleteAttachment(Long attachmentId);
    String getFileUrl(String fileName);
}
