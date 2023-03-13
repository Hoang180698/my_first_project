package com.example.snwbackend.mapper;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDto toUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .address(user.getAddress())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .gender(user.getGender())
                .build();
    }
}
