package com.example.snwbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class MessageDto {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private Integer senderId;
    private String senderName;
    private String senderAvatar;
    private boolean isRead;
}
