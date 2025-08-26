package com.example.BookShelf.controller;

import com.example.BookShelf.entity.Book;
import com.example.BookShelf.entity.User;
import com.example.BookShelf.repository.BookRepository;
import com.example.BookShelf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    
    // Manuel role kontrolü için yardımcı method
    private boolean isAdminUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            System.out.println("Authentication is NULL!");
            return false;
        }
        
        System.out.println("User: " + authentication.getName());
        System.out.println("Authorities: " + authentication.getAuthorities());
        
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> {
                    String auth = authority.getAuthority();
                    System.out.println("Checking authority: " + auth);
                    return auth.equals("ROLE_ADMIN") || auth.equals("ADMIN");
                });
        
        System.out.println("Is Admin: " + isAdmin);
        return isAdmin;
    }
    
    // Tüm kullanıcıları listele (sadece admin)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            System.out.println("=== GET ALL USERS ACCESS ATTEMPT ===");
            
            if (!isAdminUser()) {
                System.out.println("Access denied: User is not ADMIN");
                return ResponseEntity.status(403).body(null);
            }
            
            List<User> users = userRepository.findAll();
            users.forEach(user -> user.setPassword(null));
            
            System.out.println("=== USERS ACCESS SUCCESSFUL ===");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.out.println("=== USERS ACCESS FAILED ===");
            e.printStackTrace();
            return ResponseEntity.status(401).body(null);
        }
    }
    
    // Admin tarafından kitap ekleme
    @PostMapping("/books")
    public ResponseEntity<Book> addBookAsAdmin(@RequestBody Book book) {
        try {
            System.out.println("=== ADD BOOK ACCESS ATTEMPT ===");
            
            if (!isAdminUser()) {
                System.out.println("Access denied: User is not ADMIN");
                return ResponseEntity.status(403).body(null);
            }
            
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            
            book.setAddedByUser(currentUser);
            Book savedBook = bookRepository.save(book);
            
            System.out.println("=== BOOK ADDED SUCCESSFULLY ===");
            return ResponseEntity.ok(savedBook);
        } catch (Exception e) {
            System.out.println("=== BOOK ADD FAILED ===");
            e.printStackTrace();
            return ResponseEntity.status(401).body(null);
        }
    }
    
    // Admin tarafından kitap güncelleme
    @PutMapping("/books/{id}")
    public ResponseEntity<Book> updateBookAsAdmin(@PathVariable Long id, @RequestBody Book bookDetails) {
        try {
            System.out.println("=== UPDATE BOOK ACCESS ATTEMPT ===");
            
            if (!isAdminUser()) {
                System.out.println("Access denied: User is not ADMIN");
                return ResponseEntity.status(403).body(null);
            }
            
            Book book = bookRepository.findById(id)
                    .orElse(null);
            
            if (book == null) {
                return ResponseEntity.notFound().build();
            }
            
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setDescription(bookDetails.getDescription());
            book.setPublishedYear(bookDetails.getPublishedYear());
            
            Book updatedBook = bookRepository.save(book);
            
            System.out.println("=== BOOK UPDATED SUCCESSFULLY ===");
            return ResponseEntity.ok(updatedBook);
        } catch (Exception e) {
            System.out.println("=== BOOK UPDATE FAILED ===");
            e.printStackTrace();
            return ResponseEntity.status(401).body(null);
        }
    }
    
    // Admin tarafından kitap silme
    @DeleteMapping("/books/{id}")
    public ResponseEntity<Void> deleteBookAsAdmin(@PathVariable Long id) {
        try {
            System.out.println("=== DELETE BOOK ACCESS ATTEMPT ===");
            
            if (!isAdminUser()) {
                System.out.println("Access denied: User is not ADMIN");
                return ResponseEntity.status(403).body(null);
            }
            
            if (!bookRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            
            bookRepository.deleteById(id);
            
            System.out.println("=== BOOK DELETED SUCCESSFULLY ===");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("=== BOOK DELETE FAILED ===");
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }
    
    // Admin dashboard bilgileri
    @GetMapping("/dashboard")
    public ResponseEntity<Object> getAdminDashboard() {
        try {
            System.out.println("=== ADMIN DASHBOARD ACCESS ATTEMPT ===");
            
            if (!isAdminUser()) {
                System.out.println("Access denied: User is not ADMIN");
                return ResponseEntity.status(403).body(Map.of(
                    "error", "Access denied",
                    "message", "Admin privileges required",
                    "status", 403
                ));
            }
            
            long totalUsers = userRepository.count();
            long totalBooks = bookRepository.count();
            
            System.out.println("Total Users: " + totalUsers);
            System.out.println("Total Books: " + totalBooks);
            System.out.println("=== DASHBOARD ACCESS SUCCESSFUL ===");
            
            return ResponseEntity.ok(Map.of(
                "totalUsers", totalUsers,
                "totalBooks", totalBooks,
                "message", "Admin dashboard data"
            ));
        } catch (Exception e) {
            System.out.println("=== DASHBOARD ACCESS FAILED ===");
            System.out.println("Exception: " + e.getClass().getSimpleName());
            System.out.println("Message: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.status(401).body(Map.of(
                "error", "Unauthorized access",
                "message", "Admin privileges required",
                "status", 401,
                "exception", e.getClass().getSimpleName(),
                "details", e.getMessage()
            ));
        }
    }
}
