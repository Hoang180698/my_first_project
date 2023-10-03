package com.example.snwbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "reply-comment")
public class ReplyComment {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, unique = true)
    private Integer id;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "like_count")
    private Integer likeCount;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    private Comment comment;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        likeCount = 0;
        createdAt = LocalDateTime.now();
        comment.setReplyCount(comment.getReplyCount() + 1);
        comment.getPost().setCommentCount(comment.getPost().getCommentCount() + 1);
    }

    @PreRemove
    public void preRemove() {
        comment.setReplyCount(comment.getReplyCount() - 1);
        comment.getPost().setCommentCount(comment.getPost().getCommentCount() - 1);
    }
}
