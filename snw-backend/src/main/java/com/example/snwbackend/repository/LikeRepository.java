package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Like;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByPostAndUser(Post post, User user);

    @Modifying
    void deleteByPost(Post post);

    void deleteAllByPost(Post post);

    boolean existsByPost_IdAndUser_Id(Integer postId, Integer userId);
}
