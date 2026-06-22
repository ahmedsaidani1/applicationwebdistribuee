package com.library.book.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bookServiceAPI() {
        // Gateway server - add /api prefix for routing through gateway
        Server gatewayServer = new Server();
        gatewayServer.setUrl("http://localhost:8080/api");
        gatewayServer.setDescription("Via API Gateway (Recommended)");

        // Local server - direct access to service
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8081");
        localServer.setDescription("Direct Access (Development Only)");

        Contact contact = new Contact();
        contact.setName("Library Team");
        contact.setEmail("library@example.com");

        Info info = new Info()
                .title("Book Service API")
                .version("1.0.0")
                .description("API de gestion des livres pour la bibliothèque. Utilisez le serveur 'Via API Gateway' pour tester via le gateway.")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(gatewayServer, localServer));
    }
}
