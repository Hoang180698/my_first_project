package com.example.snwbackend.controller;

import com.example.snwbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("")
    public ResponseEntity<?> getAllNotificationByUser() {
        return ResponseEntity.ok(notificationService.getAllNotificationByUser());
    }

    @PutMapping("")
    public ResponseEntity<?> seenNotification() {
        notificationService.seenNotification();
        return ResponseEntity.noContent().build();
    }
}
