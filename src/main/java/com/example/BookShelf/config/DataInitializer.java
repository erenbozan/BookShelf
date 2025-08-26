package com.example.BookShelf.config;

import com.example.BookShelf.entity.Role;
import com.example.BookShelf.entity.User;
import com.example.BookShelf.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Admin kullanıcısı yoksa oluştur
        if (!userRepository.existsByUsername("admin")) {
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@bookshelf.com")
                    .password(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .role(Role.ADMIN)
                    .build();
            
            userRepository.save(adminUser);
            System.out.println("Admin user created: admin/admin123");
        }
        
        // Test kullanıcısı yoksa oluştur
        if (!userRepository.existsByUsername("user")) {
            User testUser = User.builder()
                    .username("user")
                    .email("user@bookshelf.com")
                    .password(passwordEncoder.encode("user123"))
                    .firstName("Test")
                    .lastName("User")
                    .role(Role.USER)
                    .build();
            
            userRepository.save(testUser);
            System.out.println("Test user created: user/user123");
        }
    }
}
