package com.example.snwbackend.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpsertUserRequest {
    private String name;
    private String email;
    private String phone;
    private String password;
    private String avatar;
    private String address;
    private String gender;
}
