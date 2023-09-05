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
    private boolean saved;

    public PostDto(Post post, boolean liked, boolean saved) {
        this.post = post;
        this.userId = post.getUser().getId();
        this.userName = post.getUser().getName();
        this.userAvatar = post.getUser().getAvatar();
        this.liked = liked;
        this.saved = saved;
    }
}
