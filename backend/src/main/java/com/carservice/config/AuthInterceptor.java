package com.carservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.carservice.common.util.JwtTokenUtil;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Resource
    private JwtTokenUtil jwtTokenUtil;

    @Value("${server.servlet.context-path}")
    private String contextPath;

    // 需要排除拦截的路径
    private static final String[] EXCLUDE_PATHS = {
            "/auth/",
            "/user-management/register",
            "/wxmini/code2session", // 用于提交code的api
            "/static/", // 静态资源路径前缀
            "/public/", // 其他静态资源路径
            "/favicon.ico", 
            "/error"
    };

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull Object handler) throws Exception {
        String uri = request.getRequestURI();
        
        // 如果配置了context-path，需要去掉前缀再判断
        if (contextPath != null && !contextPath.isEmpty() && uri.startsWith(contextPath)) {
            uri = uri.substring(contextPath.length());
        }
        
        // 跳过不需要拦截的路径
        for (String exclude : EXCLUDE_PATHS) {
            if (uri.startsWith(exclude)) {
                return true;
            }
        }

        // 获取token
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }

        String token = authHeader.substring(7);
        try {
            // 验证token
            var decodedJWT = jwtTokenUtil.verifyToken(token);
            String userId = decodedJWT.getClaim("userId").asString();
            String unionid = decodedJWT.getClaim("unionid").asString();
            String role = decodedJWT.getClaim("role").asString();

            // 将信息存入session
            HttpSession session = request.getSession();
            session.setAttribute("userId", userId);
            session.setAttribute("unionid", unionid);
            session.setAttribute("role", role);

            return true;
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
    }
}