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
    public ResponseEntity<?> createContact(@RequestBody ContactRequest request) {
        return new ResponseEntity<>(chatService.createContact(request), HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllContact() {
        return ResponseEntity.ok(chatService.getAllContact());
    }

    @GetMapping("{id}")
    public ResponseEntity<?> getContactById(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.getContactById(id));
    }

    @GetMapping("message/{contactId}")
    private ResponseEntity<?> getAllMessageByContactId(@PathVariable Integer contactId) {
        return ResponseEntity.ok(chatService.getAllMessageByContactId(contactId));
    }
}
