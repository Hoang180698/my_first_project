package com.example.snwbackend.dto;

import com.example.snwbackend.entity.Comment;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CommentDto {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private Integer likeCount;
    private Integer replyCount;
    private Integer userId;
    private String userName;
    private String userAvatar;
    private boolean isLiked;
    private Integer postId;

    public CommentDto(Comment comment, boolean isLiked) {
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.likeCount = comment.getLikeCount();
        this.replyCount = comment.getReplyCount();
        this.userId = comment.getUser().getId();
        this.userName = comment.getUser().getName();
        this.userAvatar = comment.getUser().getAvatar();
        this.isLiked = isLiked;
        this.postId = comment.getPost().getId();
    }
}
