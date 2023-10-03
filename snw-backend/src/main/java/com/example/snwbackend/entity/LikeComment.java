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
        name = "like-comment",
        uniqueConstraints ={@UniqueConstraint(columnNames={"user_id", "comment_id"})}
)
public class LikeComment {
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
    @JoinColumn(name = "comment_id")
    private Comment comment;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        comment.setLikeCount(comment.getLikeCount() + 1);
    }

    @PreRemove
    public void preRemove() {
        comment.setLikeCount(comment.getLikeCount() - 1);
    }
}
