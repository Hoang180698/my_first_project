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
    private boolean isOnline;

    public UserDetailDto(User user, boolean followed) {
        this.id = user.getId();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.biography = user.getBiography();
        this.avatar = user.getAvatar();
        this.gender = user.getGender();
        this.birthday = user.getBirthday();
        this.email = user.getEmail();
        this.followed = followed;
        this.isOnline = user.getIsOnline();
    }
}
