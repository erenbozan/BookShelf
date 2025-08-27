package com.example.BookShelf.controller;

import com.example.BookShelf.entity.Book;
import com.example.BookShelf.entity.User;
import com.example.BookShelf.repository.UserRepository;
import com.example.BookShelf.entity.FavoriteList;
import com.example.BookShelf.service.FavoriteListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FavoriteListController {
    
    private final FavoriteListService favoriteListService;
    private final UserRepository userRepository;
    
    // Kullanıcının favori listesini getir
    @GetMapping
    public ResponseEntity<FavoriteList> getUserFavoriteList() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            FavoriteList favoriteList = favoriteListService.getUserFavoriteList(userId);
            return ResponseEntity.ok(favoriteList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Kullanıcının favori kitaplarını getir
    @GetMapping("/books")
    public ResponseEntity<Set<Book>> getUserFavoriteBooks() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Set<Book> favoriteBooks = favoriteListService.getUserFavoriteBooks(userId);
            return ResponseEntity.ok(favoriteBooks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Kitap ekle
    @PostMapping("/books/{bookId}")
    public ResponseEntity<FavoriteList> addBookToFavorites(@PathVariable Long bookId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            FavoriteList updatedList = favoriteListService.addBookToFavorites(userId, bookId);
            return ResponseEntity.ok(updatedList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Kitap çıkar
    @DeleteMapping("/books/{bookId}")
    public ResponseEntity<FavoriteList> removeBookFromFavorites(@PathVariable Long bookId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            FavoriteList updatedList = favoriteListService.removeBookFromFavorites(userId, bookId);
            return ResponseEntity.ok(updatedList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Favori listeyi temizle
    @DeleteMapping
    public ResponseEntity<Void> clearFavoriteList() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            favoriteListService.clearFavoriteList(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Kitap favori mi kontrol et
    @GetMapping("/books/{bookId}/check")
    public ResponseEntity<Boolean> isBookInFavorites(@PathVariable Long bookId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            boolean isFavorite = favoriteListService.isBookInFavorites(userId, bookId);
            return ResponseEntity.ok(isFavorite);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Favori liste sayısını getir
    @GetMapping("/count")
    public ResponseEntity<Integer> getFavoriteListSize() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Long userId = userRepository.findByUsername(username)
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            int size = favoriteListService.getFavoriteListSize(userId);
            return ResponseEntity.ok(size);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Alias: /api/favorites/book (tekil) -> kullanıcı favori kitapları
    @GetMapping("/book")
    public ResponseEntity<Set<Book>> getUserFavoriteBooksAlias() {
        return getUserFavoriteBooks();
    }
}
