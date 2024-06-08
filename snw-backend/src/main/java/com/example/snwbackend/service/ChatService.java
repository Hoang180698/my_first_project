package com.example.snwbackend.service;

import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.ContactRequest;
import com.example.snwbackend.request.UpsertConversationRequest;
import com.example.snwbackend.response.StatusResponse;
import com.example.snwbackend.response.UnreadMessageCountResponse;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
                .user1(user).user2(user2)
                .users(users)
                .build();
        conversationRepository.save(conversation1);

        for (User u: conversation1.getUsers()) {
            UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation1).get();
            userConversation.setUnreadCount(0);
            userConversation.setIsArchive(false);
            userConversation.setIsOnSound(true);
        }

        return conversation1;
    }

    // Tạo chát nhóm
    @Transactional
    public Conversation createGroupChat(UpsertConversationRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        Set<User> users = userRepository.findByIdIn(request.getUserIds());
        users.add(user);
        if(users.size() < 3) {
            throw new BadRequestException("Need at least 3 people to create group chat");
        }
        Conversation conversation = Conversation.builder()
                .isGroupChat(true)
                .users(users)
                .build();
        Message message = Message.builder()
                .sender(user).type("START").conversation(conversation).content("created this group")
                .build();
        conversationRepository.save(conversation);
        messageRepository.save(message);

        for (User u: conversation.getUsers()) {
            if (u.getId() == user.getId()) {
                UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
                userConversation.setUnreadCount(0);
                userConversation.setIsArchive(false);
                userConversation.setIsOnSound(true);
            } else {
                UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
                userConversation.setUnreadCount(1);
                userConversation.setIsArchive(false);
                userConversation.setIsOnSound(true);
            }
        }
        return conversation;
    }

    // Lấy danh sách các cuộc hội thoại
    public Page<UserConversation> getAllConversation(Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return userConversationRepository.findAllById_UserIdOrderByLastMessage(user.getId(), false, PageRequest.of(page, pageSize));
    }

    // Lấy danh sách các cuộc hội thoại trong kho
    public Page<UserConversation> getAllArchiveConversation(Integer page, Integer pageSize) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        return userConversationRepository.findAllById_UserIdOrderByLastMessage(user.getId(), true, PageRequest.of(page, pageSize));
    }

    // Lấy các tin nhắn trong cuộc hội thoại
    public Page<Message> getAllMessageByConversationId(Integer conversationId, Integer page, Integer pageSize) {
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

        return messageRepository.findAllByConversationOrderByCreatedAtDesc(conversation, PageRequest.of(page, pageSize));
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


    public StatusResponse toggleSetArchiveChat(Integer conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        UserConversation userConversation = userConversationRepository.findById_UserIdAndId_ConversationId(user.getId(), conversationId).orElseThrow(() -> {
            throw new NotFoundException("You aren't in conversation have id: " + conversationId);
        });
        userConversation.setIsArchive(!userConversation.getIsArchive());
        userConversationRepository.save(userConversation);
        return new StatusResponse("ok");
    }

    public StatusResponse toggleSetNoticeSoundMessage(Integer conversationId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        UserConversation userConversation = userConversationRepository.findById_UserIdAndId_ConversationId(user.getId(), conversationId).orElseThrow(() -> {
            throw new NotFoundException("You aren't in conversation have id: " + conversationId);
        });
        userConversation.setIsOnSound(!userConversation.getIsOnSound());
        userConversationRepository.save(userConversation);
        return new StatusResponse("ok");
    }
}
