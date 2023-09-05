package com.example.snwbackend.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class CreatePostRequest {
    private MultipartFile[] files;
    private String content;
}
