package com.example.snwbackend.service;

import com.example.snwbackend.entity.*;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.*;
import com.example.snwbackend.request.MessageFile;
import com.example.snwbackend.request.MessageRequest;
import com.example.snwbackend.request.NamedGroupChatRequest;
import com.example.snwbackend.request.UpsertConversationRequest;
import com.example.snwbackend.security.JwtTokenUtil;
import com.example.snwbackend.utils.ImageUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Set;

@Service
public class WebSocketService {


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

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private ChatImageRepository chatImageRepository;

    @Autowired
    private ChatImgRepository chatImgRepository;

    @Transactional
    public Message sendMessage(MessageRequest request, Integer conversationId, SimpMessageHeaderAccessor accessor) {
        if(request.getContent().isEmpty()) {
            return null;
        }
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });

        String token = accessor.getFirstNativeHeader("Authorization");
        if(token == null || !token.startsWith("Bearer")) {
            return null;
        }
        String email = jwtTokenUtil.getClaimsFromToken(token.substring(7)).getSubject();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if(!conversation.getUsers().contains(user)) {
            throw new BadRequestException("You not in this conversation");
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
                simpMessagingTemplate.convertAndSendToUser(u.getEmail() ,"/topic/chat", userConversation);
                continue;
            }
            userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
            simpMessagingTemplate.convertAndSendToUser(u.getEmail(), "/topic/chat", userConversation);
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
            simpMessagingTemplate.convertAndSendToUser(u.getEmail() ,"/topic/chat", userConversation);
        }
    }

    @Transactional
    public void namedGroupChat(NamedGroupChatRequest request, Integer conversationId, SimpMessageHeaderAccessor accessor) {
        if(request.getName().length() > 50) {
            return;
        }
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });
        if(!conversation.isGroupChat()) {
            return;
        }
        String token = accessor.getFirstNativeHeader("Authorization");
        if(token == null || !token.startsWith("Bearer")) {
            return;
        }
        String email = jwtTokenUtil.getClaimsFromToken(token.substring(7)).getSubject();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if(!conversation.getUsers().contains(user)) {
            throw new BadRequestException("You not in this conversation");
        }
        conversation.setName(request.getName());
//        conversationRepository.save(conversation);

        Message message = Message.builder()
                .content("named the group " +request.getName())
                .sender(user).type("NAMED")
                .conversation(conversation)
                .build();
        messageRepository.save(message);

        simpMessagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);

        for (User u: conversation.getUsers()) {
            UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
            if (u.getId() == user.getId()) {
                simpMessagingTemplate.convertAndSendToUser(u.getEmail() ,"/topic/chat", userConversation);
                continue;
            }
            userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
            simpMessagingTemplate.convertAndSendToUser(u.getEmail(), "/topic/chat", userConversation);
        }

    }

    @Transactional
    public void addPeople(UpsertConversationRequest request, Integer conversationId, SimpMessageHeaderAccessor accessor) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });
        if(!conversation.isGroupChat()) {
            return;
        }
        String token = accessor.getFirstNativeHeader("Authorization");
        if(token == null || !token.startsWith("Bearer")) {
            return;
        }
        String email = jwtTokenUtil.getClaimsFromToken(token.substring(7)).getSubject();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });
        if (!conversation.getUsers().contains(user)) {
            return;
        }
        Set<User> users = userRepository.findByIdIn(request.getUserIds());
        Set<User> oldUser = conversation.getUsers();
        oldUser.addAll(users);
        conversation.setUsers(oldUser);
