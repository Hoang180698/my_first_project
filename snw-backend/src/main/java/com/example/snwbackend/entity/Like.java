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
        name = "likes",
        uniqueConstraints ={@UniqueConstraint(columnNames={"user_id", "post_id"})}
)
public class Like {
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
    @JoinColumn(name = "post_id")
    private Post post;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        post.setLikeCount(post.getLikeCount() + 1);
    }

    @PreRemove
    public void preRemove() {
        post.setLikeCount(post.getLikeCount() - 1);
    }
}
