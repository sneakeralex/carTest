package com.carservice.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
public class ApiProxyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RestTemplate restTemplate;

    @Test
    public void testProxyGet() throws Exception {
        // Mock 内网API响应
        ResponseEntity<String> mockResponse = ResponseEntity.ok("{\"data\":\"test\"}");
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(), eq(String.class)))
                .thenReturn(mockResponse);

        // 测试代理GET请求
        mockMvc.perform(get("/api/proxy/test/path"))
                .andExpect(status().isOk())
                .andExpect(content().string("{\"data\":\"test\"}"));
    }

    @Test
    public void testProxyPost() throws Exception {
        // Mock 内网API响应
        ResponseEntity<String> mockResponse = ResponseEntity.status(HttpStatus.CREATED).body("{\"id\":123}");
        when(restTemplate.exchange(anyString(), eq(HttpMethod.POST), any(), eq(String.class)))
                .thenReturn(mockResponse);

        // 测试代理POST请求
        mockMvc.perform(post("/api/proxy/test/path")
                        .content("{\"name\":\"test\"}")
                        .contentType("application/json"))
                .andExpect(status().isCreated())
                .andExpect(content().string("{\"id\":123}"));
    }
}
