package com.example.snwbackend.dto;

import com.example.snwbackend.entity.Post;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class PDto {
    private Post post;
    private Long likeCount;
    private Long commentCount;
    private boolean liked;
    private Integer userId;
    private String userName;
    private String userAvatar;
}
