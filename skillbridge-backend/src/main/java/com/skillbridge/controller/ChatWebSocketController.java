package com.skillbridge.controller;

import com.skillbridge.dto.ChatMessageDto;
import com.skillbridge.security.CustomUserDetails;
import com.skillbridge.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class ChatWebSocketController {

    private final ChatService chatService;

    public ChatWebSocketController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public ChatMessageDto sendMessage(@Payload Map<String, Object> payload, Authentication auth) {
        CustomUserDetails user = (CustomUserDetails) auth.getPrincipal();
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();
        Long exchangeId = payload.get("exchangeRequestId") != null
                ? Long.valueOf(payload.get("exchangeRequestId").toString()) : null;
        return chatService.send(user.getId(), receiverId, content, exchangeId);
    }
}
