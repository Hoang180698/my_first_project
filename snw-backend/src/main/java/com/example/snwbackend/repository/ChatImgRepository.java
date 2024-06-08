package com.example.snwbackend.repository;

import com.example.snwbackend.entity.ChatImage;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

@Repository
public class ChatImgRepository {
    @PersistenceContext
    private EntityManager entityManager;

    public void saveImage(ChatImage chatImage) {
        entityManager.persist(chatImage);
        entityManager.flush();
    }
}
