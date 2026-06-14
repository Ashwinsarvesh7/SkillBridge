package com.skillbridge.dto;

import com.skillbridge.entity.enums.RequestStatus;

import java.time.LocalDateTime;

public class ExchangeRequestDto {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private Long offeredSkillId;
    private String offeredSkillName;
    private Long requestedSkillId;
    private String requestedSkillName;
    private RequestStatus status;
    private String message;
    private String sessionRoom;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }
    public Long getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(Long offeredSkillId) { this.offeredSkillId = offeredSkillId; }
    public String getOfferedSkillName() { return offeredSkillName; }
    public void setOfferedSkillName(String offeredSkillName) { this.offeredSkillName = offeredSkillName; }
    public Long getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(Long requestedSkillId) { this.requestedSkillId = requestedSkillId; }
    public String getRequestedSkillName() { return requestedSkillName; }
    public void setRequestedSkillName(String requestedSkillName) { this.requestedSkillName = requestedSkillName; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getSessionRoom() { return sessionRoom; }
    public void setSessionRoom(String sessionRoom) { this.sessionRoom = sessionRoom; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
