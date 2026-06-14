package com.skillbridge.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class CallSignalingController {

    private final SimpMessagingTemplate messagingTemplate;

    public CallSignalingController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/call/join")
    public void join(@Payload Map<String, Object> payload) {
        String room = payload.get("room").toString();
        messagingTemplate.convertAndSend("/topic/call/" + room, payload);
    }

    @MessageMapping("/call/offer")
    public void offer(@Payload Map<String, Object> payload) {
        String room = payload.get("room").toString();
        messagingTemplate.convertAndSend("/topic/call/" + room, payload);
    }

    @MessageMapping("/call/answer")
    public void answer(@Payload Map<String, Object> payload) {
        String room = payload.get("room").toString();
        messagingTemplate.convertAndSend("/topic/call/" + room, payload);
    }

    @MessageMapping("/call/ice")
    public void ice(@Payload Map<String, Object> payload) {
        String room = payload.get("room").toString();
        messagingTemplate.convertAndSend("/topic/call/" + room, payload);
    }
}
