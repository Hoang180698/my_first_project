package com.example.snwbackend.repository;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Integer> {

    VerificationToken findByToken(String token);
    VerificationToken findByUser(User user);
    VerificationToken findByUser_IdAndToken(Integer userId, String token);
}