package com.skillbridge.controller;

import com.skillbridge.dto.ApiResponse;
import com.skillbridge.dto.ChatMessageDto;
import com.skillbridge.security.SecurityUtils;
import com.skillbridge.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<ChatMessageDto>> send(@RequestBody Map<String, Object> body) {
        Long receiverId = Long.valueOf(body.get("receiverId").toString());
        String content = body.get("content").toString();
        Long exchangeId = body.get("exchangeRequestId") != null
                ? Long.valueOf(body.get("exchangeRequestId").toString()) : null;
        return ResponseEntity.ok(ApiResponse.ok(
                chatService.send(SecurityUtils.getCurrentUserId(), receiverId, content, exchangeId)));
    }

    @GetMapping("/{otherUserId}")
    public ResponseEntity<ApiResponse<List<ChatMessageDto>>> getConversation(@PathVariable Long otherUserId) {
        Long userId = SecurityUtils.getCurrentUserId();
        chatService.markConversationRead(userId, otherUserId);
        return ResponseEntity.ok(ApiResponse.ok(chatService.getConversation(userId, otherUserId)));
    }
}
