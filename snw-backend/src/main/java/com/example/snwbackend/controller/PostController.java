package com.example.snwbackend.controller;

import com.example.snwbackend.request.UpsertPostRequest;
import com.example.snwbackend.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/post")
@Slf4j
public class PostController {

    @Autowired
    private PostService postService;

    // Tạo Post
    @PostMapping("")
    public ResponseEntity<?> createPost(@RequestBody UpsertPostRequest request) {
        return new ResponseEntity<>(postService.createPost(request), HttpStatus.CREATED);
    }

    // Tạo Post với images
    @PostMapping("create")
    public ResponseEntity<?> createPostWithImages(@RequestParam String content, @ModelAttribute MultipartFile[] files) {
        return new ResponseEntity<>(postService.createPostWithImages(content, files), HttpStatus.CREATED);
    }


    // xem chi tiet post
    @GetMapping("{id}")
    public ResponseEntity<?> getPostById(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // Câp nhật thông tin post
    @PutMapping("{id}")
    public ResponseEntity<?> updatePost(@PathVariable Integer id, @RequestBody UpsertPostRequest request) {
        log.info("id : {}", id);
        log.info("request : {}", request);
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    // Xóa post
    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePost(@PathVariable Integer id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    // Xem danh sách post của 1 user
    @GetMapping("user-post/{userId}")
    public ResponseEntity<?> getPostByUserId(@PathVariable Integer userId) {
        return ResponseEntity.ok(postService.getPostByUserId(userId));
    }

    // Xem danh sách post following (trang chủ)
    @GetMapping("")
    public ResponseEntity<?> getAllPost() {
        return ResponseEntity.ok(postService.getAllPost());
    }

    // Xem danh sách post của mình
    @GetMapping("user-post")
    public ResponseEntity<?> getAllMyPost() {
        return ResponseEntity.ok(postService.getAllMyPost());
    }

    // Like post
    @PostMapping("{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    // Dis like Post
    @DeleteMapping("{id}/dislike")
    public ResponseEntity<?> dislikePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.dislikePost(id));
    }
}
