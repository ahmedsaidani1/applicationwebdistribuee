package com.library.book.dto;

import com.library.book.model.Book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String isbn;
    private String publisher;
    private LocalDate publicationDate;
    private String category;
    private Integer totalCopies;
    private Integer availableCopies;
    private String description;
    private String imageUrl;
    private Book.BookStatus status;
}
