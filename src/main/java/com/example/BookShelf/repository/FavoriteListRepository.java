package com.example.BookShelf.repository;

import com.example.BookShelf.entity.FavoriteList;
import com.example.BookShelf.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteListRepository extends JpaRepository<FavoriteList, Long> {
    
    Optional<FavoriteList> findByUser(User user);
    
    Optional<FavoriteList> findByUserId(Long userId);
    
    boolean existsByUserId(Long userId);
}
