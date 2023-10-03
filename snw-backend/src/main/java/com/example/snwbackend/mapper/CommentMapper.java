package com.example.snwbackend.mapper;

import com.example.snwbackend.dto.CommentDto;
import com.example.snwbackend.entity.Comment;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {
     public CommentDto toCommentDto(Comment comment) {
         return CommentDto.builder()
                 .id(comment.getId())
                 .content(comment.getContent())
                 .createdAt(comment.getCreatedAt())
                 .userId(comment.getUser().getId())
                 .userName(comment.getUser().getName())
                 .userAvatar(comment.getUser().getAvatar())
                 .build();
     }
}
