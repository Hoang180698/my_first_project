package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.CommentRequest;
import com.example.snwbackend.service.CommentService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/comment")
@Slf4j
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Comment một post
    @PostMapping("{postId}")
    public ResponseEntity<?> createComment(@PathVariable Integer postId, @RequestBody @Valid CommentRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new BadRequestException("Invalid request");
        }
        return new ResponseEntity<>(commentService.createComment(postId, request), HttpStatus.CREATED);
    }

    // Lấy danh sách comment của 1 post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getAllCommentByPostId(@PathVariable Integer postId,
                                                   @RequestParam(required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(commentService.getAllCommentByPostId(postId, page, pageSize));
    }

    // Sửa comment
    @PutMapping("{id}")
    public ResponseEntity<?> editComment(@PathVariable Integer id, @RequestBody @Valid CommentRequest request) {
        return ResponseEntity.ok(commentService.editComment(id, request));
    }

    // Xóa comment
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }
}
