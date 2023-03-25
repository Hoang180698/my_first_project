package com.example.snwbackend.controller;

import com.example.snwbackend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/post/")
public class PostController {

    @Autowired
    private PostService postService;

    // Tạo Post


}
