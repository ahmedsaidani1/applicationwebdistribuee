package com.library.book.config;

import com.library.book.model.Book;
import com.library.book.model.Category;
import com.library.book.repository.BookRepository;
import com.library.book.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;

    @Override
    public void run(String... args) {
        // Check if data already exists
        if (categoryRepository.count() > 0 || bookRepository.count() > 0) {
            log.info("Database already contains data. Skipping initialization.");
            return;
        }

        log.info("Database is empty. Loading sample data...");
        initializeCategories();
        initializeBooks();
        log.info("Sample data loaded successfully!");
    }

    private void initializeCategories() {
        Category fiction = Category.builder()
                .name("Fiction")
                .description("Romans et histoires fictives")
                .build();

        Category science = Category.builder()
                .name("Science")
                .description("Livres scientifiques et techniques")
                .build();

        Category histoire = Category.builder()
                .name("Histoire")
                .description("Livres d'histoire")
                .build();

        Category technologie = Category.builder()
                .name("Technologie")
                .description("Livres sur la technologie et l'informatique")
                .build();

        Category philosophie = Category.builder()
                .name("Philosophie")
                .description("Livres de philosophie")
                .build();

        categoryRepository.save(fiction);
        categoryRepository.save(science);
        categoryRepository.save(histoire);
        categoryRepository.save(technologie);
        categoryRepository.save(philosophie);

        log.info("Loaded 5 categories");
    }

    private void initializeBooks() {
        Book book1 = Book.builder()
                .title("Le Petit Prince")
                .author("Antoine de Saint-Exupéry")
                .isbn("978-0-156-01219-1")
                .publisher("Gallimard")
                .publicationDate(LocalDate.of(1943, 4, 6))
                .category("Fiction")
                .totalCopies(5)
                .availableCopies(3)
                .totalLoans(2)
                .description("Un conte philosophique et poétique sous l'apparence d'un conte pour enfants. L'histoire d'un petit prince qui voyage de planète en planète à la recherche du sens de la vie et de l'amitié.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book2 = Book.builder()
                .title("Clean Code")
                .author("Robert C. Martin")
                .isbn("978-0-132-35088-4")
                .publisher("Prentice Hall")
                .publicationDate(LocalDate.of(2008, 8, 1))
                .category("Technologie")
                .totalCopies(4)
                .availableCopies(4)
                .totalLoans(0)
                .description("Un guide essentiel pour écrire du code propre, maintenable et professionnel. Apprenez les principes et pratiques pour transformer du mauvais code en bon code, avec des exemples concrets et des études de cas.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book3 = Book.builder()
                .title("Une brève histoire du temps")
                .author("Stephen Hawking")
                .isbn("978-0-553-10953-5")
                .publisher("Bantam Books")
                .publicationDate(LocalDate.of(1988, 4, 1))
                .category("Science")
                .totalCopies(3)
                .availableCopies(2)
                .totalLoans(1)
                .description("Du Big Bang aux trous noirs : Stephen Hawking explique les mystères de l'univers de manière accessible. Un voyage fascinant à travers l'espace et le temps, explorant les questions fondamentales de notre existence.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book4 = Book.builder()
                .title("1984")
                .author("George Orwell")
                .isbn("978-0-452-28423-4")
                .publisher("Secker & Warburg")
                .publicationDate(LocalDate.of(1949, 6, 8))
                .category("Fiction")
                .totalCopies(6)
                .availableCopies(5)
                .totalLoans(1)
                .description("Dans un monde dystopique où Big Brother surveille chacun de vos mouvements, Winston Smith lutte pour préserver son humanité. Un roman prophétique sur le totalitarisme et la manipulation de la vérité.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657781256i/61439040.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book5 = Book.builder()
                .title("Design Patterns")
                .author("Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides")
                .isbn("978-0-201-63361-0")
                .publisher("Addison-Wesley")
                .publicationDate(LocalDate.of(1994, 10, 21))
                .category("Technologie")
                .totalCopies(3)
                .availableCopies(3)
                .totalLoans(0)
                .description("Le livre de référence sur les patterns de conception orientée objet. 23 patterns essentiels expliqués avec des exemples et des cas d'utilisation. Un incontournable pour tout développeur sérieux.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348027904i/85009.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book6 = Book.builder()
                .title("Sapiens: Une brève histoire de l'humanité")
                .author("Yuval Noah Harari")
                .isbn("978-0-062-31609-6")
                .publisher("Harper")
                .publicationDate(LocalDate.of(2011, 9, 4))
                .category("Histoire")
                .totalCopies(5)
                .availableCopies(5)
                .totalLoans(0)
                .description("Comment Homo Sapiens est devenu le maître du monde ? De la révolution cognitive à l'ère moderne, Harari explore l'histoire de l'humanité avec un regard neuf et provocateur.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book7 = Book.builder()
                .title("L'Étranger")
                .author("Albert Camus")
                .isbn("978-0-679-72020-1")
                .publisher("Gallimard")
                .publicationDate(LocalDate.of(1942, 6, 1))
                .category("Fiction")
                .totalCopies(4)
                .availableCopies(4)
                .totalLoans(0)
                .description("Meursault, un homme ordinaire, commet un meurtre absurde sur une plage algérienne. Un chef-d'œuvre de la littérature existentialiste qui explore l'absurdité de l'existence humaine.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1349927872i/49552.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        Book book8 = Book.builder()
                .title("Thinking, Fast and Slow")
                .author("Daniel Kahneman")
                .isbn("978-0-374-27563-1")
                .publisher("Farrar, Straus and Giroux")
                .publicationDate(LocalDate.of(2011, 10, 25))
                .category("Science")
                .totalCopies(3)
                .availableCopies(1)
                .totalLoans(2)
                .description("Le prix Nobel Daniel Kahneman révèle les deux systèmes qui gouvernent notre façon de penser : le rapide et intuitif, et le lent et réfléchi. Un voyage fascinant dans l'esprit humain.")
                .imageUrl("https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1317793965i/11468377.jpg")
                .status(Book.BookStatus.AVAILABLE)
                .build();

        bookRepository.save(book1);
        bookRepository.save(book2);
        bookRepository.save(book3);
        bookRepository.save(book4);
        bookRepository.save(book5);
        bookRepository.save(book6);
        bookRepository.save(book7);
        bookRepository.save(book8);

        log.info("Loaded 8 books");
    }
}
