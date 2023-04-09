package com.example.snwbackend;

import com.example.snwbackend.dto.PostDto;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

@SpringBootTest
public class PostTest {
    @Autowired
    private PostRepository postRepository;

    @Test
    void find_post() {
        List<PostDto> postDtos = postRepository.getPostDtoByUser(102);
        System.out.println(postDtos);
    }
}
