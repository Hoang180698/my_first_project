package com.example.snwbackend.controller;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.request.UpsertUserRequest;
import com.example.snwbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    // Tạo User
    @PostMapping("")
    public ResponseEntity<?> createUser(@RequestBody UpsertUserRequest request) {
        return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
    }

    // Cập nhật thông tin User
    @PutMapping("{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody UpsertUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
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

}
