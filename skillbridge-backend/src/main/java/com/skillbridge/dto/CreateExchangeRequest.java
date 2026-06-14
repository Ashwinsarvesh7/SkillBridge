package com.skillbridge.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateExchangeRequest {
    @NotNull
    private Long receiverId;
    @NotNull
    private Long offeredSkillId;
    @NotNull
    private Long requestedSkillId;
    @Size(max = 1000)
    private String message;

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
    public Long getOfferedSkillId() { return offeredSkillId; }
    public void setOfferedSkillId(Long offeredSkillId) { this.offeredSkillId = offeredSkillId; }
    public Long getRequestedSkillId() { return requestedSkillId; }
    public void setRequestedSkillId(Long requestedSkillId) { this.requestedSkillId = requestedSkillId; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
