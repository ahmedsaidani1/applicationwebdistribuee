package com.library.book.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookAvailabilityDTO {
    private Long bookId;
    private String title;
    private boolean available;
    private Integer availableCopies;
}
