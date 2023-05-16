package com.example.snwbackend.dto;

import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Post;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class NotificationDto {
    private Integer id;
    private String type;
    private Boolean seen;
    private LocalDateTime createdAt;
    private Integer senderId;
    private String senderName;
    private String senderAvatar;
    private Post post;
    private Comment comment;
}
