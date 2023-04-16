package com.example.snwbackend.dto;

import com.example.snwbackend.entity.User;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@ToString
public class UserDetailDto {
    private Integer id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String biography;
    private String avatar;
    private String gender;
    private String birthday;
    private boolean followed;
}
