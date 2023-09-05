package com.example.snwbackend.service;

import com.example.snwbackend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.snwbackend.entity.Notification;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class RecordCleanupService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void deleteRecordsOlderThanOneHour() {
        // Đặt điều kiện để xóa các bản ghi cũ hơn 1 giờ
        LocalDateTime oneMonthAgo = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);
        notificationRepository.deleteAllByCreatedAtBefore(oneMonthAgo);
    }
}
