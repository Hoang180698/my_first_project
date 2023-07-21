package com.example.snwbackend.service;

import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.LoginRequest;
import com.example.snwbackend.request.RegisterRequest;
import com.example.snwbackend.response.LoginResponse;
import com.example.snwbackend.security.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Qualifier("userDetailsService")
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        log.info("Request : {}", request);
        // Tạo đối tượng
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );

        // Xác thực từ đối tượng
        Authentication authentication = authenticationManager.authenticate(token);
        log.info("authentication : {}", authentication);

        // Nếu không xảy ra exception tức là thông tin hợp lệ
        // Set thông tin authentication vào Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Tạo token và trả về cho client
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String tokenJwt = jwtTokenUtil.generateToken(userDetails);

        // Thông tin trả về cho Client
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    throw new UsernameNotFoundException("Not found user with email = " + request.getEmail());
                });

        LoginResponse loginResponse = new LoginResponse(userMapper.toUserDto(user), tokenJwt, true);
        return loginResponse;
    }

    public UserDto register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("This email is already used");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role("USER")
                .gender("")
                .phone("")
                .address("")
                .biography("")
                .build();
        userRepository.save(user);
        return userMapper.toUserDto(user);
    }

    public boolean checkEmailExist(String email) {
       return userRepository.findByEmail(email).isPresent();
    }
}
