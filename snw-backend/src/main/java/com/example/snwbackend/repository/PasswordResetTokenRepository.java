package com.example.snwbackend.repository;

import com.example.snwbackend.entity.PasswordResetToken;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Integer> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(User user);
    PasswordResetToken findByUser_IdAndToken(Integer userId, String token);
}