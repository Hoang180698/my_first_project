package com.example.snwbackend.request;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class RegisterRequest {
    private String email;
    private String name;
    private String password;
}
