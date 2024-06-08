package com.example.snwbackend.repository;

import com.example.snwbackend.entity.ChatImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatImageRepository extends JpaRepository<ChatImage, Integer> {
}