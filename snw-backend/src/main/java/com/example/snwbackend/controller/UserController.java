package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.PasswordRequest;
import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "User", description = "User management APIs")
@RestController
@RequestMapping("api/users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    // Lấy User theo id
    @Operation(summary = "Get user by id",
            description = "Retrieve detailed information about a specific user.")
    @GetMapping("{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Cập nhật thông tin User
    @Operation(summary = " Update personal information")
    @PutMapping("")
    public ResponseEntity<?> updateUser(@RequestBody @Valid UpdateInfoUserRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(userService.updateUser(request));
    }

    // Tìm kiếm user
    @Operation(summary = "Search user",
            description = "Search users by term.")
    @GetMapping("search")
    public ResponseEntity<?> searchUser(@RequestParam String term,
                                        @RequestParam(required = false, defaultValue = "0") Integer page,
                                        @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.searchUser(term, page, pageSize));
    }

    // Lấy danh sách following
    @Operation(summary = "Get following",
            description = "Get following of a user.")
    @GetMapping("{id}/following")
    public ResponseEntity<?> getUsersFollowing(@PathVariable Integer id,
                                               @RequestParam(required = false, defaultValue = "0") Integer page,
                                               @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getUsersFollowing(id, page, pageSize));
    }

    // Lấy danh sách follower
    @Operation(summary = "Get follower",
            description = "Get follower of a user.")
    @GetMapping("{id}/follower")
    public ResponseEntity<?> getUsersFollower(@PathVariable Integer id,
                                              @RequestParam(required = false, defaultValue = "0") Integer page,
                                              @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getUsersFollower(id, page, pageSize));
    }

    // Lấy danh sách user like post
    @Operation(summary = "Get users liked a post",
            description = "Get users liked a specific post.")
    @GetMapping("likes/post/{postId}")
    public ResponseEntity<?> getAllUserLikePost(@PathVariable Integer postId,
                                                @RequestParam(required = false, defaultValue = "0") Integer page,
                                                @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getAllUserLikePost(postId, page, pageSize));
    }

    // Lấy danh sách user like post like a comment
    @Operation(summary = "Get users liked a comment",
            description = "Get users liked a specific comment.")
    @GetMapping("likes/comment/{commentId}")
    public ResponseEntity<?> getAllUserLikeComment(@PathVariable Integer commentId,
                                                @RequestParam(required = false, defaultValue = "0") Integer page,
                                                @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getAllUserLikeComment(commentId, page, pageSize));
    }

    // Lấy danh sách user like post like a reply-comment
    @Operation(summary = "Get users liked a reply-comment",
            description = "Get users liked a specific reply-comment.")
    @GetMapping("likes/reply-comment/{replyCommentId}")
    public ResponseEntity<?> getAllUserLikeReplyComment(@PathVariable Integer replyCommentId,
                                                   @RequestParam(required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getAllUserLikeReplyComment(replyCommentId, page, pageSize));
    }

    // Xóa User
//    @DeleteMapping("{id}")
//    public ResponseEntity<?> deleteUserById(@PathVariable Integer id) {
//        userService.deleteUserById(id);
//        return ResponseEntity.noContent().build();
//    }

    // upload avatar
    @Operation(summary = "Change avatar", description = "Change user's avatar.")
    @PostMapping("avatar")
    public ResponseEntity<?> uploadAvatar(@ModelAttribute("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadAvatar(file));
    }

    // Xóa avatar
    @Operation(summary = "Delete avatar", description = "Delete current user's avatar.")
    @DeleteMapping("avatar")
    public ResponseEntity<?> deleteAvatar() {
        return ResponseEntity.ok(userService.deleteAvatar());
    }

    // Follow user
    @Operation(summary = "Follow a user", description = "Follow a specific user.")
    @PostMapping("follow/{id}")
    public ResponseEntity<?> followUser(@PathVariable Integer id) {
        return new ResponseEntity<>(userService.followUser(id), HttpStatus.CREATED);
    }
    // Unfollow
    @Operation(summary = "Un-follow a user", description = "Un-follow a specific user.")
    @DeleteMapping("unfollow/{id}")
    public ResponseEntity<?> unfollowUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.unfollowUser(id));
    }
   // Remove your follower
    @Operation(summary = "Remove follower",
            description = "Remove a specific user from list of user's follower.")
    @DeleteMapping("remove-follower/{id}")
    public ResponseEntity<?> removeFollower(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.removeFollower(id));
    }

    // Thay doi pass
    @Operation(summary = "Change password", description = "Change user's password.")
    @PutMapping("change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }
}
