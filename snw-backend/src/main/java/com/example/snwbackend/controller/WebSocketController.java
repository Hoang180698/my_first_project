package com.example.snwbackend.controller;

import com.example.snwbackend.entity.Message;
import com.example.snwbackend.request.MessageRequest;
import com.example.snwbackend.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private WebSocketService webSocketService;

    @MessageMapping("/message/{contactId}")
    public Message sendMessage(@DestinationVariable Integer contactId, MessageRequest request){
        Message message = webSocketService.sendMessage(request, contactId);
        return message;
    }

    @MessageMapping("/sendNewGroupChat/{groupChatId}")
    public void createGroupChat(@DestinationVariable Integer groupChatId) {
        webSocketService.sendNewGroupChat(groupChatId);
    }
}
