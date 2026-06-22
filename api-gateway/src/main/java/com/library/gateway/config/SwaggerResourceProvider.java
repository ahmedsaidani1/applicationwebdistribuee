package com.library.gateway.config;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.properties.AbstractSwaggerUiConfigProperties.SwaggerUrl;
import org.springdoc.core.properties.SwaggerUiConfigProperties;

import java.util.HashSet;
import java.util.Set;

@Component
@Primary
public class SwaggerResourceProvider {
    
    @Bean
    public Set<SwaggerUrl> swaggerUrls() {
        Set<SwaggerUrl> urls = new HashSet<>();
        
        // Book Service
        SwaggerUrl bookService = new SwaggerUrl();
        bookService.setName("Book Service");
        bookService.setUrl("/book-service/v3/api-docs");
        urls.add(bookService);
        
        // Gateway itself (if needed)
        SwaggerUrl gateway = new SwaggerUrl();
        gateway.setName("API Gateway");
        gateway.setUrl("/v3/api-docs");
        urls.add(gateway);
        
        return urls;
    }
}
