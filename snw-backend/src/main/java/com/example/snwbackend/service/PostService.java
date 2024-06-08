package com.example.snwbackend.service;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.CreatePostRequest;
import com.example.snwbackend.response.StatusResponse;
import com.example.snwbackend.utils.ImageUtils;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Slf4j
public class PostService {

    @Autowired
    private SaveRepository saveRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private ImageUtils imageUtils;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ReplyCommentRepository replyCommentRepository;

    @Autowired
    private LikeReplyCommentRepository likeReplyCommentRepository;

    @Autowired
    private LikeCommentRepository likeCommentRepository;

    @Autowired
    private VideoService videoService;


    // Lấy post theo id
    public PostDto getPostById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return postRepository.getPostDtoById(id, user.getId()).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
    }

    // Xóa post
    @Transactional
    public StatusResponse deletePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if (user.getId() != post.getUser().getId()) {
            throw new BadRequestException("You do not have permission to delete this post");
        }
        for (String url: post.getImageUrls()) {
            if (url.contains("api/images")) {
                Integer imgId = Integer.parseInt(url.substring(url.lastIndexOf("/") + 1));
                imageRepository.deleteById(imgId);
            }
           if (url.contains("api/videos")) {
               String videoId = url.substring(url.lastIndexOf("/") + 1);
               videoService.deleteVideo(user.getId().toString(), videoId);
           }
        }
        likeCommentRepository.deleteAllByComment_Post(post);
        likeReplyCommentRepository.deleteAllByReplyComment_Comment_Post(post);
        likeRepository.deleteAllByPost(post);
        notificationRepository.deleteAllByPost(post);
        replyCommentRepository.deleteAllByComment_Post(post);
        commentRepository.deleteAllByPost(post);
        saveRepository.deleteAllByPost(post);

        postRepository.delete(post);

        return new StatusResponse("removed");
    }

    // Lấy danh sách post của 1 user
    public Page<PostDto> getPostByUserId(Integer userId, Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        User user1 = userRepository.findById(userId).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " +userId);
        });
        Page<Post> posts = postRepository.findAllByUser_IdOrderByCreatedAtDesc(userId, PageRequest.of(page, pageSize));
        Page<PostDto> postDtos = posts.map((post -> new PostDto(post,
                likeRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()), saveRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()))));
        return postDtos;
    }


    // Lấy danh sách post cho trang chủ
    public Page<PostDto> getAllPost(Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<Post> posts = postRepository.getPostFollowing(user.getId(), PageRequest.of(page, pageSize));
        Page<PostDto> postDtos = posts.map((post -> new PostDto(post,
                likeRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()), saveRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()))));
        return postDtos;
    }

    // Get saved posts
    public Page<PostDto> getAllSavedPost(Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Page<Post> posts = postRepository.getSavedPosts(user.getId(), PageRequest.of(page, pageSize));
        Page<PostDto> postDtos = posts.map((post -> new PostDto(post,
                likeRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()), true)));
        return postDtos;
    };

    // Tạo post với images
//    @Transactional
//    public Post createPostWithImages(MultipartFile[] files) {
//        if(files.length == 0 || files.length > 15) {
//            throw new BadRequestException("images cannot be empty or having size more than 15");
//        }
//
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByEmail(email).orElseThrow(() -> {
//            throw new NotFoundException("Not found user with email = " + email);
//        });
//        try {
//            List<String> urls = new ArrayList<>();
//            for (MultipartFile file: files) {
//                imageUtils.validateFile(file);
//                Image image = Image.builder()
//                        .data(file.getBytes())
//                        .type(file.getContentType())
//                        .user(user)
//                        .build();
//
//                imageRepository.save(image);
//
//                String url = "/api/images/read/" + image.getId();
//                urls.add(url);
//            }
//            Post post = Post.builder()
//                    .imageUrls(urls)
//                    .user(user)
//                    .content("")
//                    .build();
//            return postRepository.save(post);
//        } catch (Exception e) {
//            throw new RuntimeException("Upload post error");
//        }
//    }

    // Like post
    @Transactional
    public Post likePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        if(likeRepository.findByPostAndUser(post, user).isPresent()) {
            throw new BadRequestException("You have already liked this post");
        }
        Like like = Like.builder()
                .post(post)
                .user(user)
                .build();
        likeRepository.save(like);

        // Tao thong bao
        if (user.getId() != post.getUser().getId() && post.getUser().getPushNotificationsStatus().isOnLikes()) {
            Notification notification = Notification.builder()
                    .user(post.getUser())
                    .post(post)
                    .content("liked your post")
                    .sender(user)
                    .type("like")
                    .build();
            notificationRepository.save(notification);
        }
        return post;
    }

    // unlike post
    @Transactional
    public Post dislikePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Like like = likeRepository.findByPostAndUser(post, user).orElseThrow(() -> {
            throw new BadRequestException("You have not liked this post");
        });
        likeRepository.delete(like);
        // xoa thong bao
        notificationRepository.deleteByPostAndSenderAndType(post, user, "like");
        return post;
    }

    // Save post
    public StatusResponse savePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        if(saveRepository.findByUserAndPost(user, post).isPresent()) {
            throw new BadRequestException("You have already saved this post");
        }

        Save save = Save.builder().user(user).post(post).build();

        saveRepository.save(save);

        return new StatusResponse("ok") ;
    }

    // Un save post
    public StatusResponse unSavePost(Integer id) {
        Post post = postRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found post with id = " + id);
        });
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Save save = saveRepository.findByUserAndPost(user, post).orElseThrow(() -> {
            throw new BadRequestException("You have not saved this post");
        });
        saveRepository.delete(save);
        return new StatusResponse("ok") ;
    }

    // Tạo post
    @Transactional
    public Post createPostWithImagesOther(CreatePostRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        MultipartFile[] files = request.getFiles();

        if(files == null && !request.getContent().isEmpty()) {
            Post post = Post.builder()
                    .user(user)
                    .content(request.getContent())
                    .build();
            return postRepository.save(post);
        }
        if(files == null && request.getContent().isEmpty()) {
            throw new BadRequestException("images and content cannot be empty");
        }
        if(files.length > 15) {
            throw new BadRequestException("images having size more than 15");
        }

        try {
            List<String> urls = new ArrayList<>();
            if (files.length > 0) {
                for (MultipartFile file: files) {
                    if(file.getContentType().startsWith("video")) {
                        String url = videoService.uploadVideo(user, file);
                        urls.add(url);
                        log.info(url);
                        continue;
                    }
                    imageUtils.validateFile(file);
                    Image image = Image.builder()
                            .data(file.getBytes())
                            .type(file.getContentType())
                            .user(user)
                            .build();

                    imageRepository.save(image);

                    String url = "/api/images/read/" + image.getId();
                    urls.add(url);
                }
            }

            Post post = Post.builder()
                    .imageUrls(urls)
                    .user(user)
                    .content(request.getContent())
                    .build();
            return postRepository.save(post);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new RuntimeException("Upload post error");
        }
    }

    public List<PostDto> getPostsByIds(List<Integer> ids) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Set<Post> posts = postRepository.findByIdIn(ids);
        List<PostDto> postDtos = posts.stream()
                .map((post) -> new PostDto(post,
                likeRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId()), saveRepository.existsByPost_IdAndUser_Id(post.getId(), user.getId())))
                .toList().stream()
                .sorted(((o1, o2) -> o2.getPost().getCreatedAt().compareTo(o1.getPost().getCreatedAt())))
                .toList();
        return postDtos;
    }
}
