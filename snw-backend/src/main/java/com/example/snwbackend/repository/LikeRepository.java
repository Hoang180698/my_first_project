package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Like;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostAndUser(Post post, User user);
    void deleteByPost(Post post);
}
