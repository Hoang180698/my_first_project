package com.example.snwbackend.controller;

import com.example.snwbackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ViewController {
    @Autowired
    private AuthService authService;

    @GetMapping("api/auth/activation/{userId}")
    public String test(@PathVariable Integer userId, @RequestParam String token, Model model) {
        return authService.activeUser(userId, token, model);
    }

    @GetMapping("api/auth/reset-password/{userId}")
    public String resetPassword(@PathVariable Integer userId, @RequestParam String token, Model model) {
        return authService.resetPassword(userId, token, model);
    }
}
