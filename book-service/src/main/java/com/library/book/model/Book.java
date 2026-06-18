package com.library.book.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Column(nullable = false)
    private String author;

    @NotBlank(message = "ISBN is required")
    @Column(unique = true, nullable = false)
    private String isbn;

    @NotBlank(message = "Publisher is required")
    private String publisher;

    @NotNull(message = "Publication date is required")
    private LocalDate publicationDate;

    @NotBlank(message = "Category is required")
    private String category;

    @Positive(message = "Total copies must be positive")
    @Column(nullable = false)
    private Integer totalCopies;

    @Column(nullable = false)
    private Integer availableCopies;

    @Column(length = 1000)
    private String description;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookStatus status = BookStatus.AVAILABLE;

    @PrePersist
    public void prePersist() {
        if (availableCopies == null) {
            availableCopies = totalCopies;
        }
    }

    public enum BookStatus {
        AVAILABLE,
        UNAVAILABLE,
        MAINTENANCE
    }
}
