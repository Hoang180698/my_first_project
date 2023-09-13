package com.example.snwbackend.response;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TokenRefreshResponse {
    private String accessToken;
    private String refreshToken;
}
