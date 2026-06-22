package com.library.gateway.config;

import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteDefinition;
import org.springframework.cloud.gateway.route.RouteDefinitionLocator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Autowired
    private RouteDefinitionLocator locator;

    @Bean
    public List<GroupedOpenApi> apis() {
        List<GroupedOpenApi> groups = new ArrayList<>();
        
        // Book Service API Documentation
        groups.add(GroupedOpenApi.builder()
                .group("book-service")
                .pathsToMatch("/api/books/**")
                .build());
        
        // Loan Service API Documentation
        groups.add(GroupedOpenApi.builder()
                .group("loan-service")
                .pathsToMatch("/api/loans/**")
                .build());
        
        return groups;
    }
}
