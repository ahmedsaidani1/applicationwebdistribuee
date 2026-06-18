package com.library.book.controller;

import com.library.book.dto.BookAvailabilityDTO;
import com.library.book.dto.BookDTO;
import com.library.book.model.Book;
import com.library.book.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Book Management", description = "APIs pour la gestion des livres")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Obtenir tous les livres")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un livre par ID")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    @GetMapping("/isbn/{isbn}")
    @Operation(summary = "Obtenir un livre par ISBN")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable String isbn) {
        return ResponseEntity.ok(bookService.getBookByIsbn(isbn));
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Obtenir les livres par catégorie")
    public ResponseEntity<List<BookDTO>> getBooksByCategory(@PathVariable String category) {
        return ResponseEntity.ok(bookService.getBooksByCategory(category));
    }

    @GetMapping("/author/{author}")
    @Operation(summary = "Obtenir les livres par auteur")
    public ResponseEntity<List<BookDTO>> getBooksByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(bookService.getBooksByAuthor(author));
    }

    @GetMapping("/search")
    @Operation(summary = "Rechercher des livres")
    public ResponseEntity<List<BookDTO>> searchBooks(@RequestParam String keyword) {
        return ResponseEntity.ok(bookService.searchBooks(keyword));
    }

    @GetMapping("/available")
    @Operation(summary = "Obtenir les livres disponibles")
    public ResponseEntity<List<BookDTO>> getAvailableBooks() {
        return ResponseEntity.ok(bookService.getAvailableBooks());
    }

    @GetMapping("/{id}/availability")
    @Operation(summary = "Vérifier la disponibilité d'un livre")
    public ResponseEntity<BookAvailabilityDTO> checkAvailability(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.checkAvailability(id));
    }

    @PostMapping
    @Operation(summary = "Créer un nouveau livre")
    public ResponseEntity<BookDTO> createBook(@Valid @RequestBody Book book) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.createBook(book));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Mettre à jour un livre")
    public ResponseEntity<BookDTO> updateBook(@PathVariable Long id, @Valid @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un livre")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/decrease-availability")
    @Operation(summary = "Diminuer la disponibilité (emprunt)")
    public ResponseEntity<Void> decreaseAvailability(@PathVariable Long id) {
        bookService.decreaseAvailability(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/increase-availability")
    @Operation(summary = "Augmenter la disponibilité (retour)")
    public ResponseEntity<Void> increaseAvailability(@PathVariable Long id) {
        bookService.increaseAvailability(id);
        return ResponseEntity.ok().build();
    }
}
