package com.example.snwbackend.dto;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class UserDtoOther {
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
    private Integer postCount;
    private Integer followerCount;
    private Integer followingCount;
}
