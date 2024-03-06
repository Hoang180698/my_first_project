package com.example.snwbackend.controller;

import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.request.EmailRequest;
import com.example.snwbackend.request.LoginRequest;
import com.example.snwbackend.request.RegisterRequest;
import com.example.snwbackend.request.TokenRefreshRequest;
import com.example.snwbackend.response.LoginResponse;
import com.example.snwbackend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "Auth management APIs (Login, register,...)")
@RestController
@RequestMapping("api/auth")
public class AuthController {

    @Autowired
    AuthService authService;

    @ApiResponses({
            @ApiResponse(responseCode = "200", content = @Content(schema = @Schema(implementation = LoginResponse.class))),
    })
    @Operation(summary = "Login to app")
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
         return ResponseEntity.ok(authService.login(request));
    }

    @Operation(summary = "Refresh token", description = "Get a new token")
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @Operation(summary = "Log out", description = "Remove refresh token of user from database")
    @PostMapping("log-out")
    public ResponseEntity<?> logOut(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.logOut(request));
    }

    @Operation(summary = "Register", description = "Create a new account and send verification link to email")
    @PostMapping("register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException(bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(authService.register(request));
    }

    @Operation(summary = "Check email exists or not")
    @PostMapping("check-email")
    public ResponseEntity<?> checkEmailExist(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.checkEmailExist(request));
    }

//    @GetMapping("activation/{userId}")
//    public ResponseEntity<?> activeUser(@PathVariable Integer userId, @RequestParam String token) {
//        return ResponseEntity.ok(authService.activeUser(userId, token));
//    }

    @Operation(summary = "Resend verification link to email")
    @PutMapping("resend-email")
    public ResponseEntity<?> resendEmail(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.resendEmail(request));
    };

    @Operation(summary = "Forgot password", description = "Send password change link to email")
    @PostMapping("forgot-password")
    public ResponseEntity<?> fogotPasword(@RequestBody EmailRequest request) {
        return ResponseEntity.ok(authService.fogotPasword(request));
    }

//    @GetMapping("reset-password/{userId}")
//    public ResponseEntity<?> resetPassword(@PathVariable Integer userId, @RequestParam String token) {
//        return ResponseEntity.ok(authService.resetPassword(userId, token));
//    }
}
