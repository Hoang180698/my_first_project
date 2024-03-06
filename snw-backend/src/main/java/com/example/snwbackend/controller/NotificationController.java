package com.example.snwbackend.controller;

import com.example.snwbackend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Notifications", description = "Notifications management APIs")
@RestController
@RequestMapping("api/notification")
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Operation(summary = "Get notifications")
    @GetMapping("")
    public ResponseEntity<?> getAllNotificationByUser( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                       @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(notificationService.getAllNotificationByUser(page, pageSize));
    }

    @Operation(summary = "Seen notifications",
            description = "Set value seen of all user's notification to true.")
    @PutMapping("")
    public ResponseEntity<?> seenNotification() {
        notificationService.seenNotification();
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Delete notification by id",
            description = "Delete a specific notification. Only user's notifications")
    @DeleteMapping("{id}")
    public ResponseEntity<?> deleteNotificationById(@PathVariable Integer id) {
        return ResponseEntity.ok(notificationService.deleteNotificationById(id));
    }

    @Operation(summary = "Delete all notifications",
            description = "Delete all user's notification.")
    @DeleteMapping("")
    public ResponseEntity<?> deleteAllNotificationByUser() {
        return ResponseEntity.ok(notificationService.deleteAllNotificationByUser());
    }
}
