package com.example.snwbackend.repository;

import com.example.snwbackend.dto.MessageDto;
import com.example.snwbackend.entity.Contact;
import com.example.snwbackend.entity.Conversation;
import com.example.snwbackend.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    Page<Message> findAllByConversationOrderByCreatedAtDesc(Conversation conversation, Pageable pageable);

    @Modifying
    void deleteAllByConversation(Conversation conversation);
}
