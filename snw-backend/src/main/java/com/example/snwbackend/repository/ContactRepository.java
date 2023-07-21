package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

    @Query("select ct from Contact ct where (ct.user1.id = ?1 and ct.user2.id = ?2) or (ct.user1.id = ?2 and ct.user2.id = ?1)")
    Optional<Contact> getContactBy2User(Integer user1Id, Integer user2Id);

    @Query("select ct from Contact ct where ct.user1.id = ?1 or ct.user2.id = ?1 order by ct.lastMessage.createdAt desc ")
    List<Contact> getAllContactByUserId(Integer userId);
}
