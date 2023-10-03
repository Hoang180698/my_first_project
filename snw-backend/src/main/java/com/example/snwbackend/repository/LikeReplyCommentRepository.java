package com.example.snwbackend.repository;

import com.example.snwbackend.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeReplyCommentRepository extends JpaRepository<LikeReplyComment, Integer> {
    boolean existsByUserAndReplyComment(User user, ReplyComment replyComment);
    LikeReplyComment findByUserAndReplyComment(User user, ReplyComment replyComment);
    void deleteAllByReplyComment(ReplyComment replyComment);
    void deleteAllByReplyComment_Comment(Comment comment);
    void deleteAllByReplyComment_Comment_Post(Post post);
}