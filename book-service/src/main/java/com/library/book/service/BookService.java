package com.library.book.service;

import com.library.book.dto.BookAvailabilityDTO;
import com.library.book.dto.BookDTO;
import com.library.book.exception.BookNotFoundException;
import com.library.book.exception.DuplicateIsbnException;
import com.library.book.messaging.BookEventPublisher;
import com.library.book.model.Book;
import com.library.book.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final BookEventPublisher bookEventPublisher;

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public BookDTO getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        return convertToDTO(book);
    }

    public BookDTO getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new BookNotFoundException("Book not found with ISBN: " + isbn));
        return convertToDTO(book);
    }

    public List<BookDTO> getBooksByCategory(String category) {
        return bookRepository.findByCategory(category).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> searchBooks(String keyword) {
        return bookRepository.searchBooks(keyword).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getAvailableBooks() {
        return bookRepository.findAvailableBooks().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookDTO createBook(Book book) {
        if (bookRepository.findByIsbn(book.getIsbn()).isPresent()) {
            throw new DuplicateIsbnException("Book with ISBN " + book.getIsbn() + " already exists");
        }
        
        Book savedBook = bookRepository.save(book);
        log.info("Book created: {}", savedBook.getTitle());
        
        // Publish book created event
        bookEventPublisher.publishBookCreatedEvent(savedBook);
        
        return convertToDTO(savedBook);
    }

    @Transactional
    public BookDTO updateBook(Long id, Book bookDetails) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));

        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setPublisher(bookDetails.getPublisher());
        book.setPublicationDate(bookDetails.getPublicationDate());
        book.setCategory(bookDetails.getCategory());
        book.setTotalCopies(bookDetails.getTotalCopies());
        book.setDescription(bookDetails.getDescription());
        book.setImageUrl(bookDetails.getImageUrl());
        book.setStatus(bookDetails.getStatus());

        Book updatedBook = bookRepository.save(book);
        log.info("Book updated: {}", updatedBook.getTitle());
        
        bookEventPublisher.publishBookUpdatedEvent(updatedBook);
        
        return convertToDTO(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
        
        bookRepository.delete(book);
        log.info("Book deleted: {}", book.getTitle());
        
        bookEventPublisher.publishBookDeletedEvent(id);
    }

    @Transactional
    public BookAvailabilityDTO checkAvailability(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        
        BookAvailabilityDTO availability = new BookAvailabilityDTO();
        availability.setBookId(book.getId());
        availability.setTitle(book.getTitle());
        availability.setAvailableCopies(book.getAvailableCopies());
        availability.setAvailable(book.getAvailableCopies() > 0 && book.getStatus() == Book.BookStatus.AVAILABLE);
        
        return availability;
    }

    @Transactional
    public void decreaseAvailability(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No copies available for book: " + book.getTitle());
        }
        
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);
        log.info("Decreased availability for book: {}", book.getTitle());
        
        bookEventPublisher.publishBookBorrowedEvent(book);
    }

    @Transactional
    public void increaseAvailability(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId));
        
        if (book.getAvailableCopies() >= book.getTotalCopies()) {
            throw new IllegalStateException("All copies already returned for book: " + book.getTitle());
        }
        
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
        log.info("Increased availability for book: {}", book.getTitle());
        
        bookEventPublisher.publishBookReturnedEvent(book);
    }

    private BookDTO convertToDTO(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setIsbn(book.getIsbn());
        dto.setPublisher(book.getPublisher());
        dto.setPublicationDate(book.getPublicationDate());
        dto.setCategory(book.getCategory());
        dto.setTotalCopies(book.getTotalCopies());
        dto.setAvailableCopies(book.getAvailableCopies());
        dto.setDescription(book.getDescription());
        dto.setImageUrl(book.getImageUrl());
        dto.setStatus(book.getStatus());
        return dto;
    }
}
