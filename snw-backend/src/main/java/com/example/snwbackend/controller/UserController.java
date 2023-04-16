package com.example.snwbackend.controller;

import com.example.snwbackend.request.UpdateInfoUserRequest;
import com.example.snwbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> updateUser(@RequestBody UpdateInfoUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request));
    }

    // Tìm kiếm user
    @GetMapping("search")
    public ResponseEntity<?> searchUser(@RequestParam String term) {
        return ResponseEntity.ok(userService.searchUser(term));
    }

    // Lấy danh sách following
    @GetMapping("{id}/following")
    public ResponseEntity<?> getUsersFollowing(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUsersFollowing(id));
    }

    // Lấy danh sách follower
    @GetMapping("{id}/follower")
    public ResponseEntity<?> getUsersFollower(@PathVariable Integer id) {
        return ResponseEntity.ok(userService.getUsersFollower(id));
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
}
