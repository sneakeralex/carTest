package com.carservice.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;
import java.util.Base64.Encoder;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;

/**
 * API 请求签名工具（兼容 Postman prescript）
 *
 * 主要方法：
 * - signRequest(...) 返回需要设置到请求头的键值对
 * - applyTo(...) 将签名直接写入 HttpHeaders
 *
 * 默认会将 Accept 和 Content-Type 列入 signature-headers（如果存在），也可以通过 headersToSign 参数指定额外的 header keys（大小写不敏感）
 */
public final class ApiSigner {

    private ApiSigner() {}

    public static String md5Base64(String data) {
        if (data == null || data.isEmpty()) return "";
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] digest = md.digest(data.getBytes(StandardCharsets.UTF_8));
            Encoder enc = Base64.getEncoder();
            return enc.encodeToString(digest);
        } catch (Exception e) {
            throw new RuntimeException("md5 failed", e);
        }
    }

    public static String hmacSha256Base64(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(key);
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(raw);
        } catch (Exception e) {
            throw new RuntimeException("hmacSha256 failed", e);
        }
    }

    public static String canonicalizeUrl(String fullUrl, String contentType, String body) {
        try {
            URI uri = new URI(fullUrl);
            String path = uri.getRawPath();
            Map<String, List<String>> params = new HashMap<>();

            String query = uri.getRawQuery();
            if (query != null && !query.isEmpty()) {
                parseQueryIntoMap(query, params);
            }

            if (contentType != null && contentType.startsWith("application/x-www-form-urlencoded") && body != null && !body.isEmpty()) {
                parseQueryIntoMap(body, params);
            }

            if (params.isEmpty()) {
                return path;
            }

            List<String> keys = new ArrayList<>(params.keySet());
            Collections.sort(keys);
            String qs = keys.stream()
                    .flatMap(k -> params.get(k).stream().map(v -> k + "=" + v))
                    .collect(Collectors.joining("&"));

            return path + "?" + qs;
        } catch (Exception e) {
            throw new RuntimeException("canonicalizeUrl failed", e);
        }
    }

    private static void parseQueryIntoMap(String qs, Map<String, List<String>> params) {
        String[] pairs = qs.split("&");
        for (String p : pairs) {
            if (p.isEmpty()) continue;
            String[] kv = p.split("=", 2);
            String k = urlDecode(kv[0]);
            String v = kv.length > 1 ? urlDecode(kv[1]) : "";
            params.computeIfAbsent(k, __ -> new ArrayList<>()).add(v);
        }
    }

    private static String urlDecode(String s) {
        try {
            return URLDecoder.decode(s, StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return s;
        }
    }

    /**
     * 生成签名相关 headers。
     *
     * @param method HTTP 方法，如 "GET"/"POST"
     * @param url 完整 URL
     * @param body 请求体字符串（若为表单且 contentType 为 application/x-www-form-urlencoded，会参与 canonicalizeUrl）
     * @param originalHeaders 原始 headers（可为 null），用于读取 Accept/Content-Type 等
     * @param appKey 应用 key（会放入 x-ca-key 与 appKey）
     * @param appSecret 用于生成 HMAC
     * @param headersToSign 需要包含在 X-Ca-Signature-Headers 的 header 名称（可为 null）；如果为空，默认包含 Accept 和 Content-Type（存在则包含）
     * @return map 包含要设置的 header 键值对
     */
    public static Map<String, String> signRequest(String method,
                                                  String url,
                                                  String body,
                                                  Map<String, String> originalHeaders,
                                                  String appKey,
                                                  String appSecret,
                                                  Collection<String> headersToSign) {

        String accept = headerValueIgnoreCase(originalHeaders, "Accept");
        String contentType = headerValueIgnoreCase(originalHeaders, "Content-Type");

        String md5 = md5Base64(body);
        String timestamp = String.valueOf(Instant.now().toEpochMilli());
        String nonce = UUID.randomUUID().toString();

        String canonicalUrl = canonicalizeUrl(url, contentType, body);

        StringBuilder textToSign = new StringBuilder();
        textToSign.append(method == null ? "" : method).append("\n");
        textToSign.append(accept == null ? "" : accept).append("\n");
        textToSign.append(contentType == null ? "" : contentType).append("\n");
        textToSign.append(canonicalUrl);

        String signature = hmacSha256Base64(textToSign.toString(), appSecret);

        // 构造 signature headers 列表
        List<String> finalHeadersToSign;
        if (headersToSign == null || headersToSign.isEmpty()) {
            finalHeadersToSign = new ArrayList<>();
            if (accept != null && !accept.isEmpty()) finalHeadersToSign.add("Accept");
            if (contentType != null && !contentType.isEmpty()) finalHeadersToSign.add("Content-Type");
        } else {
            finalHeadersToSign = headersToSign.stream()
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }
        // 标准化为小写并排序（返回值通常为小写逗号/分号分隔）
        String signatureHeaders = finalHeadersToSign.stream()
                .map(String::toLowerCase)
                .sorted()
                .collect(Collectors.joining(";"));

        Map<String, String> out = new LinkedHashMap<>();
        out.put("x-ca-key", appKey);
        out.put("X-Ca-Key", appKey); // 兼容大小写不同的接收端
        out.put("appKey", appKey);   // 如截图显示
        out.put("x-ca-timestamp", timestamp);
        out.put("X-Ca-Timestamp", timestamp);
        out.put("x-ca-nonce", nonce);
        out.put("X-Ca-Nonce", nonce);
        out.put("x-ca-signature", signature);
        out.put("X-Ca-Signature", signature);
        out.put("X-Requested-With", "XMLHttpRequest");
        if (signatureHeaders != null && !signatureHeaders.isEmpty()) {
            out.put("x-ca-signature-headers", signatureHeaders);
            out.put("X-Ca-Signature-Headers", signatureHeaders);
        }
        if (md5 != null && !md5.isEmpty()) {
            out.put("Content-MD5", md5);
            out.put("Md5", md5);
        }
        return out;
    }

    /**
     * 方便的重载：不指定 headersToSign（将默认使用 Accept/Content-Type）
     */
    public static Map<String, String> signRequest(String method,
                                                  String url,
                                                  String body,
                                                  Map<String, String> originalHeaders,
                                                  String appKey,
                                                  String appSecret) {
        return signRequest(method, url, body, originalHeaders, appKey, appSecret, null);
    }

    /**
     * 将签名 headers 写入 Spring HttpHeaders（不会删除已有 headers，仅覆盖同名字段）
     */
    public static void applyTo(HttpHeaders httpHeaders,
                               String method,
                               String url,
                               String body,
                               Map<String, String> originalHeaders,
                               String appKey,
                               String appSecret,
                               Collection<String> headersToSign) {
        Map<String, String> sig = signRequest(method, url, body, originalHeaders, appKey, appSecret, headersToSign);
        sig.forEach((k, v) -> {
            if (v != null) {
                httpHeaders.set(k, v);
            }
        });
    }

    private static String headerValueIgnoreCase(Map<String, String> headers, String key) {
        if (headers == null || key == null) return null;
        for (Map.Entry<String, String> e : headers.entrySet()) {
            if (key.equalsIgnoreCase(e.getKey())) return e.getValue();
        }
        return null;
    }
}