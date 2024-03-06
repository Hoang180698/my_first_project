package com.example.snwbackend.controller;

import com.example.snwbackend.service.PushNotificationsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Push notifications", description = "Push notifications management APIs")
@RestController
@RequestMapping("api/notifications-status")
@SecurityRequirement(name = "bearerAuth")
public class PushNotificationController {

    @Autowired
    private PushNotificationsService pushNotificationsService;

    @Operation(summary = "Get all push notifications status")
    @GetMapping("")
    public ResponseEntity<?> getNotificationsStatus() {
        return ResponseEntity.ok(pushNotificationsService.getNotificationsStatus());
    }

    @Operation(summary = "Change likes notification status",
            description = "Toggle set likes notification status of the user")
    @PutMapping("/likes")
    public ResponseEntity<?> updateLikesStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateLikesStatus());
    }

    @Operation(summary = "Change comments notification status",
            description = "Toggle set comments notification status of the user")
    @PutMapping("/comments")
    public ResponseEntity<?> updateCommentsStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateCommentsStatus());
    }

    @Operation(summary = "Change new-follower notification status",
            description = "Toggle set new-follower notification status of the user")
    @PutMapping("/new-follower")
    public ResponseEntity<?> updateNewFollowerStatus() {
        return ResponseEntity.ok(pushNotificationsService.updateNewFollowerStatus());
    }

}
