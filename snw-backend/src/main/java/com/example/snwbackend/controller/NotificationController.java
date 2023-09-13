package com.example.snwbackend.controller;

import com.example.snwbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("")
    public ResponseEntity<?> getAllNotificationByUser( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                       @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(notificationService.getAllNotificationByUser(page, pageSize));
    }

    @PutMapping("")
    public ResponseEntity<?> seenNotification() {
        notificationService.seenNotification();
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteNotificationById(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.deleteNotificationById(id));
    }

    @DeleteMapping("")
    public ResponseEntity<?> deleteAllNotificationByUser() {
        return ResponseEntity.ok(notificationService.deleteAllNotificationByUser());
    }
}
