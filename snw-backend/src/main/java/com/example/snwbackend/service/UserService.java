package com.example.snwbackend.service;

import com.example.snwbackend.dto.UserDetailDto;
import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.dto.UserDtoOther;
import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.PasswordRequest;
import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.response.ImageResponse;
import com.example.snwbackend.response.StatusResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private FollowRepository followRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ReplyCommentRepository replyCommentRepository;

    // Tìm user theo id
    public UserDtoOther getUserById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        UserDetailDto userDetailDto = userRepository.findUserDetailDtoById(id, user.getId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        UserDtoOther userDtoOther = UserDtoOther
                .builder()
                .id(userDetailDto.getId())
                .address(userDetailDto.getAddress())
                .avatar(userDetailDto.getAvatar())
                .biography(userDetailDto.getBiography())
                .birthday(userDetailDto.getBirthday())
                .followed(userDetailDto.isFollowed())
                .name(userDetailDto.getName())
                .email(userDetailDto.getEmail())
                .phone(userDetailDto.getPhone())
                .gender(userDetailDto.getGender())
                .followerCount(followRepository.countByFollowing_Id(id))
                .followingCount(followRepository.countByFollower_Id(id))
                .postCount(postRepository.countByUser_Id(id))
                .build();
        return userDtoOther;
    }

    // Update thong tin ca nhan
    public UserDto updateUser(UpdateInfoUserRequest request) {
        String gender = request.getGender();
        if(gender.equals("male") && gender.equals("female") && gender.equals("gay") && gender.equals("les") && gender.equals("")) {
            throw new BadRequestException("invalid request in field gender");
        }
        if(request.getPhone() != null && (request.getPhone().length() < 9 && request.getPhone().length() > 1)) {
            throw new BadRequestException("invalid request in field phone");
        }
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
    public Page<UserDetailDto> searchUser(String term, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<User> users = userRepository.findByKeywordOther(term, PageRequest.of(page, pageSize));
        Page<UserDetailDto> userDetailDtos = users.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(user.getId(), u.getId())));
        return userDetailDtos;
    }

    // Lấy danh sách user đang follow
    public Page<UserDetailDto> getUsersFollowing(Integer id, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User auth = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        Page<User> users = userRepository.getUsersFollowingOther(id, PageRequest.of(page,pageSize));
        Page<UserDetailDto> userDetailDtos = users.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(auth.getId(), u.getId())));
        return userDetailDtos;
    }

    // Lấy danh sách follower
    public Page<UserDetailDto> getUsersFollower(Integer id, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User auth = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        User user = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        Page<User> users = userRepository.getUsersFollowerOther(id, PageRequest.of(page,pageSize));
        Page<UserDetailDto> userDetailDtos = users.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(auth.getId(), u.getId())));
        return userDetailDtos;
    }

    // Danh sách user like post
    public Page<UserDetailDto> getAllUserLikePost(Integer postId, Integer page, Integer pageSize) {
        Post post = postRepository.findById(postId).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + postId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<User> users = userRepository.findUserDetailDtoLikePostOther(postId, PageRequest.of(page,pageSize));
        Page<UserDetailDto> userDetailDtos = users.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(user.getId(), u.getId())));
        return userDetailDtos;
    }

    // Danh sách user like comment
    public Page<UserDetailDto> getAllUserLikeComment(Integer commentId, Integer page, Integer pageSize) {
        Comment comment = commentRepository.findById(commentId).orElseThrow(() -> {
            throw new NotFoundException("Not found comment with id = " + commentId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<User> userPage = userRepository.findUserLikedComment(commentId, PageRequest.of(page, pageSize));
        Page<UserDetailDto> userDetailDtoPage = userPage.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(user.getId(), u.getId())));
        return userDetailDtoPage;
    }

    // Danh sách user like reply comment
    public Page<UserDetailDto> getAllUserLikeReplyComment(Integer replyCommentId, Integer page, Integer pageSize) {
        ReplyComment replyComment = replyCommentRepository.findById(replyCommentId).orElseThrow(() -> {
            throw new NotFoundException("Not found comment with id = " + replyCommentId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<User> userPage = userRepository.findUserLikedReplyComment(replyCommentId, PageRequest.of(page, pageSize));
        Page<UserDetailDto> userDetailDtoPage = userPage.map((u) -> new UserDetailDto(u,
                followRepository.existsByFollower_IdAndFollowing_Id(user.getId(), u.getId())));
        return userDetailDtoPage;
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
    @Transactional
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
        if(user.getId() == id) {
            throw new BadRequestException("It's you?");
        }

        Follow follow = Follow
                .builder()
                .follower(user)
                .following(userFl)
                .build();
        followRepository.save(follow);

//       Tạo thông báo
        if(userFl.getPushNotificationsStatus().isOnNewFollower()) {
            Notification notification = Notification.builder()
                    .user(userFl)
                    .sender(user)
                    .content("started following you")
                    .type("follow")
                    .build();
            notificationRepository.save(notification);
        }
        return new StatusResponse("Successfully follow");
    }

    // unfollow
    @Transactional
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
        // Xoa thong bao
        notificationRepository.deleteByUserAndSenderAndType(userFl, user, "follow");

        return new StatusResponse("ok");
    }

    // Remove follower
    public StatusResponse removeFollower(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        User follower = userRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + id);
        });
        Follow follow = followRepository.findByFollowerAndFollowing(follower, user).orElseThrow(() -> {
            throw new BadRequestException("This user have not followed you yet");
        });

        followRepository.delete(follow);

        return new StatusResponse("ok");
    }


    // thay doi password
    public StatusResponse changePassword(PasswordRequest request) {
        if (request.getOldPassword() == request.getNewPassword()) {
            throw new BadRequestException("The new password must be different from the old password");
        }
        if (request.getNewPassword().length() > 20 || request.getNewPassword().length() < 3) {
            throw new BadRequestException("Password mismatch");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if(passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return new StatusResponse("ok");
        } else {
            throw new BadRequestException("old password is incorrect");
        }
    }

}
