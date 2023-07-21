package com.example.snwbackend;

import com.github.javafaker.Faker;
import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;


@SpringBootApplication

public class SnwBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SnwBackendApplication.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Bean
    public Faker faker() {
        return new Faker();
    }

}
