package com.example.snwbackend.request;

import lombok.*;
import org.hibernate.validator.constraints.Length;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class PasswordRequest {
    private String oldPassword;
    private String newPassword;
}
