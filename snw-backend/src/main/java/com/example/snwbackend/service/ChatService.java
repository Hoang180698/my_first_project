package com.example.snwbackend.service;

import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.ContactRequest;
import com.example.snwbackend.response.StatusResponse;
import com.example.snwbackend.response.UnreadMessageCountResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class ChatService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserConversationRepository userConversationRepository;

    // Tạo chát đơn
    @Transactional
    public Conversation createSingleConversation(ContactRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        User user2 = userRepository.findById(request.getUserId()).orElseThrow(() -> {
            throw new NotFoundException("Not found user with id = " + request.getUserId());
        });
        Optional<Conversation> conversation;
        if(user.getId() < user2.getId()) {
            conversation = conversationRepository.findByUser1AndUser2(user, user2);
        } else {
            conversation = conversationRepository.findByUser1AndUser2(user2, user);
        }
        if(conversation.isPresent()) {
            return conversation.get();
        }
        Set<User> users = new LinkedHashSet<>();
        users.add(user); users.add(user2);
        Conversation conversation1 = Conversation.builder()
                .isGroupChat(false).user1(user).user2(user2)
                .users(users)
                .build();
        return conversationRepository.save(conversation1);
    }

    // Lấy danh sách các cuộc hội thoại
    public List<UserConversation> getAllConversation() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return userConversationRepository.findAllById_UserIdOrderByLastMessage(user.getId());
    }

    // Lấy các tin nhắn trong cuộc hội thoại
    public List<Message> getAllMessageByConversationId(Integer conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });

        if (!conversation.getUsers().contains(user)) {
            throw new BadRequestException("You do not have permission");
        }

        return messageRepository.findAllByConversationOrderByCreatedAtDesc(conversation);
    }

    // Lấy thông tin cuộc hội thoại
    public Conversation getConversationById(Integer id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        Conversation conversation = conversationRepository.findById(id).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + id);
        });
        if (!conversation.getUsers().contains(user)) {
            throw new BadRequestException("You do not have permission");
        }

        return conversation;
    }

    // Reset unread count
    public StatusResponse resetUnreadCountByConversationId(Integer conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        UserConversation userConversation = userConversationRepository.findById_UserIdAndId_ConversationId(user.getId(), conversationId).orElseThrow(()-> {
            throw new NotFoundException("Not found with id: " + conversationId);
        });
        userConversation.setUnreadCount(0);
        userConversationRepository.save(userConversation);
        return new StatusResponse("ok");
    }

    // get all unread count
    public UnreadMessageCountResponse getAllUnreadCount() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        return new UnreadMessageCountResponse(userConversationRepository.getAllUnreadMessageCountByUserId(user.getId()));
    }
}
