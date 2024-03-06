package com.example.snwbackend.controller;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.request.CreatePostRequest;
import com.example.snwbackend.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Post", description = "Post management APIs")
@RestController
@RequestMapping("api/post")
@Slf4j
@SecurityRequirement(name = "bearerAuth")
public class PostController{

    @Autowired
    private PostService postService;

//    // Tạo Post
//    @PostMapping("")
//    public ResponseEntity<?> createPost(@RequestBody UpsertPostRequest request) {
//        return new ResponseEntity<>(postService.createPost(request), HttpStatus.CREATED);
//    }

//    // Tạo Post với images
//    @PostMapping("create")
//    public ResponseEntity<?> createPostWithImages(@ModelAttribute MultipartFile[] files) {
//        return new ResponseEntity<>(postService.createPostWithImages(files), HttpStatus.CREATED);
//    }
//
//    // Câp nhật thông tin post
//    @PutMapping("{id}")
//    public ResponseEntity<?> updatePost(@PathVariable Integer id, @RequestBody UpsertPostRequest request) {
//        return ResponseEntity.ok(postService.updatePost(id, request));
//    }

    // Tạo post

    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Post.class)))
    @Operation(summary = "Create a post")
    @PostMapping("create-post")
    public ResponseEntity<?> createPostWithImagesOther(@ModelAttribute CreatePostRequest request) {
        return new ResponseEntity<>(postService.createPostWithImagesOther(request), HttpStatus.CREATED);
    }

    // get post by id
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PostDto.class)))
    @ApiResponse(responseCode = "404", description = "Not found post with given Id")
    @Operation(summary = "Get post by id",
            description = "Retrieve detailed information about a specific post")
    @GetMapping("{id}")
    public ResponseEntity<?> getPostById(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    // Xóa post
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = PostDto.class)))
    @ApiResponse(responseCode = "404", description = "Not found post with given Id")
    @ApiResponse(responseCode = "400", description = "Post have given Id not of user")
    @Operation(summary = "Delete post by id",
            description = "Delete a specific post. Only user's post.")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deletePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.deletePost(id));
    }

    // Lấy danh sách post của 1 user
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Page.class)))
    @Operation(summary = "Get posts by userId",
            description = "Retrieve posts of a user")
    @GetMapping("user-post/{userId}")
    public ResponseEntity<?> getPostByUserId(@PathVariable Integer userId,
                                             @RequestParam(required = false, defaultValue = "0") Integer page,
                                             @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(postService.getPostByUserId(userId, page, pageSize));
    }

    // Lấy danh sách post following (trang chủ)
    @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = Page.class)))
    @Operation(summary = "Get posts",
            description = "Retrieve posts of other users that user was followed")
    @GetMapping("")
    public ResponseEntity<?> getAllPost( @RequestParam(required = false, defaultValue = "0") Integer page,
                                         @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(postService.getAllPost(page, pageSize));
    }

    // Like post
    @Operation(summary = "Like post",
            description = "Like a specific post.")
    @PostMapping("{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    // Unlike Post
    @Operation(summary = "Unlike post",
            description = "Unlike a specific post.")
    @DeleteMapping("{id}/dislike")
    public ResponseEntity<?> dislikePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.dislikePost(id));
    }

    // Save Post
    @Operation(summary = "Save post",
            description = "Save a specific post.")
    @PostMapping("{id}/save")
    public ResponseEntity<?> savePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.savePost(id));
    }

    // Un save Post
    @Operation(summary = "Un-save post", description = "Un-save a specific post.")
    @DeleteMapping("{id}/un-save")
    public ResponseEntity<?> unSavePost(@PathVariable Integer id) {
        return ResponseEntity.ok(postService.unSavePost(id));
    }

    // Get all post saved
    @Operation(summary = "Get saved posts",
            description = "Retrieve saved posts of the user.")
    @GetMapping("save")
    public ResponseEntity<?> getAllSavedPost( @RequestParam(required = false, defaultValue = "0") Integer page,
                                              @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(postService.getAllSavedPost(page, pageSize));
    }

    // Lấy danh sách post vừa tạo theo list id
    @Operation(summary = "Get post by list id",
            description = "Retrieve list of posts by by list of id.")
    @GetMapping("get-new-post")
    public ResponseEntity<?> getPostsByIds(@RequestParam List<Integer> ids) {
        return ResponseEntity.ok(postService.getPostsByIds(ids));
    }
}
