package com.example.snwbackend.service;

import com.example.snwbackend.dto.CommentDto;
import com.example.snwbackend.dto.ReplyCommentDto;
import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.CommentMapper;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.CommentRequest;
import com.example.snwbackend.response.StatusResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    @Autowired
    private ReplyCommentRepository replyCommentRepository;

    @Autowired
    private LikeCommentRepository likeCommentRepository;

    @Autowired
    private LikeReplyCommentRepository likeReplyCommentRepository;

    // Tạo comment
    @Transactional
    public CommentDto createComment(Integer postId, CommentRequest request) {
        if(request.getContent().isEmpty()) {
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
                .content(request.getContent())
                .user(user)
                .post(post)
                .build();
        commentRepository.save(comment);

        // tao thong bao
        if (user.getId() != post.getUser().getId() && post.getUser().getPushNotificationsStatus().isOnComments()) {
            Notification notification = Notification.builder()
                    .type("comment")
                    .content("commented")
                    .user(post.getUser())
                    .sender(user)
                    .post(post)
                    .comment(comment)
                    .build();
            notificationRepository.save(notification);
        }

        return new CommentDto(comment, false);
    }

    // edit comment
    public CommentDto editComment(Integer id, CommentRequest request) {
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
        comment.setContent(request.getContent());

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
        likeReplyCommentRepository.deleteAllByReplyComment_Comment(comment);
        likeCommentRepository.deleteAllByComment(comment);
        replyCommentRepository.deleteAllByComment(comment);
        notificationRepository.deleteAllByComment(comment);
        commentRepository.delete(comment);

        return new StatusResponse("ok");
    }

    // Lấy comments của 1 post
    public Page<CommentDto> getAllCommentByPostId(Integer postId, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Post post = postRepository.findById(postId).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + postId);
        });
        Page<Comment> comments = commentRepository.getAllOtherUserCmtByPostId(postId, user.getId(), PageRequest.of(page, pageSize));
        Page<CommentDto> commentDtoPage = comments.map((comment) -> new
                CommentDto(comment, likeCommentRepository.existsByCommentAndUser(comment, user)));
        return commentDtoPage;
    }

    // Lấy cmt người dùng của 1 post
    public List<CommentDto> getOwnCommentsByPost(Integer postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Post post = postRepository.findById(postId).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + postId);
        });
        return commentRepository.getAllOwnCmtDtoByPost(postId, user.getId());
    }

    // Lấy reply-comment
    public Page<ReplyCommentDto> getAllReplyCommentByCommentId(Integer commentId, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Comment comment = commentRepository.findById(commentId).orElseThrow(() ->{
            throw new NotFoundException("Not found comment with id = " + commentId);
        });
        Page<ReplyComment> replyCommentPage = replyCommentRepository.findAllByCommentOrderByCreatedAtAsc(comment, PageRequest.of(page, pageSize));
        Page<ReplyCommentDto> replyCommentDtoPage = replyCommentPage.map(
                (replyComment) -> new ReplyCommentDto(replyComment, likeReplyCommentRepository.existsByUserAndReplyComment(user, replyComment)
                ));
        return replyCommentDtoPage;
    }

    // get comment by id
    public CommentDto getCommentById(Integer commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Comment comment = commentRepository.findById(commentId).orElseThrow(() ->{
            throw new NotFoundException("Not found comment with id = " + commentId);
        });
        return  new CommentDto(comment, likeCommentRepository.existsByCommentAndUser(comment, user));
    }

    // get reply-comment by id
    public ReplyCommentDto getReplyCommentById(Integer replyId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        ReplyComment replyComment = replyCommentRepository.findById(replyId).orElseThrow(() -> {
            throw new NotFoundException("Not found reply-comment with id = " + replyId);
        });
        return new ReplyCommentDto(replyComment, likeReplyCommentRepository.existsByUserAndReplyComment(user, replyComment));
    }

    // reply comment
    @Transactional
    public ReplyCommentDto replyComment(Integer commentId, CommentRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Comment comment = commentRepository.findById(commentId).orElseThrow(() ->{
            throw new NotFoundException("Not fount Comment with id = " + commentId);
        });
        ReplyComment replyComment = ReplyComment.builder()
                .comment(comment)
                .content(request.getContent())
                .user(user)
                .build();
        replyCommentRepository.save(replyComment);
        //Tạo thông báo
        if(comment.getUser().getId() != user.getId() && comment.getUser().getPushNotificationsStatus().isOnComments()) {
            Notification notification = Notification.builder()
                    .type("reply-comment")
                    .content("replied your comment")
                    .user(comment.getUser())
                    .sender(user)
                    .post(comment.getPost())
                    .replyComment(replyComment)
                    .comment(comment)
                    .build();
            notificationRepository.save(notification);
        }

        return new ReplyCommentDto(replyComment, false);
    }

    // Like comment(like vs unlike)
    @Transactional
    public CommentDto likeComment(Integer commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Comment comment = commentRepository.findById(commentId).orElseThrow(() ->{
            throw new NotFoundException("Not fount Comment with id = " + commentId);
        });
        LikeComment likeComment = likeCommentRepository.findByUserAndComment(user, comment);
        if(likeComment == null) {
            LikeComment likeCmt = LikeComment.builder()
                    .user(user)
                    .comment(comment)
                    .build();
            likeCommentRepository.save(likeCmt);
            // Tạo thông báo;
            if(comment.getUser().getId() != user.getId() && comment.getUser().getPushNotificationsStatus().isOnLikes()) {
                Notification notification = Notification.builder()
                        .type("like-comment").content("liked your comment")
                        .user(comment.getUser()).post(comment.getPost())
                        .sender(user).comment(comment)
                        .build();
                notificationRepository.save(notification);
            }
            return new CommentDto(comment, true);
        } else {
            likeCommentRepository.delete(likeComment);
            // Xóa thông báo
            notificationRepository.deleteBySenderAndCommentAndType(user, comment, "like-comment");
            return new CommentDto(comment, false);
        }
    }

    // like reply cpmment
    @Transactional
    public ReplyCommentDto likeReplyComment(Integer replyCommentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        ReplyComment replyComment = replyCommentRepository.findById(replyCommentId).orElseThrow(() -> {
            throw new NotFoundException("Not found reply comment with id =" + replyCommentId);
        });
        LikeReplyComment likeReplyComment = likeReplyCommentRepository.findByUserAndReplyComment(user, replyComment);
        if(likeReplyComment == null) {
            LikeReplyComment likeReplyComment1 = LikeReplyComment.builder()
                    .user(user)
                    .replyComment(replyComment)
                    .build();
            likeReplyCommentRepository.save(likeReplyComment1);
            // Tạo thông báo
            if(replyComment.getUser().getId() != user.getId() && replyComment.getUser().getPushNotificationsStatus().isOnLikes()) {
                Notification notification = Notification.builder()
                        .type("like-reply-comment").content("liked your comment")
                        .user(replyComment.getUser()).post(replyComment.getComment().getPost())
                        .sender(user).comment(replyComment.getComment())
                        .replyComment(replyComment)
                        .build();
                notificationRepository.save(notification);
            }
            return new ReplyCommentDto(replyComment, true);
        } else {
            likeReplyCommentRepository.delete(likeReplyComment);
            // Xóa thông báo
            notificationRepository.deleteBySenderAndReplyCommentAndType(user, replyComment, "like-reply-comment");
            return new ReplyCommentDto(replyComment, false);
        }
    }

    @Transactional
    public StatusResponse deleteReplyComment(Integer replyCommentId) {
        ReplyComment replyComment = replyCommentRepository.findById(replyCommentId).orElseThrow(() -> {
            throw new NotFoundException("Not found reply comment with id = " + replyCommentId);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        if(replyComment.getUser().getId() != user.getId()){
            throw new BadRequestException("You do not have permission to edit this comment");
        }
        notificationRepository.deleteAllByReplyComment(replyComment);
        likeReplyCommentRepository.deleteAllByReplyComment(replyComment);
        replyCommentRepository.delete(replyComment);
        return new StatusResponse("ok");
    }

}
