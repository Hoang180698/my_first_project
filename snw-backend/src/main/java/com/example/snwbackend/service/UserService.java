package com.example.snwbackend.service;

import com.example.snwbackend.dto.UserDetailDto;
import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.Follow;
import com.example.snwbackend.entity.Image;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.FollowRepository;
import com.example.snwbackend.repository.ImageRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.response.ImageResponse;
import com.example.snwbackend.response.StatusResponse;
import jakarta.transaction.Transactional;
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
    private FollowRepository followRepository;

    @Autowired
    private UserMapper userMapper;

    // Tìm user theo id
    public UserDetailDto getUserById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return userRepository.findUserDetailDtoById(id, user.getId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
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
        user.setBirthday(request.getBirthday());

        userRepository.save(user);
        return userMapper.toUserDto(user);
    }

    // Tìm kiếm user theo tên
    public List<UserDetailDto> searchUser(String term) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return userRepository.findByKeyword(term, user.getId());
    }

    // Lấy danh sách user đang follow
    public List<UserDto> getUsersFollowing(Integer id) {
        return userRepository.getUsersFollowing(id);
    }

    // Lấy danh sách follower
    public List<UserDto> getUsersFollower(Integer id) {
        return userRepository.getUsersFollower(id);
    }

    public void deleteUserById(Integer id) {
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        userRepository.delete(user);
    }

    // Thay avatar
    @Transactional
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

    // Xóa avatar
    @Transactional
    public StatusResponse deleteAvatar() {
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
        return new StatusResponse("ok");
    }

    // follow user
    public StatusResponse followUser(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        User userFl = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        if(followRepository.findByFollowerAndFollowing(user, userFl).isPresent()) {
            throw new BadRequestException("You have already followed this user");
        }

        Follow follow = Follow
                .builder()
                .follower(user)
                .following(userFl)
                .build();
        followRepository.save(follow);
        return new StatusResponse("Successfully follow");
    }

    // unfollow
    public StatusResponse unfollowUser(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        User userFl = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });

        Follow follow = followRepository.findByFollowerAndFollowing(user, userFl).orElseThrow(() -> {
            throw new BadRequestException("Have not followed this user");
        });
        followRepository.delete(follow);

        return new StatusResponse("ok");
    }
}
