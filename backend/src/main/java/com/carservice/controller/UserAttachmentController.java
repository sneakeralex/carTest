package com.carservice.controller;

import com.carservice.common.api.Result;
import com.carservice.dto.UserAttachmentDTO;
import com.carservice.entity.UserAttachment;
import com.carservice.service.UserAttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import com.carservice.config.FileStorageProperties;
@RestController
@RequestMapping("/api/user-attachments")
@RequiredArgsConstructor
public class UserAttachmentController {

    private final UserAttachmentService attachmentService;
    private final FileStorageProperties fileStorageProperties;

    @PostMapping("/upload/{userId}")
    public ResponseEntity<Result<UserAttachmentDTO>> uploadFile(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        UserAttachment attachment = attachmentService.storeFile(userId, file);
        return ResponseEntity.status(201).body(Result.success(convertToDTO(attachment)));
    }

    @GetMapping("/{attachmentId}")
    public ResponseEntity<Result<UserAttachmentDTO>> getAttachment(@PathVariable Long attachmentId) {
        UserAttachment attachment = attachmentService.getAttachment(attachmentId);
        return ResponseEntity.ok(Result.success(convertToDTO(attachment)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Result<List<UserAttachmentDTO>>> getAttachmentsByUserId(@PathVariable Long userId) {
        List<UserAttachment> attachments = attachmentService.getAttachmentsByUserId(userId);
        List<UserAttachmentDTO> dtos = attachments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(Result.success(dtos));
    }

    @DeleteMapping("/{attachmentId}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long attachmentId) {
        attachmentService.deleteAttachment(attachmentId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            Path filePath = Paths.get(fileStorageProperties.getUploadDir())
                    .toAbsolutePath()
                    .normalize()
                    .resolve(fileName);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException ex) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private UserAttachmentDTO convertToDTO(UserAttachment attachment) {
        UserAttachmentDTO dto = new UserAttachmentDTO();
        BeanUtils.copyProperties(attachment, dto);
        dto.setUserId(attachment.getUser().getId());
        return dto;
    }
}
