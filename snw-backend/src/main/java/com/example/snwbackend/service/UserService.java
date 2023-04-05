package com.example.snwbackend.service;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.Image;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.ImageRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.response.ImageResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserMapper userMapper;

    // Tìm user theo id
    public UserDto getUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        return userMapper.toUserDto(user);
    }

    // Update thong tin ca nhan
    public UserDto updateUser(UpdateInfoUserRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        user.setBiography(request.getBiography());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setName(request.getName());
        user.setPhone(request.getPhone());

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

    public void deleteUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        userRepository.delete(user);
    }

    public ImageResponse uploadAvatar(MultipartFile file) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        String oldAvatarPath = user.getAvatar();

        // Xoá bỏ  avatar cũ
        if (oldAvatarPath != null && !oldAvatarPath.isEmpty()) {
            Integer id = Integer.parseInt(oldAvatarPath.substring(oldAvatarPath.lastIndexOf("/") + 1));
            imageRepository.deleteById(id);
        }
        try {
            Image image = Image.builder()
                    .data(file.getBytes())
                    .type(file.getContentType())
                    .user(user)
                    .build();

            imageRepository.save(image);

            String url = "/api/images/read/" + image.getId();
            user.setAvatar(url);
            userRepository.save(user);
            return new ImageResponse(url);
        } catch (Exception e) {
            throw new RuntimeException("Upload image error");
        }
    }

    public void deleteAvatar() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        String oldAvatarPath = user.getAvatar();

        // Xoá bỏ  avatar cũ
        if (oldAvatarPath != null && !oldAvatarPath.isEmpty()) {
            Integer id = Integer.parseInt(oldAvatarPath.substring(oldAvatarPath.lastIndexOf("/") + 1));
            imageRepository.deleteById(id);
            user.setAvatar(null);
            userRepository.save(user);
        } else {
            throw new NotFoundException("Not have avatar");
        }
    }
}
