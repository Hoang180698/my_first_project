package com.example.snwbackend.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder

public class MessageRequest {
    private Integer senderId;
    private String content;
}
