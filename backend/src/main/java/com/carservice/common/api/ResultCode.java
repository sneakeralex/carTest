package com.carservice.common.api;

/**
 * 常用API返回码枚举
 */
public enum ResultCode implements IErrorCode {
    
    /**
     * 操作成功
     */
    SUCCESS(200, "操作成功"),
    
    /**
     * 操作失败
     */
    FAILED(500, "操作失败"),
    
    /**
     * 参数检验失败
     */
    VALIDATE_FAILED(400, "参数检验失败"),
    
    /**
     * 暂未登录或token已经过期
     */
    UNAUTHORIZED(401, "暂未登录或token已经过期"),
    
    /**
     * 没有相关权限
     */
    FORBIDDEN(403, "没有相关权限"),
    
    /**
     * 资源不存在
     */
    NOT_FOUND(404, "资源不存在");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }
}