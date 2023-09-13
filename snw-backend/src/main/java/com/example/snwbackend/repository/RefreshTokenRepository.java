package com.example.snwbackend.repository;

import com.example.snwbackend.entity.RefreshToken;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    void deleteByUser(User user);

    @Modifying
    void deleteByToken(String token);

    @Modifying
    void deleteAllByExpiryDateBefore(LocalDateTime localDateTime);
}