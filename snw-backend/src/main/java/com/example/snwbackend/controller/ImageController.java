package com.example.snwbackend.controller;

import com.example.snwbackend.entity.ChatImage;
import com.example.snwbackend.entity.Image;
import com.example.snwbackend.service.ImageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Image", description = "Image management APIs")
@RestController
@RequestMapping("api/images")
@SecurityRequirement(name = "bearerAuth")
public class ImageController {

    @Autowired
    private ImageService imageService;

    // Lấy danh sách ảnh của user
    @GetMapping("")
    public ResponseEntity<?> getAllImage() {
        return ResponseEntity.ok(imageService.getAllImage());
    }

    // Xem ảnh
    @Operation(summary = "Link images")
    @GetMapping("read/{id}")
    public ResponseEntity<?> readImage(@PathVariable Integer id) {
        Image image = imageService.getImage(id);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getType())).body(image.getData());
    }

//    // Upload ảnh
//    @PostMapping("")
//    public ResponseEntity<?> uploadImage(@ModelAttribute("file") MultipartFile file) {
//        return new ResponseEntity<>(imageService.uploadImage(file), HttpStatus.CREATED);
//    }
//
//    // Xóa ảnh
//    @DeleteMapping("{id}")
//    public ResponseEntity<?> deleteImage(@PathVariable Integer id) {
//        imageService.deleteImage(id);
//        return ResponseEntity.noContent().build(); // 204
//    }
//
//    // upload multi images
//    @PostMapping("multi-upload")
//    public ResponseEntity<?> uploadMultiImages(@ModelAttribute("files") MultipartFile[] files) {
//        return new ResponseEntity<>(imageService.uploadMultiImages(files), HttpStatus.CREATED);
//    }

    //xem ảnh tin nhắn
    @GetMapping("chat/{id}")
    public ResponseEntity<?> readChatImage(@PathVariable Integer id) {
        ChatImage image = imageService.getChatImage(id);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(image.getType())).body(image.getData());
    }
}
