package com.example.snwbackend.request;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UpdateInfoUserRequest {
    private String name;
    private String phone;
    private String address;
    private String biography;
    private String gender;
    private String birthday;
}
