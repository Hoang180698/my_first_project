package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.ReplyComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReplyCommentRepository extends JpaRepository<ReplyComment, Integer> {
    Page<ReplyComment> findAllByCommentOrderByCreatedAtAsc(Comment comment, Pageable pageable);
    void deleteAllByComment(Comment comment);
    void deleteAllByComment_Post(Post post);
}