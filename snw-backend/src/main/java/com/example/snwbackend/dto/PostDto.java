package com.example.snwbackend.dto;

import com.example.snwbackend.entity.Post;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PostDto {
    private Post post;
    private boolean liked;
    private Integer userId;
    private String userName;
    private String userAvatar;
}
