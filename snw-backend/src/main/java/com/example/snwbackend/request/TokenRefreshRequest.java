package com.example.snwbackend.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TokenRefreshRequest {
    @NotBlank
    private String refreshToken;
}
