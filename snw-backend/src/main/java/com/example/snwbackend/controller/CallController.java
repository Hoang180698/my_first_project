package com.example.snwbackend.controller;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.service.CallService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/call")

public class CallController {
    @Autowired
    private CallService callService;

    @GetMapping("token/{conversationId}")
    public ResponseEntity<?> getTokenForCall(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(callService.getTokenForCall(conversationId));
    }
}
