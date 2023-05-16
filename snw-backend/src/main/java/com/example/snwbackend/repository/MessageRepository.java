package com.example.snwbackend.repository;

import com.example.snwbackend.dto.MessageDto;
import com.example.snwbackend.entity.Contact;
import com.example.snwbackend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findAllByContactOrderByCreatedAtDesc(Contact contact);
}
