package com.example.snwbackend.service;

import com.example.snwbackend.dto.CommentDto;
import com.example.snwbackend.entity.Comment;
import com.example.snwbackend.entity.Notification;
import com.example.snwbackend.entity.Post;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.CommentMapper;
import com.example.snwbackend.repository.CommentRepository;
import com.example.snwbackend.repository.NotificationRepository;
import com.example.snwbackend.repository.PostRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.response.StatusResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentMapper commentMapper;

    @Autowired
    private NotificationRepository notificationRepository;

    // Tạo comment
    @Transactional
    public CommentDto createComment(Integer postId, String content) {
        if(content.isEmpty()) {
            throw new BadRequestException("Content is required");
        }
        Post post = postRepository.findById(postId).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + postId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        Comment comment = Comment.builder()
                .content(content)
                .user(user)
                .post(post)
                .build();
        post.setCommentCount(post.getCommentCount() + 1);

        commentRepository.save(comment);
        postRepository.save(post);

        // tao thong bao
        Notification notification = Notification.builder()
                .type("comment")
                .user(post.getUser())
                .sender(user)
                .post(post)
                .comment(comment)
                .build();
        notificationRepository.save(notification);

        return commentMapper.toCommentDto(comment);
    }

    // edit comment
    public CommentDto editComment(Integer id, String content) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found comment with id = " + id);
        });

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if (comment.getUser().getId() != user.getId()) {
            throw new BadRequestException("You do not have permission to edit this comment");
        }
        comment.setContent(content);

        commentRepository.save(comment);

        return commentMapper.toCommentDto(comment);
    }

    // Xóa comment
    @Transactional
    public StatusResponse deleteComment(Integer id) {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found comment with id = " + id);
        });

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if (comment.getUser().getId() != user.getId()) {
            throw new BadRequestException("You do not have permission to edit this comment");
        }
        Post post = postRepository.findById(comment.getPost().getId()).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        post.setCommentCount(post.getCommentCount() - 1);

        commentRepository.delete(comment);
        notificationRepository.deleteAllByComment(comment);
        postRepository.save(post);

        return new StatusResponse("ok");
    }

    // Lấy comments của 1 post
    public List<CommentDto> getAllCommentByPostId(Integer postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Post post = postRepository.findById(postId).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + postId);
        });
        return commentRepository.getAllCmtDtoByPost(postId, user.getId());
    }
}
