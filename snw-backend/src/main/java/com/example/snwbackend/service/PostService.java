package com.example.snwbackend.service;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.UpsertPostRequest;
import com.example.snwbackend.response.StatusResponse;
import com.example.snwbackend.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    // Tạo post
    @Transactional
    public Post createPost(UpsertPostRequest request) {
        if(request.getContent().isEmpty()) {
            throw new BadRequestException("Content or images cannot be empty");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        // Tạo post
        Post post = Post.builder()
                .content(request.getContent())
                .imageUrls(request.getImagesUrl())
                .user(user)
                .build();
        return postRepository.save(post);
    }

    // Lấy post theo id
    public PostDto getPostById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPostDtoById(id, user.getId()).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
    }

    // update post
    @Transactional
    public Post updatePost(Integer id, UpsertPostRequest request) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if (user.getId() != post.getUser().getId()) {
            throw new BadRequestException("You do not have permission to update this post");
        }

        post.setContent(request.getContent());
        post.setImageUrls(request.getImagesUrl());

        return postRepository.save(post);
    }

    // Xóa post
    @Transactional
    public StatusResponse deletePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if (user.getId() != post.getUser().getId()) {
            throw new BadRequestException("You do not have permission to delete this post");
        }
        likeRepository.deleteByPost(post);
        commentRepository.deleteAllByPost(post);
        notificationRepository.deleteAllByPost(post);
        postRepository.delete(post);

        return new StatusResponse("ok");
    }

    // Lấy danh sách post của 1 user
    public List<PostDto> getPostByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " +userId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user1 = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPDtoByUser(userId, user1.getId());
    }


    // Lấy danh sách post cho trang chủ
    public List<PostDto> getAllPost() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPDtoFollowing(user.getId());
    }

    // lấy danh post của mình
    public List<PostDto> getAllMyPost() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPDtoByUser(user.getId(), user.getId());
    }

    // Tạo post với images
    @Transactional
    public Post createPostWithImages(String content, MultipartFile[] files) {
        if(content.isEmpty() && files.length == 0) {
            throw new BadRequestException("Content or images cannot be empty");
        }
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        try {
            List<String> urls = new ArrayList<>();
            for (MultipartFile file: files) {
                imageUtils.validateFile(file);
                Image image = Image.builder()
                        .data(file.getBytes())
                        .type(file.getContentType())
                        .user(user)
                        .build();

                imageRepository.save(image);

                String url = "/api/images/read/" + image.getId();
                urls.add(url);
            }
            Post post = Post.builder()
                    .content(content)
                    .imageUrls(urls)
                    .user(user)
                    .build();
            return postRepository.save(post);
        } catch (Exception e) {
            throw new RuntimeException("Upload post error");
        }

    }

    // Like post
    @Transactional
    public StatusResponse likePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        if(likeRepository.findByPostAndUser(post, user).isPresent()) {
            throw new BadRequestException("You have already liked this post");
        }
        Like like = Like.builder()
                .post(post)
                .user(user)
                .build();
        post.setLikeCount(post.getLikeCount() + 1);

        likeRepository.save(like);
        postRepository.save(post);

        // Tao thong bao
        Notification notification = Notification.builder()
                .user(post.getUser())
                .sender(user)
                .type("like")
                .post(post)
                .build();
        notificationRepository.save(notification);

        return new StatusResponse("ok") ;
    }

    // unlike post
    @Transactional
    public StatusResponse dislikePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Like like = likeRepository.findByPostAndUser(post, user).orElseThrow(() -> {
            throw new BadRequestException("You have not liked this post");
        });
        post.setLikeCount(post.getLikeCount() - 1);

        likeRepository.delete(like);
        postRepository.save(post);

        // xoa thong bao
        Notification notification = notificationRepository.findByUserAndSenderAndPostAndType(post.getUser(), user, post, "like").get();
        notificationRepository.delete(notification);

        return new StatusResponse("ok") ;
    }
}
