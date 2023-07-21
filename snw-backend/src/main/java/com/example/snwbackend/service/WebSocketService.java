package com.example.snwbackend.service;

import com.example.snwbackend.entity.Contact;
import com.example.snwbackend.entity.Message;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.ContactRepository;
import com.example.snwbackend.repository.MessageRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.request.MessageRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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

    @Transactional
    public Message sendMessage(MessageRequest request, Integer contactId) {
        Contact contact = contactRepository.findById(contactId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + contactId);
        });

        User user = userRepository.findById(request.getSenderId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " +request.getSenderId());
        });

        if(request.getSenderId() != contact.getUser1().getId() && request.getSenderId() != contact.getUser2().getId()) {
            throw new BadRequestException("Can not send message with id = " +request.getSenderId());
        }

        Message message = Message.builder()
                .content(request.getContent())
                .sender(user)
                .contact(contact)
                .build();
        contact.setLastMessage(message);
        messageRepository.save(message);
        contactRepository.save(contact);

        simpMessagingTemplate.convertAndSend("/topic/user/" + contact.getUser1().getId(), contact);
        simpMessagingTemplate.convertAndSend("/topic/user/" + contact.getUser2().getId(), contact);
        return message;
    }
}
