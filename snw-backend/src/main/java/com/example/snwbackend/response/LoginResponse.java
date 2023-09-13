package com.example.snwbackend.response;

import com.example.snwbackend.dto.UserDto;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class LoginResponse {
    private UserDto auth;
    private String token;
    private String refreshToken;

    @JsonProperty("isAuthenticated")
    private Boolean isAuthenticated;
}
