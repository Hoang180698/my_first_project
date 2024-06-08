package com.example.snwbackend.controller;


import com.example.snwbackend.entity.Conversation;
import com.example.snwbackend.request.ContactRequest;
import com.example.snwbackend.request.UpsertConversationRequest;
import com.example.snwbackend.service.ChatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Chat", description = "Chat management APIs")
@RestController
@RequestMapping("api/chat")
@SecurityRequirement(name = "bearerAuth")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @ApiResponse(responseCode = "200", content = {@Content(schema = @Schema(implementation = Conversation.class))})
    @ApiResponse(responseCode = "404", description = "The user with given Id was not found.", content = @Content(schema = @Schema()))
    @Operation(summary = "Create single chat",
            description = "Create a new single conversation with other user.")
    @PostMapping("")
    public ResponseEntity<?> createConversation(@RequestBody ContactRequest request) {
        return new ResponseEntity<>(chatService.createSingleConversation(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Create group chat")
    @PostMapping("group-chat")
    public ResponseEntity<?> createGroupChat(@RequestBody UpsertConversationRequest request) {
        return new ResponseEntity<>(chatService.createGroupChat(request), HttpStatus.CREATED);
    }

    @Operation(summary = "Get conversations",
            description = "Get conversations of user order by the sending time of the last message.")
    @GetMapping("")
    public ResponseEntity<?> getAllConversation( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                 @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllConversation(page, pageSize));
    }

    @Operation(summary = "Get archive conversations",
            description = "Get archive conversations of user order by the sending time of the last message.")
    @GetMapping("archive")
    public ResponseEntity<?> getAllArchiveConversation( @RequestParam(required = false, defaultValue = "0") Integer page,
                                                        @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllArchiveConversation(page, pageSize));
    }

    @Operation(summary = "Get conversation by id",
            description = "Retrieve detailed information about a specific conversation. Only user's conversation.")
    @GetMapping("{id}")
    public ResponseEntity<?> getConversationById(@PathVariable Integer id) {
        return ResponseEntity.ok(chatService.getConversationById(id));
    }

    @Operation(summary = "Get messages by conversationId",
            description = "Get messages of a specific conversation. Only user's conversation.")
    @GetMapping("message/{conversationId}")
    public ResponseEntity<?> getAllMessageByConversationId(@PathVariable Integer conversationId,
                                                           @RequestParam(required = false, defaultValue = "0") Integer page,
                                                           @RequestParam(required = false, defaultValue = "10") Integer pageSize) {
        return ResponseEntity.ok(chatService.getAllMessageByConversationId(conversationId, page, pageSize));
    }

    @Operation(summary = "Read message of a specific conversation",
            description = "Set unread count of a specific conversation to 0")
    @PutMapping("read/{conversationId}")
    public ResponseEntity<?> resetUnreadCountByConversationId(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.resetUnreadCountByConversationId(conversationId));
    }

    @Operation(summary = "Get unread message count",
            description = "Get all unread message count of the user. Only conversation not in archive.")
    @GetMapping("unread-count")
    public ResponseEntity<?> getAllUnreadCount() {
        return ResponseEntity.ok((chatService.getAllUnreadCount()));
    }

    @Operation(summary = "Archive chat",
            description = "Toggle archive a specific conversation.")
    @PutMapping("archive-chat/{conversationId}")
    public ResponseEntity<?> toggleSetArchiveChat(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.toggleSetArchiveChat(conversationId));
    }

    @Operation(summary = "set sound notice chat",
            description = "Toggle set sound notice a specific conversation.")
    @PutMapping("notice-sound/{conversationId}")
    public ResponseEntity<?> toggleSetNoticeSoundMessage(@PathVariable Integer conversationId) {
        return ResponseEntity.ok(chatService.toggleSetNoticeSoundMessage(conversationId));
    }
}
