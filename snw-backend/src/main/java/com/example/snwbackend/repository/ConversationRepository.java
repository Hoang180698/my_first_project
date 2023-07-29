package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Contact;
import com.example.snwbackend.entity.Conversation;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ConversationRepository extends JpaRepository<Conversation, Integer> {
    Optional<Conversation> findByUser1AndUser2(User user1, User user2);
}
