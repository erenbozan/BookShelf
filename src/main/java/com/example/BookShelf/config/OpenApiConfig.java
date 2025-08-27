package com.example.BookShelf.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bookShelfOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("BookShelf API")
                .description("BookShelf uygulaması için REST API dokümantasyonu")
                .version("v1.0.0")
                .contact(new Contact().name("BookShelf Team"))
                .license(new License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0"))
            )
            .externalDocs(new ExternalDocumentation()
                .description("Springdoc OpenAPI")
                .url("https://springdoc.org")
            );
    }
}


