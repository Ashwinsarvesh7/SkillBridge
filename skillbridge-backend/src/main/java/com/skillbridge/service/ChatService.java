package com.skillbridge.service;

import com.skillbridge.dto.ChatMessageDto;
import com.skillbridge.entity.ChatMessage;
import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.NotificationType;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ChatMessageRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ChatService {

    private final ChatMessageRepository chatRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatService(ChatMessageRepository chatRepository, UserRepository userRepository,
                       NotificationService notificationService, SimpMessagingTemplate messagingTemplate) {
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public ChatMessageDto send(Long senderId, Long receiverId, String content, Long exchangeRequestId) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found"));

        ChatMessage msg = new ChatMessage();
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(content);
        msg = chatRepository.save(msg);

        ChatMessageDto dto = DtoMapper.toChatDto(msg);
messagingTemplate.convertAndSend(
    "/topic/chat/" + receiver.getId(),
    dto
);
        notificationService.create(receiver, "New Message",
                sender.getFirstName() + ": " + content.substring(0, Math.min(50, content.length())),
                NotificationType.CHAT, "/chat");
        return dto;
    }

    public List<ChatMessageDto> getConversation(Long userId, Long otherUserId) {
        return chatRepository.findConversation(userId, otherUserId)
                .stream().map(DtoMapper::toChatDto).toList();
    }

    @Transactional
    public void markConversationRead(Long userId, Long otherUserId) {
        chatRepository.findConversation(userId, otherUserId).forEach(m -> {
            if (m.getReceiver().getId().equals(userId) && !m.isRead()) {
                m.setRead(true);
                chatRepository.save(m);
            }
        });
    }
}
