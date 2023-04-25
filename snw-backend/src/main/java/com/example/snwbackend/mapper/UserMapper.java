package com.example.snwbackend.mapper;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    @Autowired
    private ModelMapper modelMapper;

    public UserDto toUserDto(User user) {
        return modelMapper.map(user, UserDto.class);
    }
}