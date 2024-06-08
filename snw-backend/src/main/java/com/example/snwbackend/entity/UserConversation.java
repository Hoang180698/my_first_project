package com.example.snwbackend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
@Entity
@Table(name = "user_conversation")
public class UserConversation {

    @EmbeddedId
    UserConversationKey id;

    @JsonIgnore
    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("conversationId")
    @JoinColumn(name = "conversation_id")
    private Conversation conversation;

    @Column(name = "unread_count")
    private Integer unreadCount;

    @Column(name = "is_Archive")
    private Boolean isArchive;

    @Column(name = "is_on_sound_notice")
    private Boolean isOnSound;
}

