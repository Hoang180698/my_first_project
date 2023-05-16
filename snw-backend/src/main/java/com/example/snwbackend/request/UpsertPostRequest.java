package com.example.snwbackend.request;

import lombok.*;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpsertPostRequest {
    private String content;
}
