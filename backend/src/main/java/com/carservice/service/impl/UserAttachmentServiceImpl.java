package com.carservice.service.impl;

import com.carservice.config.FileStorageProperties;
import com.carservice.entity.User;
import com.carservice.entity.UserAttachment;
import com.carservice.repository.UserAttachmentRepository;
import com.carservice.repository.UserRepository;
import com.carservice.service.UserAttachmentService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserAttachmentServiceImpl implements UserAttachmentService {

    private final UserRepository userRepository;
    private final UserAttachmentRepository attachmentRepository;
    private final FileStorageProperties fileStorageProperties;

    @Override
    @Transactional
    public UserAttachment storeFile(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileName = UUID.randomUUID().toString() + "_" + originalFileName;

        try {
            if (fileName.contains("..")) {
                throw new RuntimeException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            Path uploadDir = Paths.get(fileStorageProperties.getUploadDir())
                    .toAbsolutePath()
                    .normalize();
            Files.createDirectories(uploadDir);

            Path targetLocation = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            UserAttachment attachment = new UserAttachment();
            attachment.setUser(user);
            attachment.setFileName(originalFileName);
            attachment.setFileUrl(getFileUrl(fileName));
            attachment.setFileType(file.getContentType());
            attachment.setFileSize(file.getSize());

            return attachmentRepository.save(attachment);

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    @Override
    public UserAttachment getAttachment(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found with id: " + attachmentId));
    }

    @Override
    public List<UserAttachment> getAttachmentsByUserId(Long userId) {
        return attachmentRepository.findByUserId(userId);
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId) {
        UserAttachment attachment = getAttachment(attachmentId);
        
        try {
            Path filePath = Paths.get(fileStorageProperties.getUploadDir())
                    .toAbsolutePath()
                    .normalize()
                    .resolve(getFileNameFromUrl(attachment.getFileUrl()));
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            throw new RuntimeException("Error deleting file", ex);
        }

        attachmentRepository.delete(attachment);
    }

    @Override
    public String getFileUrl(String fileName) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/user-attachments/download/")
                .path(fileName)
                .toUriString();
    }

    private String getFileNameFromUrl(String fileUrl) {
        return fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
    }
}
