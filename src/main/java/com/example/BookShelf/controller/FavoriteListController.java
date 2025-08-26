package com.example.BookShelf.controller;

import com.example.BookShelf.entity.Book;
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
    
    // Kullanıcının favori listesini getir
    @GetMapping
    public ResponseEntity<FavoriteList> getUserFavoriteList() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            
            // Burada username'den user ID'yi bulmanız gerekir
            // Şimdilik basit bir implementasyon
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
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
            
            Long userId = 1L; // Gerçek uygulamada authentication'dan alınmalı
            
            int size = favoriteListService.getFavoriteListSize(userId);
            return ResponseEntity.ok(size);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
