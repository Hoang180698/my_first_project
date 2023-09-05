package com.example.snwbackend.controller;


import com.example.snwbackend.request.ContactRequest;
import com.example.snwbackend.request.UpsertConversationRequest;
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

    @PostMapping("group-chat")
    public ResponseEntity<?> createGroupChat(@RequestBody UpsertConversationRequest request) {
        return new ResponseEntity<>(chatService.createGroupChat(request), HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllConversation( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                 @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllConversation(page, pageSize));
    }

    @GetMapping("archive")
    public ResponseEntity<?> getAllArchiveConversation( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                        @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllArchiveConversation(page, pageSize));
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getConversationById(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.getConversationById(id));
    }

    @GetMapping("message/{conversationId}")
    public ResponseEntity<?> getAllMessageByConversationId(@PathVariable Integer conversationId,
                                                           @RequestParam(required = false, defaultValue = "0") Integer page,
                                                           @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllMessageByConversationId(conversationId, page, pageSize));
    }

    @PutMapping("read/{conversationId}")
    public ResponseEntity<?> resetUnreadCountByConversationId(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.resetUnreadCountByConversationId(conversationId));
    }

    @GetMapping("unread-count")
    public ResponseEntity<?> getAllUnreadCount() {
        return ResponseEntity.ok((chatService.getAllUnreadCount()));
    }

    @PutMapping("archive-chat/{conversationId}")
    public ResponseEntity<?> toggleSetArchiveChat(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.toggleSetArchiveChat(conversationId));
    }
}
