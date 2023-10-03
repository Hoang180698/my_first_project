package com.example.snwbackend.controller;

import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.service.PushNotificationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/notifications-status")
public class PushNotificationController {

    @Autowired
    private PushNotificationsService pushNotificationsService;

    @GetMapping("")
    public ResponseEntity<?> getNotificationsStatus() {
        return ResponseEntity.ok(pushNotificationsService.getNotificationsStatus());
    }

    @PutMapping("/likes")
    public ResponseEntity<?> updateLikesStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateLikesStatus());
    }
    @PutMapping("/comments")
    public ResponseEntity<?> updateCommentsStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateCommentsStatus());
    }
    @PutMapping("/new-follower")
    public ResponseEntity<?> updateNewFollowerStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateNewFollowerStatus());
    }

}
