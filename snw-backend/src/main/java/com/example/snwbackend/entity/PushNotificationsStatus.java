package com.example.snwbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "notificatios-status")
public class PushNotificationsStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, unique = true)
    private Integer id;

    @Column(name = "on_Likes")
    private boolean onLikes;

    @Column(name = "on_comments")
    private boolean onComments;

    @Column(name = "on_new_follower")
    private boolean onNewFollower;

    public PushNotificationsStatus() {
        this.onLikes = true;
        this.onComments = true;
        this.onNewFollower = true;
    }
}
