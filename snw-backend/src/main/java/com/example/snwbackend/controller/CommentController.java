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

    //Get comment by id
    @GetMapping("/detail/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    // Get Reply Comment by id
    @GetMapping("reply/detail/{replyId}")
    public ResponseEntity<?> getReplyCommentById(@PathVariable Integer replyId) {
        return ResponseEntity.ok(commentService.getReplyCommentById(replyId));
    }

    // Lấy danh sách comment của 1 post
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getAllCommentByPostId(@PathVariable Integer postId,
                                                   @RequestParam(required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(commentService.getAllCommentByPostId(postId, page, pageSize));
    }

    // Lấy comments của 1 user
    @GetMapping("/own-cmt/post/{postId}")
    public ResponseEntity<?> getOwnCommentsByPost(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getOwnCommentsByPost(postId));
    }

    // Lấy reply-comment của 1 comment
    @GetMapping("/reply/{commentId}")
    public ResponseEntity<?> getAllReplyCommentByCommentId(@PathVariable Integer commentId,
                                                           @RequestParam(required = false, defaultValue = "0") Integer page,
                                                           @RequestParam(required = false, defaultValue = "10") Integer pageSize){
        return ResponseEntity.ok(commentService.getAllReplyCommentByCommentId(commentId, page, pageSize));
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

    // Reply comment
    @PostMapping("reply/{commentId}")
    public ResponseEntity<?> replyComment(@PathVariable Integer commentId, @RequestBody @Valid CommentRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new BadRequestException("Invalid request");
        }
        return new ResponseEntity<>(commentService.replyComment(commentId, request), HttpStatus.CREATED);
    }

    // Xóa Reply comment
    @DeleteMapping("reply/delete/{replyCommentId}")
    public ResponseEntity<?> deleteReplyComment(@PathVariable Integer replyCommentId) {
        return ResponseEntity.ok(commentService.deleteReplyComment(replyCommentId));
    }

    // Like Comment(like and unlike)
    @PostMapping("like/{commentId}")
    public ResponseEntity<?> likeComment(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.likeComment(commentId));
    }

    // Like ReplyComment(like and unlike)
    @PostMapping("reply/like/{replyCommentId}")
    public ResponseEntity<?> likeReplyComment(@PathVariable Integer replyCommentId) {
        return ResponseEntity.ok(commentService.likeReplyComment(replyCommentId));
    }
}
