package com.library.book.messaging;

import com.library.book.model.Book;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class BookEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    
    private static final String EXCHANGE = "library.exchange";
    private static final String BOOK_CREATED_ROUTING_KEY = "book.created";
    private static final String BOOK_UPDATED_ROUTING_KEY = "book.updated";
    private static final String BOOK_DELETED_ROUTING_KEY = "book.deleted";
    private static final String BOOK_BORROWED_ROUTING_KEY = "book.borrowed";
    private static final String BOOK_RETURNED_ROUTING_KEY = "book.returned";

    public void publishBookCreatedEvent(Book book) {
        Map<String, Object> event = createBookEvent(book, "BOOK_CREATED");
        rabbitTemplate.convertAndSend(EXCHANGE, BOOK_CREATED_ROUTING_KEY, event);
        log.info("Published book created event for book: {}", book.getTitle());
    }

    public void publishBookUpdatedEvent(Book book) {
        Map<String, Object> event = createBookEvent(book, "BOOK_UPDATED");
        rabbitTemplate.convertAndSend(EXCHANGE, BOOK_UPDATED_ROUTING_KEY, event);
        log.info("Published book updated event for book: {}", book.getTitle());
    }

    public void publishBookDeletedEvent(Long bookId) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", "BOOK_DELETED");
        event.put("bookId", bookId);
        event.put("timestamp", System.currentTimeMillis());
        rabbitTemplate.convertAndSend(EXCHANGE, BOOK_DELETED_ROUTING_KEY, event);
        log.info("Published book deleted event for book ID: {}", bookId);
    }

    public void publishBookBorrowedEvent(Book book) {
        Map<String, Object> event = createBookEvent(book, "BOOK_BORROWED");
        rabbitTemplate.convertAndSend(EXCHANGE, BOOK_BORROWED_ROUTING_KEY, event);
        log.info("Published book borrowed event for book: {}", book.getTitle());
    }

    public void publishBookReturnedEvent(Book book) {
        Map<String, Object> event = createBookEvent(book, "BOOK_RETURNED");
        rabbitTemplate.convertAndSend(EXCHANGE, BOOK_RETURNED_ROUTING_KEY, event);
        log.info("Published book returned event for book: {}", book.getTitle());
    }

    private Map<String, Object> createBookEvent(Book book, String eventType) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", eventType);
        event.put("bookId", book.getId());
        event.put("title", book.getTitle());
        event.put("author", book.getAuthor());
        event.put("isbn", book.getIsbn());
        event.put("availableCopies", book.getAvailableCopies());
        event.put("timestamp", System.currentTimeMillis());
        return event;
    }
}
