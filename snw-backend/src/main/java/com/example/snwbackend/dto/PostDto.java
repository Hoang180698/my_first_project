package com.example.snwbackend.dto;

import com.example.snwbackend.entity.User;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class PostDto {
    private Integer id;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long likeCount;
    private Long commentCount;
    private boolean liked;
    private Integer userId;
    private String userName;
    private String userAvatar;
//    private List<String> imageUrls;

}
