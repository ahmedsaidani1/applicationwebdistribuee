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
        Server localServer = new Server();
        localServer.setUrl("http://localhost:8081");
        localServer.setDescription("Local Server");

        Server dockerServer = new Server();
        dockerServer.setUrl("http://localhost:8080/api/books");
        dockerServer.setDescription("Docker via Gateway");

        Contact contact = new Contact();
        contact.setName("Library Team");
        contact.setEmail("library@example.com");

        Info info = new Info()
                .title("Book Service API")
                .version("1.0.0")
                .description("API de gestion des livres pour la bibliothèque")
                .contact(contact);

        return new OpenAPI()
                .info(info)
                .servers(List.of(localServer, dockerServer));
    }
}
