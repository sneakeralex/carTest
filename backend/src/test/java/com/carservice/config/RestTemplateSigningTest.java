package com.carservice.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpMethod;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestTemplate;

import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

@SpringBootTest(classes = {RestTemplateConfig.class, ApiSigningInterceptor.class})
@TestPropertySource(properties = {
    "api.signing.key=test-key",
    "api.signing.secret=test-secret"
})
public class RestTemplateSigningTest {

    @Autowired
    private RestTemplate restTemplate;

    private MockRestServiceServer server;

    @Test
    public void testSigningInterceptorAddsHeaders() {
        server = MockRestServiceServer.createServer(restTemplate);

        // 模拟内网API响应
        server.expect(requestTo("http://localhost:8080/test"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("x-ca-key", "test-key"))
                .andExpect(header("x-ca-signature", org.hamcrest.Matchers.notNullValue()))
                .andExpect(header("Content-MD5", org.hamcrest.Matchers.notNullValue()))
                .andRespond(withSuccess("{\"result\":\"ok\"}", org.springframework.http.MediaType.APPLICATION_JSON));

        // 执行请求
        restTemplate.getForObject("http://localhost:8080/test", String.class);

        server.verify();
    }
}