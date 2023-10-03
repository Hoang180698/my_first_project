package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.LikeComment;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeCommentRepository extends JpaRepository<LikeComment, Integer> {
    boolean existsByCommentAndUser(Comment comment, User user);
    LikeComment findByUserAndComment(User user, Comment comment);
    void deleteAllByComment(Comment comment);
    void deleteAllByComment_Post(Post post);
}