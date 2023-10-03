package com.example.snwbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(
        name = "like-reply-comment",
        uniqueConstraints ={@UniqueConstraint(columnNames={"user_id", "reply_comment_id"})}
)
public class LikeReplyComment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, unique = true)
    private Integer id;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "reply_comment_id")
    private ReplyComment replyComment;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        replyComment.setLikeCount(replyComment.getLikeCount() + 1);
    }

    @PreRemove
    public void preRemove() {
        replyComment.setLikeCount(replyComment.getLikeCount() - 1);
    }
}
