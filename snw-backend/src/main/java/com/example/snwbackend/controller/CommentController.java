package com.example.snwbackend.controller;

import com.example.snwbackend.service.CommentService;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/comment")
@Slf4j
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Comment một post
    @PostMapping("{postId}")
    public ResponseEntity<?> createComment(@PathVariable Integer postId, @RequestParam String content) {
        return new ResponseEntity<>(commentService.createComment(postId, content), HttpStatus.CREATED);
    }

    // Lấy danh sách comment của 1 post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getAllCommentByPostId(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getAllCommentByPostId(postId));
    }

    // Sửa comment
    @PutMapping("{id}")
    public ResponseEntity<?> editComment(@PathVariable Integer id, @RequestParam String content) {
        return ResponseEntity.ok(commentService.editComment(id, content));
    }

    // Xóa comment
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }
}
