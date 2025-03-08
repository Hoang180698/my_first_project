package com.example.snwbackend.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class AudioUploadResponse {
    private String audioUrl;
    private double duration;
}
