package com.example.snwbackend.repository;

import com.example.snwbackend.entity.Conversation;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.entity.UserConversation;
import com.example.snwbackend.entity.UserConversationKey;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserConversationRepository extends JpaRepository<UserConversation, UserConversationKey> {
    List<UserConversation> findAllById_UserId(Integer id);
    List<UserConversation> findAllById_ConversationId(Integer conversationId);
    Optional<UserConversation> findByUserAndConversation(User user, Conversation conversation);
    Optional<UserConversation> findById_UserIdAndId_ConversationId(Integer userId, Integer conversationId);

    @Query("select uc from UserConversation uc where uc.id.userId = ?1 and uc.isArchive = ?2 order by uc.conversation.lastMessage.createdAt DESC ")
    Page<UserConversation> findAllById_UserIdOrderByLastMessage(Integer userId, Boolean isArchive, Pageable pageable);

    @Query("select SUM(uc.unreadCount) from UserConversation uc where uc.id.userId = ?1 and uc.isArchive = false ")
    Integer getAllUnreadMessageCountByUserId(Integer userId);
}