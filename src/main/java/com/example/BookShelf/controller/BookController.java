package com.example.BookShelf.controller;

import com.example.BookShelf.entity.Book;
import com.example.BookShelf.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {
    
    private final BookRepository bookRepository;
    
    // Tüm kitapları getir (herkes görebilir)
    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return ResponseEntity.ok(books);
    }
    
    // ID ile kitap getir (herkes görebilir)
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookRepository.findById(id)
                .orElse(null);
        
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(book);
    }
    
    // Başlığa göre arama (herkes yapabilir)
    @GetMapping("/search/title")
    public ResponseEntity<List<Book>> searchByTitle(@RequestParam String title) {
        List<Book> books = bookRepository.findByTitleContainingIgnoreCase(title);
        return ResponseEntity.ok(books);
    }
    
    // Yazara göre arama (herkes yapabilir)
    @GetMapping("/search/author")
    public ResponseEntity<List<Book>> searchByAuthor(@RequestParam String author) {
        List<Book> books = bookRepository.findByAuthorContainingIgnoreCase(author);
        return ResponseEntity.ok(books);
    }
    
    // Yıla göre arama (herkes yapabilir)
    @GetMapping("/search/year")
    public ResponseEntity<List<Book>> searchByYear(@RequestParam Integer year) {
        List<Book> books = bookRepository.findByPublishedYear(year);
        return ResponseEntity.ok(books);
    }
}
