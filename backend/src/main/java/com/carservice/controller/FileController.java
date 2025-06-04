package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.service.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 文件管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Tag(name = "文件管理", description = "文件上传、下载、管理等功能")
public class FileController {
    
    private final FileService fileService;
    
    /**
     * 上传单个文件
     */
    @PostMapping("/upload")
    @Operation(summary = "上传单个文件")
    public ResponseEntity<ApiResponse<FileInfoDTO>> uploadFile(
            @Parameter(description = "文件") @RequestParam("file") MultipartFile file,
            @Parameter(description = "文件类型") @RequestParam(required = false) String fileType,
            @Parameter(description = "文件描述") @RequestParam(required = false) String description,
            @Parameter(description = "上传者ID") @RequestParam String uploaderId) {
        try {
            FileInfoDTO fileInfo = fileService.uploadFile(file, fileType, description, uploaderId);
            log.info("上传单个文件成功: 文件名={}, 大小={}, 上传者={}", file.getOriginalFilename(), file.getSize(), uploaderId);
            return ResponseEntity.ok(ApiResponse.success(fileInfo, "文件上传成功"));
        } catch (Exception e) {
            log.error("上传单个文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 批量上传文件
     */
    @PostMapping("/batch-upload")
    @Operation(summary = "批量上传文件")
    public ResponseEntity<ApiResponse<List<FileInfoDTO>>> batchUploadFiles(
            @Parameter(description = "文件列表") @RequestParam("files") List<MultipartFile> files,
            @Parameter(description = "文件类型") @RequestParam(required = false) String fileType,
            @Parameter(description = "上传者ID") @RequestParam String uploaderId) {
        try {
            List<FileInfoDTO> fileInfos = fileService.batchUploadFiles(files, fileType, uploaderId);
            log.info("批量上传文件成功: 文件数量={}, 上传者={}", files.size(), uploaderId);
            return ResponseEntity.ok(ApiResponse.success(fileInfos, "批量文件上传成功"));
        } catch (Exception e) {
            log.error("批量上传文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 下载文件
     */
    @GetMapping("/download/{fileId}")
    @Operation(summary = "下载文件")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
        try {
            Resource resource = fileService.downloadFile(fileId);
            FileInfoDTO fileInfo = fileService.getFileInfo(fileId);
            log.info("下载文件成功: {}", fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileInfo.getFileName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            log.error("下载文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * 获取文件信息
     */
    @GetMapping("/{fileId}")
    @Operation(summary = "获取文件信息")
    public ResponseEntity<ApiResponse<FileInfoDTO>> getFileInfo(@PathVariable String fileId) {
        try {
            FileInfoDTO fileInfo = fileService.getFileInfo(fileId);
            log.info("获取文件信息成功: {}", fileId);
            return ResponseEntity.ok(ApiResponse.success(fileInfo));
        } catch (Exception e) {
            log.error("获取文件信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 获取文件列表
     */
    @GetMapping
    @Operation(summary = "获取文件列表", description = "支持按文件类型、上传者筛选")
    public ResponseEntity<ApiResponse<Page<FileInfoDTO>>> getFileList(
            @Parameter(description = "文件类型") @RequestParam(required = false) String fileType,
            @Parameter(description = "上传者ID") @RequestParam(required = false) String uploaderId,
            @Parameter(description = "关键词搜索") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "每页大小") @RequestParam(defaultValue = "10") int size) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<FileInfoDTO> files = fileService.getFileList(fileType, uploaderId, keyword, pageable);
            log.info("获取文件列表成功: 类型={}, 上传者={}, 关键词={}", fileType, uploaderId, keyword);
            return ResponseEntity.ok(ApiResponse.success(files));
        } catch (Exception e) {
            log.error("获取文件列表失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 删除文件
     */
    @DeleteMapping("/{fileId}")
    @Operation(summary = "删除文件")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String fileId) {
        try {
            fileService.deleteFile(fileId);
            log.info("删除文件成功: {}", fileId);
            return ResponseEntity.ok(ApiResponse.success(null, "删除文件成功"));
        } catch (Exception e) {
            log.error("删除文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 批量删除文件
     */
    @PostMapping("/batch-delete")
    @Operation(summary = "批量删除文件")
    public ResponseEntity<ApiResponse<Void>> batchDeleteFiles(@RequestBody BatchDeleteRequest request) {
        try {
            fileService.batchDeleteFiles(request.getFileIds());
            log.info("批量删除文件成功: 数量={}", request.getFileIds().size());
            return ResponseEntity.ok(ApiResponse.success(null, "批量删除文件成功"));
        } catch (Exception e) {
            log.error("批量删除文件失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取文件预览URL
     */
    @GetMapping("/{fileId}/preview")
    @Operation(summary = "获取文件预览URL")
    public ResponseEntity<ApiResponse<String>> getFilePreviewUrl(@PathVariable String fileId) {
        try {
            String previewUrl = fileService.getFilePreviewUrl(fileId);
            log.info("获取文件预览URL成功: {}", fileId);
            return ResponseEntity.ok(ApiResponse.success(previewUrl));
        } catch (Exception e) {
            log.error("获取文件预览URL失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 更新文件信息
     */
    @PutMapping("/{fileId}")
    @Operation(summary = "更新文件信息")
    public ResponseEntity<ApiResponse<FileInfoDTO>> updateFileInfo(
            @PathVariable String fileId,
            @RequestBody UpdateFileInfoRequest request) {
        try {
            FileInfoDTO fileInfo = fileService.updateFileInfo(fileId, request);
            log.info("更新文件信息成功: {}", fileId);
            return ResponseEntity.ok(ApiResponse.success(fileInfo, "文件信息更新成功"));
        } catch (Exception e) {
            log.error("更新文件信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * 获取文件统计信息
     */
    @GetMapping("/stats")
    @Operation(summary = "获取文件统计信息")
    public ResponseEntity<ApiResponse<FileStatsDTO>> getFileStats(
            @Parameter(description = "上传者ID") @RequestParam(required = false) String uploaderId) {
        try {
            FileStatsDTO stats = fileService.getFileStats(uploaderId);
            log.info("获取文件统计信息成功: 上传者={}", uploaderId);
            return ResponseEntity.ok(ApiResponse.success(stats));
        } catch (Exception e) {
            log.error("获取文件统计信息失败: {}", e.getMessage());
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
    
    /**
     * 文件信息DTO
     */
    public static class FileInfoDTO {
        private String fileId;
        private String fileName;
        private String originalFileName;
        private String fileType;
        private String mimeType;
        private Long fileSize;
        private String filePath;
        private String fileUrl;
        private String description;
        private String uploaderId;
        private String uploaderName;
        private LocalDateTime uploadTime;
        private Integer downloadCount;
        
        // Getters and Setters
        public String getFileId() { return fileId; }
        public void setFileId(String fileId) { this.fileId = fileId; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getOriginalFileName() { return originalFileName; }
        public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
        public String getFileType() { return fileType; }
        public void setFileType(String fileType) { this.fileType = fileType; }
        public String getMimeType() { return mimeType; }
        public void setMimeType(String mimeType) { this.mimeType = mimeType; }
        public Long getFileSize() { return fileSize; }
        public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
        public String getFilePath() { return filePath; }
        public void setFilePath(String filePath) { this.filePath = filePath; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getUploaderId() { return uploaderId; }
        public void setUploaderId(String uploaderId) { this.uploaderId = uploaderId; }
        public String getUploaderName() { return uploaderName; }
        public void setUploaderName(String uploaderName) { this.uploaderName = uploaderName; }
        public LocalDateTime getUploadTime() { return uploadTime; }
        public void setUploadTime(LocalDateTime uploadTime) { this.uploadTime = uploadTime; }
        public Integer getDownloadCount() { return downloadCount; }
        public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }
    }
    
    /**
     * 批量删除请求DTO
     */
    public static class BatchDeleteRequest {
        private List<String> fileIds;
        
        public List<String> getFileIds() { return fileIds; }
        public void setFileIds(List<String> fileIds) { this.fileIds = fileIds; }
    }
    
    /**
     * 更新文件信息请求DTO
     */
    public static class UpdateFileInfoRequest {
        private String fileName;
        private String description;
        
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    /**
     * 文件统计DTO
     */
    public static class FileStatsDTO {
        private Integer totalFiles;
        private Long totalSize;
        private Integer imageFiles;
        private Integer documentFiles;
        private Integer videoFiles;
        private Integer otherFiles;
        
        // Getters and Setters
        public Integer getTotalFiles() { return totalFiles; }
        public void setTotalFiles(Integer totalFiles) { this.totalFiles = totalFiles; }
        public Long getTotalSize() { return totalSize; }
        public void setTotalSize(Long totalSize) { this.totalSize = totalSize; }
        public Integer getImageFiles() { return imageFiles; }
        public void setImageFiles(Integer imageFiles) { this.imageFiles = imageFiles; }
        public Integer getDocumentFiles() { return documentFiles; }
        public void setDocumentFiles(Integer documentFiles) { this.documentFiles = documentFiles; }
        public Integer getVideoFiles() { return videoFiles; }
        public void setVideoFiles(Integer videoFiles) { this.videoFiles = videoFiles; }
        public Integer getOtherFiles() { return otherFiles; }
        public void setOtherFiles(Integer otherFiles) { this.otherFiles = otherFiles; }
    }
}
