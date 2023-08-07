package com.example.snwbackend.service;

import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.CreateConversationRequest;
import com.example.snwbackend.request.MessageRequest;
import com.example.snwbackend.response.StatusResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class WebSocketService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserConversationRepository userConversationRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Transactional
    public Message sendMessage(MessageRequest request, Integer conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });

        User user = userRepository.findById(request.getSenderId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " +request.getSenderId());
        });

        if(!conversation.getUsers().contains(user)) {
            throw new BadRequestException("Can not send message with userId = " +request.getSenderId());
        }

        Message message = Message.builder()
                .content(request.getContent())
                .sender(user).type("MESSAGE")
                .conversation(conversation)
                .build();
        messageRepository.save(message);

        simpMessagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);

        for (User u: conversation.getUsers()) {
            UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
            if (u.getId() == user.getId()) {
                simpMessagingTemplate.convertAndSend("/topic/user/" + u.getId(), userConversation);
                continue;
            }
            userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
            simpMessagingTemplate.convertAndSend("/topic/user/" + u.getId(), userConversationRepository.save(userConversation));
        }

        return message;
    }

    @Transactional
    public void sendNewGroupChat(Integer groupChatId) {
        Conversation conversation = conversationRepository.findById(groupChatId).get();
        if(conversation == null) {
            return;
        }
        for (User u: conversation.getUsers()) {
            UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
            simpMessagingTemplate.convertAndSend("/topic/user/" + u.getId(), userConversation);
        }
    }
}
