package com.example.snwbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.LinkedHashSet;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@ToString
@Table(name = "Conversation")
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, unique = true)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "last_message_id")
    private Message lastMessage;

    private boolean isGroupChat;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    @Column(name = "name")
    private String name;

    @ManyToMany
    @JoinTable(name = "user_conversation",
            joinColumns = @JoinColumn(name = "conversation_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> users = new LinkedHashSet<>();

    @PrePersist
    protected void onCreate() {
        if (user1 == null || user2 == null) {
            return;
        }
        if (user1.getId() > user2.getId()) {
            User temp = user1;
            user1 = user2;
            user2 = temp;
        }
    }
}
