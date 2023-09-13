package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.EmailRequest;
import com.example.snwbackend.request.LoginRequest;
import com.example.snwbackend.request.RegisterRequest;
import com.example.snwbackend.request.TokenRefreshRequest;
import com.example.snwbackend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
         return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("log-out")
    public ResponseEntity<?> logOut(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.logOut(request));
    }

    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("check-email")
    public ResponseEntity<?> checkEmailExist(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.checkEmailExist(request));
    }

    @GetMapping("activation/{userId}")
    public ResponseEntity<?> activeUser(@PathVariable Integer userId, @RequestParam String token) {
        return ResponseEntity.ok(authService.activeUser(userId, token));
    }

    @PutMapping("resend-email")
    public ResponseEntity<?> resendEmail(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.resendEmail(request));
    };

    @PostMapping("forgot-password")
    public ResponseEntity<?> fogotPasword(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.fogotPasword(request));
    }

    @GetMapping("reset-password/{userId}")
    public ResponseEntity<?> resetPassword(@PathVariable Integer userId, @RequestParam String token) {
        return ResponseEntity.ok(authService.resetPassword(userId, token));
    }
}
