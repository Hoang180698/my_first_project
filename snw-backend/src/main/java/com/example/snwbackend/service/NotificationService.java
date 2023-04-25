package com.example.snwbackend.service;

import com.example.snwbackend.entity.Notification;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.NotificationRepository;
import com.example.snwbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getAllNotificationByUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return notificationRepository.findAllByUser(user);
    }

    public void seenNotification() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        notificationRepository.updateSeenNotification(user.getId());
    }
}
