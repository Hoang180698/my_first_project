package com.example.snwbackend.service;

import com.example.snwbackend.entity.User;
import com.example.snwbackend.entity.VerificationToken;
import com.example.snwbackend.repository.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Calendar;

@Service
public class VerificationTokenService {
    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    public VerificationToken findByToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public VerificationToken findByUser(User user) {
        return verificationTokenRepository.findByUser(user);
    }

    @Transactional
    public void save(User user, String token) {
        VerificationToken verificationToken = VerificationToken.builder()
                .user(user).token(token).expiryDate(LocalDateTime.now().plusMinutes(60*24)).sendEmailCount(1)
                .build();
        verificationTokenRepository.save(verificationToken);
    }

    public Timestamp calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Timestamp(cal.getTime().getTime());
    }

    public void save(VerificationToken verificationToken) {
        verificationTokenRepository.save(verificationToken);
    }

    public VerificationToken findByUser_idAndToken(Integer userId, String token) {
        return verificationTokenRepository.findByUser_IdAndToken(userId, token);
    }
}
