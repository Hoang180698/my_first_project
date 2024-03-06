package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.CommentRequest;
import com.example.snwbackend.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Comment", description = "Comment management APIs")
@RestController
@RequestMapping("api/comment")
@Slf4j
@SecurityRequirement(name = "bearerAuth")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // Comment một post
    @Operation(summary = "Post comment")
    @PostMapping("{postId}")
    public ResponseEntity<?> createComment(@PathVariable Integer postId, @RequestBody @Valid CommentRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new BadRequestException("Invalid request");
        }
        return new ResponseEntity<>(commentService.createComment(postId, request), HttpStatus.CREATED);
    }

    //Get comment by id
    @Operation(summary = "Get comment by id",
            description = "Retrieve detailed information about a specific comment")
    @GetMapping("/detail/{commentId}")
    public ResponseEntity<?> getCommentById(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.getCommentById(commentId));
    }

    // Get Reply Comment by id
    @Operation(summary = "Get reply-comment by id",
            description = "Retrieve detailed information about a specific reply comment")
    @GetMapping("reply/detail/{replyId}")
    public ResponseEntity<?> getReplyCommentById(@PathVariable Integer replyId) {
        return ResponseEntity.ok(commentService.getReplyCommentById(replyId));
    }

    // Lấy danh sách comment của 1 post
    @Operation(summary = "Get comments by postId",
            description = "Get comments of a specific post that not of the user")
    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getAllCommentByPostId(@PathVariable Integer postId,
                                                   @RequestParam(required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(commentService.getAllCommentByPostId(postId, page, pageSize));
    }

    // Lấy comments của 1 user
    @Operation(summary = "Get user's comment by post id",
            description = "Get all user's comments of a specific post")
    @GetMapping("/own-cmt/post/{postId}")
    public ResponseEntity<?> getOwnCommentsByPost(@PathVariable Integer postId) {
        return ResponseEntity.ok(commentService.getOwnCommentsByPost(postId));
    }

    // Lấy reply-comment của 1 comment
    @Operation(summary = "Get replies by commentId",
            description = "Get replies of a specific comment")
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
    @Operation(summary = "Delete comment by id",
            description = "Delete comment by id. Can only delete user's comments")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.deleteComment(id));
    }

    // Reply comment
    @Operation(summary = "Reply a comment",
            description = "Create a new reply-comments")
    @PostMapping("reply/{commentId}")
    public ResponseEntity<?> replyComment(@PathVariable Integer commentId, @RequestBody @Valid CommentRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new BadRequestException("Invalid request");
        }
        return new ResponseEntity<>(commentService.replyComment(commentId, request), HttpStatus.CREATED);
    }

    // Xóa Reply comment
    @Operation(summary = "Delete a reply-comment by id",
            description = "Delete a specific reply-comment. Can only delete user's reply-comment.")
    @DeleteMapping("reply/delete/{replyCommentId}")
    public ResponseEntity<?> deleteReplyComment(@PathVariable Integer replyCommentId) {
        return ResponseEntity.ok(commentService.deleteReplyComment(replyCommentId));
    }

    // Like Comment(like and unlike)
    @Operation(summary = "Like a comment",
            description = "Toggle like a specific comments.")
    @PostMapping("like/{commentId}")
    public ResponseEntity<?> likeComment(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.likeComment(commentId));
    }

    // Like ReplyComment(like and unlike)
    @Operation(summary = "Like a reply-comment",
            description = "Toggle like a specific reply-comment.")
    @PostMapping("reply/like/{replyCommentId}")
    public ResponseEntity<?> likeReplyComment(@PathVariable Integer replyCommentId) {
        return ResponseEntity.ok(commentService.likeReplyComment(replyCommentId));
    }
}
