package com.example.snwbackend.service;

import com.example.snwbackend.entity.Image;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.ImageRepository;
import com.example.snwbackend.repository.PostRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.UpsertPostRequest;
import com.example.snwbackend.response.ImageResponse;
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

    public Object getPostsByUserId;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private ImageRepository imageRepository;


    // Tạo post
    @Transactional
    public Post createPost(UpsertPostRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        // Tạo post
        Post post = Post.builder()
                .content(request.getContent())
                .imagesUrl(request.getImagesUrl())
                .user(user)
                .build();
        return postRepository.save(post);
    }

    public Post getPostById(Integer id) {
        return postRepository.findById(id).orElseThrow(() -> {
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
        post.setImagesUrl(request.getImagesUrl());

        return postRepository.save(post);
    }

    // Xóa post
    @Transactional
    public void deletePost(Integer id) {
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

        postRepository.delete(post);
    }

    // Lấy danh sách post của 1 user
    public List<Post> getPostByUserId(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " +userId);
        });
        return postRepository.findAllByUser(user);
    }


    // Lấy danh sách post cho trang chủ
    public List<Post> getAllPost() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPostFollowing(user.getId());
    }

    // lấy danh post của mình
    public List<Post> getAllMyPost() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.findAllByUser(user);
    }

    // Tạo post với images
    @Transactional
    public Post createPostWithImages(String content, MultipartFile[] files) {
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
                    .imagesUrl(urls)
                    .user(user)
                    .build();
            return postRepository.save(post);
        } catch (Exception e) {
            throw new RuntimeException("Upload post error");
        }

    }

}
