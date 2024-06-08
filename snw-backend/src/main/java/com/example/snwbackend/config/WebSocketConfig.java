package com.example.snwbackend.config;

import com.example.snwbackend.entity.Conversation;
import com.example.snwbackend.entity.User;
import com.example.snwbackend.exception.BadRequestException;
import com.example.snwbackend.exception.NotFoundException;
import com.example.snwbackend.repository.ConversationRepository;
import com.example.snwbackend.repository.UserConversationRepository;
import com.example.snwbackend.repository.UserRepository;
import com.example.snwbackend.security.JwtTokenUtil;
import com.example.snwbackend.service.WebSocketService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.converter.MessageConverter;
import org.springframework.messaging.handler.invocation.HandlerMethodArgumentResolver;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.reactive.result.method.annotation.AuthenticationPrincipalArgumentResolver;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

import java.util.List;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@Order(Ordered.HIGHEST_PRECEDENCE + 99)
@Component
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Qualifier("userDetailsService")
    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserConversationRepository userConversationRepository;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
        registry.setUserDestinationPrefix("/users");

    }

    private String extractTokenFromHeader(String header) {
        if (header != null && header.startsWith("Bearer")) {
            return header.substring(7);
        }
        return null;
    }

    @Transactional
    private void setIsOnlineUser(String email, boolean status) {
        User user = userRepository.findByEmail(email).get();
        if(user != null) {
            user.setIsOnline(status);
            userRepository.save(user);
        }
    }

    private void checkPort(String token, String destination) {
     if (destination.contains("conversation")) {
            Integer conversationId = Integer.parseInt(destination.substring(destination.lastIndexOf("/") + 1));
//            log.info("conversationId---------: {}", conversationId);
            Claims claims = jwtTokenUtil.getClaimsFromToken(token);
            String email = claims.getSubject();
            User user = userRepository.findByEmail(email).orElseThrow(() -> {
                throw new NotFoundException("Not found user");
            });
            if(userConversationRepository.findById_UserIdAndId_ConversationId(user.getId(), conversationId).isEmpty()) {
                throw new BadRequestException("Can not subscribe this port");
            }
        }
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String jwtToken = extractTokenFromHeader(accessor.getNativeHeader("Authorization").get(0));
                    if (jwtToken != null) {
                        Claims claims = jwtTokenUtil.getClaimsFromToken(jwtToken);

                        String email = claims.getSubject();
                        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                        Authentication authentication = new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());
                        accessor.setUser(authentication);
                        setIsOnlineUser(email, true);
                    } else {
                        throw new  BadRequestException("");
                    }
                }
                if (StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
                    String destination = accessor.getDestination();
                    String jwtToken = extractTokenFromHeader(accessor.getNativeHeader("Authorization").get(0));
                    if (jwtToken == null) {
                        throw new BadRequestException("");
                    }
                    checkPort(jwtToken, destination);
                }
                if (StompCommand.DISCONNECT.equals(accessor.getCommand())) {
                    String email = accessor.getUser().getName();
                    setIsOnlineUser(email, false);
                }
                return message;
            }
        });
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registry) {
        registry.setMessageSizeLimit(1024*1024*3);
    }

   }