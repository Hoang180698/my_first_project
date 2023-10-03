package com.example.snwbackend.service;

import com.example.snwbackend.entity.PushNotificationsStatus;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PushNotificationsService {

    @Autowired
    private UserRepository userRepository;

    public PushNotificationsStatus getNotificationsStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return user.getPushNotificationsStatus();
    }

    @Transactional
    public PushNotificationsStatus updateLikesStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        PushNotificationsStatus status = user.getPushNotificationsStatus();
        status.setOnLikes(!status.isOnLikes());
        return status;
    }

    @Transactional
    public PushNotificationsStatus updateNewFollowerStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        PushNotificationsStatus status = user.getPushNotificationsStatus();
        status.setOnNewFollower(!status.isOnNewFollower());
        return status;
    }

    @Transactional
    public PushNotificationsStatus updateCommentsStatus() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        PushNotificationsStatus status = user.getPushNotificationsStatus();
        status.setOnComments(!status.isOnComments());
        return status;
    }
}
