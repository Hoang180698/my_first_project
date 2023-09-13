package com.example.snwbackend.service;

import com.example.snwbackend.entity.Notification;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.NotificationRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.response.StatusResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public Page<Notification> getAllNotificationByUser(Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return notificationRepository.findAllByUser_IdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page,pageSize));
    }

    public void seenNotification() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        notificationRepository.updateSeenNotification(user.getId());
    }

    public StatusResponse deleteNotificationById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Notification notification = notificationRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found notification with id = " +id);
        });
        if (notification.getUser().getId() != user.getId()) {
            throw new BadRequestException("You do not have permission to delete this notification");
        }
        notificationRepository.deleteById(id);
        return new StatusResponse("ok");
    }

    public StatusResponse deleteAllNotificationByUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        notificationRepository.deleteAll(notificationRepository.findAllByUser(user));

        return new StatusResponse("ok");
    }
}
