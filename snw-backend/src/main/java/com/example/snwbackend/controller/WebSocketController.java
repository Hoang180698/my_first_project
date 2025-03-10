package com.example.snwbackend.controller;

import com.example.snwbackend.entity.Message;
import com.example.snwbackend.request.MessageRequest;
import com.example.snwbackend.request.NamedGroupChatRequest;
import com.example.snwbackend.request.UpsertConversationRequest;
import com.example.snwbackend.service.WebSocketService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.RestController;


import java.io.IOException;
import java.nio.ByteBuffer;

@Tag(name = "Websocket", description = "for real time chat")
@RestController
public class WebSocketController {

    @Autowired
    private WebSocketService webSocketService;

    @MessageMapping("/message/{conversationId}")
    public Message sendMessage(@DestinationVariable Integer conversationId, MessageRequest request, SimpMessageHeaderAccessor accessor){
        Message message = webSocketService.sendMessage(request, conversationId, accessor);
        return message;
    }

    @MessageMapping("/sendNewGroupChat/{groupChatId}")
    public void createGroupChat(@DestinationVariable Integer groupChatId) {
        webSocketService.sendNewGroupChat(groupChatId);
    }

    @MessageMapping("/message/named/{conversationId}")
    public void namedGroupChat(@DestinationVariable Integer conversationId, NamedGroupChatRequest request, SimpMessageHeaderAccessor accessor){
        webSocketService.namedGroupChat(request, conversationId, accessor);
    }
    @MessageMapping("/message/add-people/{conversationId}")
    public void addPeople(@DestinationVariable Integer conversationId, UpsertConversationRequest request, SimpMessageHeaderAccessor accessor) {
        webSocketService.addPeople(request, conversationId, accessor);
    }
    @MessageMapping("/message/leave/{conversationId}")
    public void leaveGroup(@DestinationVariable Integer conversationId, SimpMessageHeaderAccessor accessor) {
        webSocketService.leaveGroup(conversationId, accessor);
    }
    @MessageMapping("/message/send-image/{conversationId}")
    public void sendImage(@DestinationVariable Integer conversationId, MessageRequest file, SimpMessageHeaderAccessor accessor) throws IOException {
        webSocketService.sendImage(conversationId, file, accessor);
    }

    @MessageMapping("/message/send-voice/{conversationId}")
    public void sendVoice(@DestinationVariable Integer conversationId, MessageRequest file, SimpMessageHeaderAccessor accessor) throws IOException {
        webSocketService.sendVoice(conversationId, file, accessor);
    }

    // JoinCall
    @MessageMapping("/call/join/{conversationId}")
    public void joinCall(@DestinationVariable Integer conversationId, SimpMessageHeaderAccessor accessor) {
        webSocketService.joinCall(conversationId, accessor);
    }

    // LeaveCAll
    @MessageMapping("/call/leave/{conversationId}")
    public void leaveCall(@DestinationVariable Integer conversationId, SimpMessageHeaderAccessor accessor) {
        webSocketService.leaveCall(conversationId, accessor);
    }
}
