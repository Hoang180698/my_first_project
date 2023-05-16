package com.example.snwbackend.repository;

import com.example.snwbackend.dto.NotificationDto;
import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Notification;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {

    Optional<Notification> findByUserAndSenderAndType(User user, User sender, String type);

    List<Notification> findAllByUserOrderByCreatedAtDesc(User user);

    Optional<Notification> findByUserAndSenderAndPostAndType(User user, User sender, Post post, String type);

    Optional<Notification> findByUserAndSenderAndPostAndCommentAndType(User user, User sender, Post post, Comment comment, String type);

    List<Notification> findAllByUser(User user);

    void deleteByPostAndSenderAndType(Post post, User sender, String type);

    void deleteByUserAndSenderAndType(User user, User sender, String type);

    void deleteAllByPost(Post post);
    void deleteAllByComment(Comment comment);
    void deleteByUser(User user);

    @Modifying
    @Transactional
    @Query("update Notification n set n.seen = true where n.user.id = ?1")
    void updateSeenNotification(Integer userId);

    @Query("select new com.example.snwbackend.dto.NotificationDto(n.id, n.type, n.seen, n.createdAt, n.sender.id, n.sender.name, n.sender.avatar, " +
            "n.post, n.comment) from Notification n where n.user.id = ?1 order by n.createdAt desc")
    List<NotificationDto> getAllNotificationDtoByUserId(Integer UserId);
}
