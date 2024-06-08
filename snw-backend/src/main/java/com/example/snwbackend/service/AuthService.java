package com.example.snwbackend.service;

import com.example.snwbackend.config.MailConfig;
import com.example.snwbackend.dto.UserDto;
import com.example.snwbackend.entity.PasswordResetToken;
import com.example.snwbackend.entity.RefreshToken;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.entity.VerificationToken;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.mapper.UserMapper;
import com.example.snwbackend.repository.PasswordResetTokenRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.EmailRequest;
import com.example.snwbackend.request.LoginRequest;
import com.example.snwbackend.request.RegisterRequest;
import com.example.snwbackend.request.TokenRefreshRequest;
import com.example.snwbackend.response.LoginResponse;
import com.example.snwbackend.response.StatusResponse;
import com.example.snwbackend.response.TokenRefreshResponse;
import com.example.snwbackend.security.JwtTokenUtil;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import net.bytebuddy.utility.RandomString;
import org.aspectj.apache.bcel.classfile.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.Model;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class AuthService {
    @Autowired
    private JavaMailSender javaMailSender;

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

    @Autowired
    private VerificationTokenService verificationTokenService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private TemplateEngine templateEngine;

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
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);
        LoginResponse loginResponse = new LoginResponse(userMapper.toUserDto(user), tokenJwt, refreshToken.getToken(), true);
        return loginResponse;
    }

    public TokenRefreshResponse refreshToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new NotFoundException("Not found refresh token"));
        if(refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenService.delete(refreshToken);
            throw new BadRequestException("Refresh token was expired. Please make a new log in request");
        }
        UserDetails userDetails = userDetailsService.loadUserByUsername(refreshToken.getUser().getEmail());
        String tokenJwt = jwtTokenUtil.generateToken(userDetails);
        return new TokenRefreshResponse(tokenJwt, requestRefreshToken);
    }

    public String logOut(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        RefreshToken refreshToken = refreshTokenService.findByToken(requestRefreshToken)
                .orElseThrow(() -> new NotFoundException("Not found refresh token"));
        refreshTokenService.delete(refreshToken);
        return "ok";
    }

    @Transactional
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
                .enabled(false)
                .build();
        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        verificationTokenService.save(user, token);
        // send mail

        sendEmailActivation(user, token);
        return userMapper.toUserDto(user);
    }

    public boolean checkEmailExist(EmailRequest request) {
       return userRepository.findByEmail(request.getEmail()).isPresent();
    }

    @Transactional
    public String activeUser(Integer userId, String token, Model model) {
        VerificationToken verificationToken = verificationTokenService.findByUser_idAndToken(userId, token);
        if(verificationToken == null) {
            model.addAttribute("messages","Your verification token is invalid!" +userId + "  " +token);
            return "verification-web";
        }
        User user = verificationToken.getUser();
        if (user.isEnabled()) {
            model.addAttribute("messages","Your account is already activated!");
        } else {
            if(verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
                model.addAttribute("messages","Your verification token has expired!");
            } else {
                user.setEnabled(true);
                userRepository.save(user);
                model.addAttribute("messages","Your account successfully activated!");
            }
        }
        return "verification-web";
    }

    @Transactional
    public String resetPassword(Integer userId, String token, Model model) {
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByUser_IdAndToken(userId, token);
        if(passwordResetToken == null) {
            model.addAttribute("messages","Your verification token is invalid!");
            return "reset-password";
        }
        if(passwordResetToken.isUsed()) {
            model.addAttribute("messages","Your verification token has used!");
            return "reset-password";
        }
        User user = passwordResetToken.getUser();
        String newPassword = RandomString.make(6);
        user.setPassword(passwordEncoder.encode(newPassword));
        passwordResetToken.setUsed(true);
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(new InternetAddress("Hoagram <nhoang1806@gmail.com>"));
            helper.setTo(user.getEmail());
            helper.setSubject("New Password");
            Context context = new Context();
            context.setVariable("password", newPassword);
            String htmlTag = MailConfig.getTemplateEngine().process("mail-newpassword.html", context);
            helper.setText(htmlTag, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
        model.addAttribute("messages","Successfully! New password sent to your email!");
        return "reset-password";
    }

    @Transactional
    public StatusResponse resendEmail(EmailRequest request) {
        String email = request.getEmail();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " +email);
        });
        if(user.isEnabled()) {
            throw new BadRequestException("Your account is already activated!");
        }
        VerificationToken verificationToken = verificationTokenService.findByUser(user);
        if(verificationToken == null) {
            String token = UUID.randomUUID().toString();
            verificationTokenService.save(user, token);
            sendEmailActivation(user, token);
            return new StatusResponse("ok");
        }
        if(verificationToken.getExpiryDate().isBefore(LocalDateTime.now().plusMinutes(10))) {
            String token = UUID.randomUUID().toString();
            verificationToken.setToken(token);
            verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(60*24));
            verificationToken.setSendEmailCount(1);
        } else {
            if(verificationToken.getSendEmailCount() > 4) {
                throw new BadRequestException("rate limited");
            };
            verificationToken.setSendEmailCount(verificationToken.getSendEmailCount() + 1);
            sendEmailActivation(user, verificationToken.getToken());
        }
        return new StatusResponse("ok");
    }

    @Transactional
    public StatusResponse fogotPasword(EmailRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " +request.getEmail());
        });
        PasswordResetToken passwordResetToken = passwordResetTokenRepository.findByUser(user);
        if(passwordResetToken == null) {
            String token = UUID.randomUUID().toString();
            PasswordResetToken passwordResetToken1 = PasswordResetToken.builder()
                    .expiryDate(LocalDateTime.now().plusMinutes(60*24))
                    .user(user)
                    .token(token)
                    .sendEmailCount(1)
                    .used(false)
                    .build();
            passwordResetTokenRepository.save(passwordResetToken1);
            sendMailForgotPassword(user, token);
            return new StatusResponse("ok");
        }
        if(passwordResetToken.getExpiryDate().isBefore(LocalDateTime.now().plusMinutes(10))) {
            String token = UUID.randomUUID().toString();
            passwordResetToken.setToken(token);
            passwordResetToken.setExpiryDate(LocalDateTime.now().plusMinutes(60*24));
            passwordResetToken.setUsed(false);
            passwordResetToken.setSendEmailCount(1);

            sendMailForgotPassword(user, token);
        } else {
            if(passwordResetToken.getSendEmailCount() > 4 || passwordResetToken.isUsed()) {
                throw new BadRequestException("rate limited");
            }
            passwordResetToken.setSendEmailCount(passwordResetToken.getSendEmailCount() + 1);
            sendMailForgotPassword(user, passwordResetToken.getToken());
        }

        return new StatusResponse("ok");
    }

    private void sendEmailActivation(User user, String token) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(new InternetAddress("Hoagram <nhoang1806@gmail.com>"));
            helper.setTo(user.getEmail());
            helper.setSubject("Verify your email address");
            Context context = new Context();
            context.setVariable("link", "http://13.250.106.44:8080/api/auth/activation/" + user.getId() + "?token=" +token);
            final String htmlContent = MailConfig.getTemplateEngine().process("mail-active.html", context);
            helper.setText(htmlContent, true);
            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    };

    private void sendMailForgotPassword(User user, String token) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(new InternetAddress("Hoagram <nhoang1806@gmail.com>"));
            helper.setTo(user.getEmail());
            helper.setSubject("Reset Password");
            Context context = new Context();
            context.setVariable("link", "http://13.250.106.44:8080/api/auth/reset-password/" + user.getId() + "?token=" +token);
            final String htmlContent = MailConfig.getTemplateEngine().process("mail-password.html", context);
            helper.setText(htmlContent, true);
//            message.setContent(htmlContent, "text/html");
            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
