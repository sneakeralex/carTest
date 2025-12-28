package com.carservice.controller;

import com.carservice.common.api.ApiResponse;
import com.carservice.util.ApiSigner;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.net.URI;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * API代理控制器
 * 用于调用内网接口，自动添加API签名
 */
@Slf4j
@RestController
@RequestMapping("/api/proxy")
@RequiredArgsConstructor
public class ApiProxyController {

    private final RestTemplate restTemplate;

    @Value("${internal.api.base-url:http://localhost:8080}")
    private String internalApiBaseUrl;

    @Value("${api.signing.key}")
    private String appKey;

    @Value("${api.signing.secret}")
    private String appSecret;

    /**
     * 代理GET请求到内网API
     */
    @GetMapping("/**")
    public ResponseEntity<?> proxyGet(HttpServletRequest request) throws IOException {
        return proxyRequest(request, HttpMethod.GET, null);
    }

    /**
     * 代理POST请求到内网API
     */
    @PostMapping("/**")
    public ResponseEntity<?> proxyPost(HttpServletRequest request) throws IOException {
        String body = StreamUtils.copyToString(request.getInputStream(), java.nio.charset.StandardCharsets.UTF_8);
        return proxyRequest(request, HttpMethod.POST, body);
    }

    /**
     * 代理PUT请求到内网API
     */
    @PutMapping("/**")
    public ResponseEntity<?> proxyPut(HttpServletRequest request) throws IOException {
        String body = StreamUtils.copyToString(request.getInputStream(), java.nio.charset.StandardCharsets.UTF_8);
        return proxyRequest(request, HttpMethod.PUT, body);
    }

    /**
     * 代理DELETE请求到内网API
     */
    @DeleteMapping("/**")
    public ResponseEntity<?> proxyDelete(HttpServletRequest request) throws IOException {
        return proxyRequest(request, HttpMethod.DELETE, null);
    }

    /**
     * 通用代理方法
     */
    private ResponseEntity<?> proxyRequest(HttpServletRequest request, HttpMethod method, String body) {
        try {
            // 构建内网API URL
            String path = extractPath(request);
            String internalUrl = internalApiBaseUrl + path;

            // 如果有查询参数，添加到URL
            String queryString = request.getQueryString();
            if (queryString != null && !queryString.isEmpty()) {
                internalUrl += "?" + queryString;
            }

            log.info("代理请求: {} {} -> {}", method, request.getRequestURI(), internalUrl);

            // 构建请求头
            HttpHeaders headers = new HttpHeaders();
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                // 跳过一些不应该转发的headers
                if (!shouldForwardHeader(headerName)) {
                    continue;
                }
                Enumeration<String> headerValues = request.getHeaders(headerName);
                while (headerValues.hasMoreElements()) {
                    headers.add(headerName, headerValues.nextElement());
                }
            }

            // 设置Content-Type如果有body
            if (body != null && !body.isEmpty()) {
                headers.setContentType(MediaType.APPLICATION_JSON);
            }

            // 构建原始headers Map用于签名
            Map<String, String> originalHeaders = new HashMap<>();
            for (String headerName : headers.keySet()) {
                String headerValue = headers.getFirst(headerName);
                if (headerValue != null) {
                    originalHeaders.put(headerName, headerValue);
                }
            }

            // 生成签名headers
            Map<String, String> signedHeaders = ApiSigner.signRequest(method.name(), internalUrl, body, originalHeaders, appKey, appSecret, null);

            // 将签名headers添加到请求头
            for (Map.Entry<String, String> entry : signedHeaders.entrySet()) {
                headers.set(entry.getKey(), entry.getValue());
            }

            // 构建请求实体
            HttpEntity<String> requestEntity = new HttpEntity<>(body, headers);

            // 调用内网API（RestTemplate已经配置了签名拦截器）
            ResponseEntity<String> response = restTemplate.exchange(
                URI.create(internalUrl),
                method,
                requestEntity,
                String.class
            );

            log.info("代理响应: {} - {}", response.getStatusCode(), response.getBody() != null ? response.getBody().length() + " chars" : "empty");

            // 返回响应
            return ResponseEntity
                .status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());

        } catch (Exception e) {
            log.error("代理请求失败: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("代理请求失败: " + e.getMessage()));
        }
    }

    /**
     * 提取请求路径
     */
    private String extractPath(HttpServletRequest request) {
        String requestUri = request.getRequestURI();

        // 移除 /api/proxy 前缀
        String proxyPrefix = "/api/proxy";
        if (requestUri.startsWith(proxyPrefix)) {
            return requestUri.substring(proxyPrefix.length());
        }

        return requestUri;
    }

    /**
     * 判断是否应该转发请求头
     */
    private boolean shouldForwardHeader(String headerName) {
        // 不转发的headers
        return !headerName.equalsIgnoreCase("host") &&
               !headerName.equalsIgnoreCase("connection") &&
               !headerName.equalsIgnoreCase("keep-alive") &&
               !headerName.equalsIgnoreCase("proxy-authenticate") &&
               !headerName.equalsIgnoreCase("proxy-authorization") &&
               !headerName.equalsIgnoreCase("te") &&
               !headerName.equalsIgnoreCase("trailers") &&
               !headerName.equalsIgnoreCase("transfer-encoding") &&
               !headerName.equalsIgnoreCase("upgrade");
    }
}
