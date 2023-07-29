package com.example.snwbackend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class UserConversationKey implements Serializable {

    @Column(name = "user_id")
    public Integer userId;

    @Column(name = "conversation_id")
    public Integer conversationId;
}
