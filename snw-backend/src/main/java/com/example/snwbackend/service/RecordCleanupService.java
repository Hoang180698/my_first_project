package com.example.snwbackend.service;

import com.example.snwbackend.repository.NotificationRepository;
import com.example.snwbackend.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.snwbackend.entity.Notification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class RecordCleanupService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Scheduled(cron = "0 0 0 * * MON")
    @Transactional
    public void deleteRecordsOlderThanOneHour() {
        // Đặt điều kiện để xóa các bản ghi cũ hơn 1 giờ
        LocalDateTime oneMonthAgo = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        notificationRepository.deleteAllByCreatedAtBefore(oneMonthAgo);
        LocalDate date = LocalDate.now();
    }

    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void deleteRefreshToken() {
       refreshTokenRepository.deleteAllByExpiryDateBefore(LocalDateTime.now());
    }
}
