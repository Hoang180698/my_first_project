package com.example.snwbackend.response;

import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Builder
public class UnreadMessageCountResponse {
    private Integer unreadMessageCount;
}
