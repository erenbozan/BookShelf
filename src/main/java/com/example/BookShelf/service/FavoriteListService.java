package com.example.BookShelf.service;

import com.example.BookShelf.entity.Book;
import com.example.BookShelf.entity.FavoriteList;
import com.example.BookShelf.entity.User;
import com.example.BookShelf.repository.BookRepository;
import com.example.BookShelf.repository.FavoriteListRepository;
import com.example.BookShelf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class FavoriteListService {
    
    private final FavoriteListRepository favoriteListRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    
    // Kullanıcının favori listesini getir (yoksa oluştur)
    public FavoriteList getUserFavoriteList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<FavoriteList> existingList = favoriteListRepository.findByUser(user);
        
        if (existingList.isPresent()) {
            return existingList.get();
        } else {
            // Yeni favori liste oluştur
            FavoriteList newList = FavoriteList.builder()
                    .user(user)
                    .build();
            return favoriteListRepository.save(newList);
        }
    }
    
    // Kitap ekle
    public FavoriteList addBookToFavorites(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        FavoriteList favoriteList = getUserFavoriteList(userId);
        
        if (!favoriteList.containsBook(book)) {
            favoriteList.addBook(book);
            return favoriteListRepository.save(favoriteList);
        }
        
        return favoriteList;
    }
    
    // Kitap çıkar
    public FavoriteList removeBookFromFavorites(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        FavoriteList favoriteList = getUserFavoriteList(userId);
        
        if (favoriteList.containsBook(book)) {
            favoriteList.removeBook(book);
            return favoriteListRepository.save(favoriteList);
        }
        
        return favoriteList;
    }
    
    // Favori listeyi temizle
    public void clearFavoriteList(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Optional<FavoriteList> existingList = favoriteListRepository.findByUser(user);
        existingList.ifPresent(favoriteList -> {
            favoriteList.getBooks().clear();
            favoriteListRepository.save(favoriteList);
        });
    }
    
    // Kullanıcının favori kitaplarını getir
    public Set<Book> getUserFavoriteBooks(Long userId) {
        FavoriteList favoriteList = getUserFavoriteList(userId);
        return favoriteList.getBooks();
    }
    
    // Kitap favori mi kontrol et
    public boolean isBookInFavorites(Long userId, Long bookId) {
        FavoriteList favoriteList = getUserFavoriteList(userId);
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        
        return favoriteList.containsBook(book);
    }
    
    // Favori liste sayısını getir
    public int getFavoriteListSize(Long userId) {
        FavoriteList favoriteList = getUserFavoriteList(userId);
        return favoriteList.getBooks().size();
    }
}
