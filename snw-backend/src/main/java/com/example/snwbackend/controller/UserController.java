package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.PasswordRequest;
import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/users")

public class UserController {

    @Autowired
    private UserService userService;

    // Lấy User theo id
    @GetMapping("{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // Cập nhật thông tin User
    @PutMapping("")
    public ResponseEntity<?> updateUser(@RequestBody @Valid UpdateInfoUserRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(userService.updateUser(request));
    }

    // Tìm kiếm user
    @GetMapping("search")
    public ResponseEntity<?> searchUser(@RequestParam String term,
                                        @RequestParam(required = false, defaultValue = "0") Integer page,
                                        @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.searchUser(term, page, pageSize));
    }

    // Lấy danh sách following
    @GetMapping("{id}/following")
    public ResponseEntity<?> getUsersFollowing(@PathVariable Integer id,
                                               @RequestParam(required = false, defaultValue = "0") Integer page,
                                               @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getUsersFollowing(id, page, pageSize));
    }

    // Lấy danh sách follower
    @GetMapping("{id}/follower")
    public ResponseEntity<?> getUsersFollower(@PathVariable Integer id,
                                              @RequestParam(required = false, defaultValue = "0") Integer page,
                                              @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getUsersFollower(id, page, pageSize));
    }

    // Lấy danh sách user like post
    @GetMapping("likes/post/{postId}")
    public ResponseEntity<?> getAllUserLikePost(@PathVariable Integer postId,
                                                @RequestParam(required = false, defaultValue = "0") Integer page,
                                                @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getAllUserLikePost(postId, page, pageSize));
    }

    @GetMapping("likes/comment/{commentId}")
    public ResponseEntity<?> getAllUserLikeComment(@PathVariable Integer commentId,
                                                @RequestParam(required = false, defaultValue = "0") Integer page,
                                                @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(userService.getAllUserLikeComment(commentId, page, pageSize));
    }

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
    @PostMapping("avatar")
    public ResponseEntity<?> uploadAvatar(@ModelAttribute("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadAvatar(file));
    }

    // Xóa avatar
    @DeleteMapping("avatar")
    public ResponseEntity<?> deleteAvatar() {
        return ResponseEntity.ok(userService.deleteAvatar());
    }

    // Follow user
    @PostMapping("follow/{id}")
    public ResponseEntity<?> followUser(@PathVariable Integer id) {
        return new ResponseEntity<>(userService.followUser(id), HttpStatus.CREATED);
    }
    // Unfollow
    @DeleteMapping("unfollow/{id}")
    public ResponseEntity<?> unfollowUser(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.unfollowUser(id));
    }
   // Remove your follower
    @DeleteMapping("remove-follower/{id}")
    public ResponseEntity<?> removeFollower(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.removeFollower(id));
    }

    // Thay doi pass
    @PutMapping("change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordRequest request) {
        return ResponseEntity.ok(userService.changePassword(request));
    }
}
