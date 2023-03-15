package com.example.snwbackend;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.repository.UserRepository;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.annotation.Rollback;

import java.util.Optional;
import java.util.Random;

@SpringBootTest
public class InitDataTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Faker faker;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    @Rollback(value = false)
    void save_user() {
        Random rd = new Random();

        for (int i = 0; i < 5; i++) {
            User user = User.builder()
                    .name(faker.name().fullName())
                    .email(faker.internet().emailAddress())
                    .password(passwordEncoder.encode("111"))
                    .role(rd.nextInt(2) == 1 ? "ADMIN" : "USER")
                    .build();

            userRepository.save(user);
        }
    }
    @Test
    void find_user() {
        Optional<User> user = userRepository.findByEmail("hoang180698");
        System.out.println(user.toString());
    }

}
