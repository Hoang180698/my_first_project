package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.Save;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface SaveRepository extends JpaRepository<Save, Integer> {
    Optional<Save> findByUserAndPost(User user, Post post);

    @Modifying
    void deleteAllByPost(Post post);

    boolean existsByPost_IdAndUser_Id(Integer postId, Integer userId);
}
