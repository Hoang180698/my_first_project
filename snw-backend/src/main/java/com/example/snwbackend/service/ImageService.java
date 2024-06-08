package com.example.snwbackend.service;

import com.example.snwbackend.entity.ChatImage;
import com.example.snwbackend.entity.Image;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.ChatImageRepository;
import com.example.snwbackend.repository.ImageRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.response.ImageResponse;
import com.example.snwbackend.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChatImageRepository chatImageRepository;

    @Autowired
    private ImageUtils imageUtils;

    public List<String> getAllImage() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        List<Image> images = imageRepository.findByUser_IdOrderByCreatedAtDesc(user.getId());

        return images.stream()
                .map(image -> "/api/images/read/" + image.getId())
                .toList();
    }

    public Image getImage(Integer id) {
        return imageRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found image with id = " + id);
        });
    }

//    public ImageResponse uploadImage(MultipartFile file) {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByEmail(email).orElseThrow(() -> {
//            throw new NotFoundException("Not found user with email = " + email);
//        });
//
//        imageUtils.validateFile(file);
//
//        try {
//            Image image = Image.builder()
//                    .data(file.getBytes())
//                    .type(file.getContentType())
//                    .user(user)
//                    .build();
//
//            imageRepository.save(image);
//
//            String url = "/api/images/read/" + image.getId();
//            return new ImageResponse(url);
//        } catch (Exception e) {
//            throw new RuntimeException("Upload image error");
//        }
//    }

//    public void deleteImage(Integer id) {
//        Image image = imageRepository.findById(id).orElseThrow(() -> {
//            throw new NotFoundException("Not found image with id = " + id);
//        });
//
//        imageRepository.delete(image);
//    }

//    @Transactional
//    public List<ImageResponse> uploadMultiImages(MultipartFile[] files) {
//        String email = SecurityContextHolder.getContext().getAuthentication().getName();
//        User user = userRepository.findByEmail(email).orElseThrow(() -> {
//            throw new NotFoundException("Not found user with email = " + email);
//        });
//        List<ImageResponse> imageResponses = new ArrayList<>();
////        for (MultipartFile file: files) {
////            try {
////                imageUtils.validateFile(file);
////                Image image = Image.builder()
////                        .data(file.getBytes())
////                        .type(file.getContentType())
////                        .user(user)
////                        .build();
////
////                imageRepository.save(image);
////
////                String url = "/api/images/read/" + image.getId();
////                imageResponses.add(new ImageResponse(url)) ;
////            } catch (Exception e) {
////                throw new RuntimeException("Upload image error");
////            }
////        }
//        try {
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
//                imageResponses.add(new ImageResponse(url)) ;
//            }
//        } catch (Exception e) {
//            throw new RuntimeException("Upload image error");
//        }
//        return imageResponses;
//    }

    public ChatImage getChatImage(Integer id) {
        return chatImageRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found image with id = " + id);
        });
    }
}
