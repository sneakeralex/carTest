package com.carservice.service;

import com.carservice.controller.FileController.*;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 文件服务接口
 */
public interface FileService {
    
    /**
     * 上传单个文件
     */
    FileInfoDTO uploadFile(MultipartFile file, String fileType, String description, String uploaderId);
    
    /**
     * 批量上传文件
     */
    List<FileInfoDTO> batchUploadFiles(List<MultipartFile> files, String fileType, String uploaderId);
    
    /**
     * 下载文件
     */
    Resource downloadFile(String fileId);
    
    /**
     * 获取文件信息
     */
    FileInfoDTO getFileInfo(String fileId);
    
    /**
     * 获取文件列表
     */
    Page<FileInfoDTO> getFileList(String fileType, String uploaderId, String keyword, Pageable pageable);
    
    /**
     * 删除文件
     */
    void deleteFile(String fileId);
    
    /**
     * 批量删除文件
     */
    void batchDeleteFiles(List<String> fileIds);
    
    /**
     * 获取文件预览URL
     */
    String getFilePreviewUrl(String fileId);
    
    /**
     * 更新文件信息
     */
    FileInfoDTO updateFileInfo(String fileId, UpdateFileInfoRequest request);
    
    /**
     * 获取文件统计信息
     */
    FileStatsDTO getFileStats(String uploaderId);
}
