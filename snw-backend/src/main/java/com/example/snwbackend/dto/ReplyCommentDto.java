package com.example.snwbackend.dto;

import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.ReplyComment;
import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ReplyCommentDto {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private Integer likeCount;
    private Integer userId;
    private String userName;
    private String userAvatar;
    private boolean isLiked;
    private Integer commentId;

    public ReplyCommentDto(ReplyComment comment, boolean isLiked) {
        this.commentId = comment.getComment().getId();
        this.id = comment.getId();
        this.content = comment.getContent();
        this.createdAt = comment.getCreatedAt();
        this.likeCount = comment.getLikeCount();
        this.userId = comment.getUser().getId();
        this.userName = comment.getUser().getName();
        this.userAvatar = comment.getUser().getAvatar();
        this.isLiked = isLiked;
    }
}

