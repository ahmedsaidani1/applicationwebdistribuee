package com.library.book.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "LOAN-SERVICE")
public interface LoanServiceClient {
    
    @GetMapping("/loans/book/{bookId}/count")
    Integer getLoanCountByBookId(@PathVariable("bookId") Long bookId);
}
