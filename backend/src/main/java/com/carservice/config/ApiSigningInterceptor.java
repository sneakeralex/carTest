package com.carservice.config;

import com.carservice.util.ApiSigner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.util.*;
import java.util.stream.Collectors;

/**
 * RestTemplate 请求拦截器：在发送请求前为请求添加签名头
 */
@Component
public class ApiSigningInterceptor implements ClientHttpRequestInterceptor {

    @Value("${api.sign.app-key:}")
    private String appKey;

    @Value("${api.sign.app-secret:}")
    private String appSecret;

    // 可选的 headers-to-sign 配置，逗号分隔
    @Value("${api.sign.headers-to-sign:}")
    private String headersToSignConfig;

    public ApiSigningInterceptor() {
    }

    @Override
    public @NonNull ClientHttpResponse intercept(@NonNull HttpRequest request, @NonNull byte[] body, @NonNull ClientHttpRequestExecution execution) throws IOException {
        HttpHeaders headers = request.getHeaders();

        // 构造 originalHeaders map（只取每个 header 的第一个值）
        Map<String, String> original = new HashMap<>();
        headers.forEach((k, v) -> {
            if (v != null && !v.isEmpty()) {
                original.put(k, v.get(0));
            }
        });

        // URL
        URI uri = request.getURI();
        String url = uri.toString();

        // body
        String bodyStr = null;
        if (body != null && body.length > 0) {
            bodyStr = new String(body, java.nio.charset.StandardCharsets.UTF_8);
        }

        // 解析可选的 headersToSign
        Collection<String> headersToSign = null;
        if (headersToSignConfig != null && !headersToSignConfig.trim().isEmpty()) {
            headersToSign = Arrays.stream(headersToSignConfig.split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        Map<String, String> sig = ApiSigner.signRequest(request.getMethod().name(), url, bodyStr, original, appKey, appSecret, headersToSign);

        // 写入 headers
        sig.forEach((k, v) -> headers.set(k, v));

        return execution.execute(request, body != null ? body : new byte[0]);
    }
}
