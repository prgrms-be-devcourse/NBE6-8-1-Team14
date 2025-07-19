package com.back.global.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Take Five Project API 명세서",
                version = "v1",
                description = "Take Five Project API 명세서입니다"
        ),
        servers = {
               @Server(url = "http://43.202.22.198:8080", description = "운영 서버"),
//                @Server(url = "http://localhost:8080", description = "로컬 서버")
        }
)
@Configuration
@Slf4j
public class SwaggerConfig {
    public static final String JWT_SECURITY_SCHEME = "JWT Token";

    @Bean
    public OpenAPI openAPI() {
        SecurityScheme apiKey = new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .in(SecurityScheme.In.HEADER)
                .name("Authorization")
                .scheme("bearer")
                .bearerFormat("JWT");

        return new OpenAPI()
                .components(new Components().addSecuritySchemes("bearerAuth", apiKey));
    }
}