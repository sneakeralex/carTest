package com.carservice.common.api;

import lombok.Data;

import java.io.Serializable;

/**
 * 通用响应结果
 *
 * @param <T> 数据类型
 */
@Data
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    private int code;

    /**
     * 返回消息
     */
    private String message;

    /**
     * 返回数据
     */
    private T data;

    /**
     * 是否成功
     */
    private boolean success;

    /**
     * 私有构造方法
     */
    private Result() {
    }

    /**
     * 成功返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 成功返回结果
     *
     * @param data 返回数据
     * @param <T>  数据类型
     * @return 结果
     */
    public static <T> Result<T> success(T data) {
        return success(data, "操作成功");
    }

    /**
     * 成功返回结果
     *
     * @param data    返回数据
     * @param message 返回消息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> success(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(ResultCode.SUCCESS.getCode());
        result.setMessage(message);
        result.setData(data);
        result.setSuccess(true);
        return result;
    }

    /**
     * 失败返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> failed() {
        return failed(ResultCode.FAILED);
    }

    /**
     * 失败返回结果
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> failed(String message) {
        return failed(ResultCode.FAILED.getCode(), message);
    }

    /**
     * 失败返回结果
     *
     * @param errorCode 错误码
     * @param <T>       数据类型
     * @return 结果
     */
    public static <T> Result<T> failed(IErrorCode errorCode) {
        return failed(errorCode.getCode(), errorCode.getMessage());
    }

    /**
     * 失败返回结果
     *
     * @param code    错误码
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> failed(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setSuccess(false);
        return result;
    }

    /**
     * 参数验证失败返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> validateFailed() {
        return failed(ResultCode.VALIDATE_FAILED);
    }

    /**
     * 参数验证失败返回结果
     *
     * @param message 错误消息
     * @param <T>     数据类型
     * @return 结果
     */
    public static <T> Result<T> validateFailed(String message) {
        return failed(ResultCode.VALIDATE_FAILED.getCode(), message);
    }

    /**
     * 未登录返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> unauthorized() {
        return failed(ResultCode.UNAUTHORIZED);
    }

    /**
     * 未授权返回结果
     *
     * @param <T> 数据类型
     * @return 结果
     */
    public static <T> Result<T> forbidden() {
        return failed(ResultCode.FORBIDDEN);
    }
}