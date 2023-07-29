package com.example.snwbackend.controller;


import com.example.snwbackend.request.ContactRequest;
import com.example.snwbackend.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("")
    public ResponseEntity<?> createConversation(@RequestBody ContactRequest request) {
        return new ResponseEntity<>(chatService.createSingleConversation(request), HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllConversation() {
        return ResponseEntity.ok(chatService.getAllConversation());
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getConversationById(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.getConversationById(id));
    }

    @GetMapping("message/{conversationId}")
    public ResponseEntity<?> getAllMessageByConversationId(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.getAllMessageByConversationId(conversationId));
    }

    @PutMapping("read/{conversationId}")
    public ResponseEntity<?> resetUnreadCountByConversationId(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.resetUnreadCountByConversationId(conversationId));
    }

    @GetMapping("unread-count")
    public ResponseEntity<?> getAllUnreadCount() {
        return ResponseEntity.ok((chatService.getAllUnreadCount()));
    }
}
