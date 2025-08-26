package com.example.BookShelf.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "favorite_lists")
public class FavoriteList {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;
    
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "favorite_list_books",
        joinColumns = @JoinColumn(name = "favorite_list_id"),
        inverseJoinColumns = @JoinColumn(name = "book_id")
    )
    @Builder.Default
    private Set<Book> books = new HashSet<>();
    
    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    // Kitap ekleme yardımcı method'u
    public void addBook(Book book) {
        this.books.add(book);
    }
    
    // Kitap çıkarma yardımcı method'u
    public void removeBook(Book book) {
        this.books.remove(book);
    }
    
    // Kitap var mı kontrol yardımcı method'u
    public boolean containsBook(Book book) {
        return this.books.contains(book);
    }
}