//        conversationRepository.save(conversation);

        String content = "added ";
        for (User u: users) {
            content += u.getName() + ", ";
        }
        Message message = Message.builder()
                .content(content.substring(0, content.length() - 2) + " to the group")
                .sender(user).type("ADDED")
                .conversation(conversation)
                .build();
        messageRepository.save(message);

        simpMessagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);

        for (User u: conversation.getUsers()) {
            UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
            if (u.getId() == user.getId()) {
                simpMessagingTemplate.convertAndSendToUser(u.getEmail() ,"/topic/chat", userConversation);
                continue;
            }
            if (userConversation.getUnreadCount() == null) {
                userConversation.setUnreadCount(1);
            } else {
                userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
            }
            if (userConversation.getIsArchive() == null) {
                userConversation.setIsArchive(false);
            }

            simpMessagingTemplate.convertAndSendToUser(u.getEmail(), "/topic/chat", userConversation);
        }
    }

    @Transactional
    public void leaveGroup(Integer conversationId, SimpMessageHeaderAccessor accessor) {
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });
        if(!conversation.isGroupChat()) {
            return;
        }
        String token = accessor.getFirstNativeHeader("Authorization");
        if(token == null || !token.startsWith("Bearer")) {
            return;
        }
        String email = jwtTokenUtil.getClaimsFromToken(token.substring(7)).getSubject();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        Set<User> users = conversation.getUsers();
        users.remove(user);
        conversation.setUsers(users);
        if(users.size() == 0) {
            messageRepository.deleteAllByConversation(conversation);
            conversationRepository.delete(conversation);
        } else {
            conversationRepository.save(conversation);
            Message message = Message.builder()
                    .content("left the group")
                    .sender(user).type("LEAVE")
                    .conversation(conversation)
                    .build();
            messageRepository.save(message);

            simpMessagingTemplate.convertAndSend("/topic/conversation/" + conversationId, message);

            for (User u: conversation.getUsers()) {
                UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
                userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
                simpMessagingTemplate.convertAndSendToUser(u.getEmail(), "/topic/chat", userConversation);
            }
        }
    }

    @Transactional
    public void sendImage(Integer conversationId,MessageRequest request, SimpMessageHeaderAccessor accessor){
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(() -> {
            throw new NotFoundException("Not found contact with id = " + conversationId);
        });

        String token = accessor.getFirstNativeHeader("Authorization");
        if(token == null || !token.startsWith("Bearer")) {
            return;
        }
        String email = jwtTokenUtil.getClaimsFromToken(token.substring(7)).getSubject();
        User user = userRepository.findByEmail(email).orElseThrow(() -> {
            throw new NotFoundException("Not found user with email = " + email);
        });

        if(!conversation.getUsers().contains(user)) {
            throw new BadRequestException("You not in this conversation");
        }

//        String[] parts = request.getContent().split(",");
//        String header = parts[0]; // data:image/jpeg;base64
//        String content = parts[1];
            Integer imgId = saveImage(request.getContent(), user);

            Message message = Message.builder()
                    .content("sent a photo")
                    .sender(user).type("IMAGE")
                    .imageUrl("/api/images/chat/" + imgId)
                    .conversation(conversation)
                    .build();

            messageRepository.save(message);

            simpMessagingTemplate.convertAndSend("/topic/conversation/" + conversation.getId(), message);
            for (User u: conversation.getUsers()) {
                UserConversation userConversation = userConversationRepository.findByUserAndConversation(u, conversation).get();
                if (u.getId() == user.getId()) {
                    simpMessagingTemplate.convertAndSendToUser(u.getEmail() ,"/topic/chat", userConversation);
                    continue;
                }
                userConversation.setUnreadCount(userConversation.getUnreadCount() + 1);
                simpMessagingTemplate.convertAndSendToUser(u.getEmail(), "/topic/chat", userConversation);
            }
    }

    public Integer saveImage(String base64, User user) {
        String[] parts = base64.split(",");
        String header = parts[0]; // data:image/jpeg;base64
        String content = parts[1];
        try {
            byte[] data = Base64.getDecoder().decode(content);
            ChatImage image = ChatImage
                    .builder()
                    .data(data)
                    .user(user)
                    .type(header.substring(5, header.indexOf(";")))
                    .build();
            chatImgRepository.saveImage(image);
            return image.getId();
        } catch (Exception e) {
            throw new RuntimeException("Error on upload file: " +e.getMessage());
        }
    }
}
