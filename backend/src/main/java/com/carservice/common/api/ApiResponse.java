package com.carservice.common.api;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * 统一API响应格式
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    
    /**
     * 响应码
     */
    private Integer code;
    
    /**
     * 响应消息
     */
    private String message;
    
    /**
     * 响应数据
     */
    private T data;
    
    /**
     * 时间戳
     */
    private Long timestamp;
    
    /**
     * 成功响应
     */
    public static <T> ApiResponse<T> success(T data) {
        return success(data, "操作成功");
    }
    
    /**
     * 成功响应带消息
     */
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(200, message, data, System.currentTimeMillis());
    }
    
    /**
     * 失败响应
     */
    public static <T> ApiResponse<T> error(String message) {
        return error(500, message);
    }
    
    /**
     * 失败响应带错误码
     */
    public static <T> ApiResponse<T> error(Integer code, String message) {
        return new ApiResponse<>(code, message, null, System.currentTimeMillis());
    }
    
    /**
     * 参数错误响应
     */
    public static <T> ApiResponse<T> badRequest(String message) {
        return error(400, message);
    }
    
    /**
     * 未授权响应
     */
    public static <T> ApiResponse<T> unauthorized(String message) {
        return error(401, message);
    }
    
    /**
     * 禁止访问响应
     */
    public static <T> ApiResponse<T> forbidden(String message) {
        return error(403, message);
    }
    
    /**
     * 资源不存在响应
     */
    public static <T> ApiResponse<T> notFound(String message) {
        return error(404, message);
    }
    
    /**
     * 判断是否成功
     */
    public boolean isSuccess() {
        return code != null && code == 200;
    }
}
