package com.example.snwbackend.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class NamedGroupChatRequest {
    private String name;
}
