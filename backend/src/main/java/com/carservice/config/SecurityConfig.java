package com.carservice.config;

import com.carservice.security.JwtAuthenticationTokenFilter;
import com.carservice.security.RestAuthenticationEntryPoint;
import com.carservice.security.RestfulAccessDeniedHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security配置
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    /**
     * 自定义未登录或登录过期处理类
     */
    private final RestAuthenticationEntryPoint restAuthenticationEntryPoint;

    /**
     * 自定义无权限处理类
     */
    private final RestfulAccessDeniedHandler restfulAccessDeniedHandler;

    /**
     * JWT过滤器
     */
    private final JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter;

    public SecurityConfig(RestAuthenticationEntryPoint restAuthenticationEntryPoint,
                          RestfulAccessDeniedHandler restfulAccessDeniedHandler,
                          JwtAuthenticationTokenFilter jwtAuthenticationTokenFilter) {
        this.restAuthenticationEntryPoint = restAuthenticationEntryPoint;
        this.restfulAccessDeniedHandler = restfulAccessDeniedHandler;
        this.jwtAuthenticationTokenFilter = jwtAuthenticationTokenFilter;
    }

    /**
     * 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 认证管理器
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * 安全过滤器链
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                // 关闭csrf
                .csrf(csrf -> csrf.disable())
                // 不通过Session获取SecurityContext
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(requests -> requests
                        // 允许对于网站静态资源的无授权访问
                        .requestMatchers("/swagger-ui.html", "/swagger-resources/**", "/webjars/**", "/v2/**", "/doc.html").permitAll()
                        // 对登录注册允许匿名访问
                        .requestMatchers("/auth/login", "/auth/register").permitAll()
                        // 除上面外的所有请求全部需要鉴权认证
                        .anyRequest().authenticated());

        // 禁用缓存
        httpSecurity.headers(headers -> headers.disable());
        // 添加JWT filter
        httpSecurity.addFilterBefore(jwtAuthenticationTokenFilter, UsernamePasswordAuthenticationFilter.class);
        // 添加自定义未授权和未登录结果返回
        httpSecurity.exceptionHandling(handling -> handling
                .accessDeniedHandler(restfulAccessDeniedHandler)
                .authenticationEntryPoint(restAuthenticationEntryPoint));

        return httpSecurity.build();
    }
}