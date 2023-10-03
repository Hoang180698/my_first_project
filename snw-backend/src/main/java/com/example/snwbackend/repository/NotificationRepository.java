package com.example.snwbackend.repository;

import com.example.snwbackend.dto.NotificationDto;
import com.example.snwbackend.entity.*;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Optional<Notification> findByUserAndSenderAndType(User user, User sender, String type);

    Page<Notification> findAllByUser_IdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    Optional<Notification> findByUserAndSenderAndPostAndType(User user, User sender, Post post, String type);

    Optional<Notification> findByUserAndSenderAndPostAndCommentAndType(User user, User sender, Post post, Comment comment, String type);

    List<Notification> findAllByUser(User user);
    void deleteAllByCreatedAtBefore(LocalDateTime localDateTime);
    void deleteByPostAndSenderAndType(Post post, User sender, String type);
    void deleteByUserAndSenderAndType(User user, User sender, String type);
    void deleteAllByPost(Post post);
    void deleteAllByComment(Comment comment);
    void deleteByUser(User user);
    void deleteBySenderAndReplyCommentAndType(User sender, ReplyComment replyComment, String type);
    void deleteBySenderAndCommentAndType(User sender, Comment comment, String type);
    void deleteAllByReplyComment(ReplyComment replyComment);
    void deleteAllByPost_Id(Integer postId);

    @Modifying
    @Transactional
    @Query("update Notification n set n.seen = true where n.user.id = ?1")
    void updateSeenNotification(Integer userId);

    @Query("select new com.example.snwbackend.dto.NotificationDto(n.id, n.type, n.seen, n.createdAt, n.sender.id, n.sender.name, n.sender.avatar, " +
            "n.post, n.comment) from Notification n where n.user.id = ?1 order by n.createdAt desc")
    List<NotificationDto> getAllNotificationDtoByUserId(Integer UserId);
}
