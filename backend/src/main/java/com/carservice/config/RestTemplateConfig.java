package com.carservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * RestTemplate 配置类
 * 配置带有API签名拦截器的RestTemplate
 */
@Configuration
public class RestTemplateConfig {

    /**
     * 签名版本的RestTemplate，作为默认的RestTemplate
     */
    @Bean
    @Primary
    public RestTemplate signedRestTemplate(ApiSigningInterceptor apiSigningInterceptor) {
        RestTemplate restTemplate = new RestTemplate();

        // 添加签名拦截器
        List<ClientHttpRequestInterceptor> interceptors = new ArrayList<>();
        interceptors.add(apiSigningInterceptor);
        restTemplate.setInterceptors(interceptors);

        return restTemplate;
    }

    /**
     * 无签名版本的RestTemplate，用于不需要签名的场景
     */
    @Bean("plainRestTemplate")
    public RestTemplate plainRestTemplate() {
        return new RestTemplate();
    }
}