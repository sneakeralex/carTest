package com.carservice.mock;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

/**
 * Mock 内网 API 服务
 * 用于本地开发和测试，模拟内网设备接口
 */
@SpringBootApplication
@RestController
@RequestMapping("/internal")
public class MockInternalApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(MockInternalApiApplication.class, args);
    }

    @GetMapping("/api/vehicles")
    public String getVehicles() {
        return "{\"vehicles\": [{\"id\": 1, \"plateNo\": \"ABC123\"}]}";
    }

    @PostMapping("/api/vehicles")
    public String createVehicle(@RequestBody String body) {
        return "{\"id\": 123, \"message\": \"Vehicle created\", \"data\": " + body + "}";
    }

    @GetMapping("/api/test")
    public String testEndpoint(@RequestHeader(value = "x-ca-signature", required = false) String signature) {
        return "{\"signature\": \"" + (signature != null ? "present" : "missing") + "\", \"status\": \"ok\"}";
    }
}
