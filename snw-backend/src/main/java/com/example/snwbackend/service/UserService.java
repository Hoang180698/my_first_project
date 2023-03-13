package com.example.snwbackend.service;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.UpsertUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    // Tìm user theo id
    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        return userMapper.toUserDto(user);
    }

    // Tạo User
    public UserDto createUser(UpsertUserRequest request) {
        Optional<User> user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new BadRequestException("This email is already used");
        }
        User user1 = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .address(request.getAddress())
                .password(request.getPassword())
                .avatar(request.getAvatar())
                .phone(request.getPhone())
                .build();
        userRepository.save(user1);
        return userMapper.toUserDto(user1);
    }

    // Update User
    public UserDto updateUser(Integer id, UpsertUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        user.setAddress(request.getAddress());
        user.setName(request.getName());
        user.setAvatar(request.getAvatar());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());

        userRepository.save(user);
        return userMapper.toUserDto(user);
    }

    // Tìm kiếm user theo tên
    public List<UserDto> searchUser(String term) {
        return userRepository.findByKeyword(term);
    }

    // Lấy danh sách user đang follow
    public List<UserDto> getUsersFollowing(Integer id) {
        return userRepository.getUsersFollowing(id);
    }

    // Lấy danh sách user đang follow
    public List<UserDto> getUsersFollower(Integer id) {
        return userRepository.getUsersFollower(id);
    }
}
