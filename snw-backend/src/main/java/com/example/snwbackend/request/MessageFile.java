package com.example.snwbackend.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.ByteBuffer;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class MessageFile {
   private ByteBuffer data;
}
