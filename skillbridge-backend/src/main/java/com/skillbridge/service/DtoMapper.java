package com.skillbridge.service;

import com.skillbridge.dto.*;
import com.skillbridge.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public final class DtoMapper {

    private DtoMapper() {}

    public static UserDto toUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setBio(user.getBio());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setExperienceLevel(user.getExperienceLevel());
        dto.setRole(user.getRole());
        dto.setProfileCompletionPercent(user.getProfileCompletionPercent());
        dto.setEnabled(user.isEnabled());
        dto.setDisabledBy(user.getDisabledBy());
        dto.setDisabledDate(user.getDisabledDate());
        dto.setDisabledReason(user.getDisabledReason());
        dto.setLastLogin(user.getLastLogin());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setAverageRating(user.getAverageRating());
        dto.setTotalReviews(user.getTotalReviews());
        // if (user.getUserSkills() != null) {
        //     dto.setSkills(user.getUserSkills().stream().map(DtoMapper::toUserSkillDto).collect(Collectors.toList()));
        // }
        dto.setSkills(new java.util.ArrayList<>());
        return dto;
    }

    public static UserDto toUserDtoBasic(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        dto.setExperienceLevel(user.getExperienceLevel());
        dto.setAverageRating(user.getAverageRating());
        dto.setProfileCompletionPercent(user.getProfileCompletionPercent());
        return dto;
    }

    public static UserSkillDto toUserSkillDto(UserSkill us) {
        UserSkillDto dto = new UserSkillDto();
        dto.setId(us.getId());
        dto.setSkillId(us.getSkill().getId());
        dto.setSkillName(us.getSkill().getName());
        dto.setCategory(us.getSkill().getCategory());
        dto.setSkillType(us.getSkillType());
        dto.setExperienceLevel(us.getExperienceLevel());
        dto.setBadgeLevel(us.getBadgeLevel());
        dto.setCompletedExchanges(us.getCompletedExchanges());
        return dto;
    }

    public static SkillDto toSkillDto(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setCategory(skill.getCategory());
        dto.setDescription(skill.getDescription());
        return dto;
    }

    public static ExchangeRequestDto toExchangeDto(ExchangeRequest req) {
        ExchangeRequestDto dto = new ExchangeRequestDto();
        dto.setId(req.getId());
        dto.setSenderId(req.getSender().getId());
        dto.setSenderName(req.getSender().getFirstName() + " " + req.getSender().getLastName());
        dto.setReceiverId(req.getReceiver().getId());
        dto.setReceiverName(req.getReceiver().getFirstName() + " " + req.getReceiver().getLastName());
        dto.setOfferedSkillId(req.getOfferedSkill().getId());
        dto.setOfferedSkillName(req.getOfferedSkill().getName());
        dto.setRequestedSkillId(req.getRequestedSkill().getId());
        dto.setRequestedSkillName(req.getRequestedSkill().getName());
        dto.setStatus(req.getStatus());
        dto.setMessage(req.getMessage());
        dto.setSessionRoom(req.getSession() != null ? req.getSession().getRoomId() : null);
        dto.setCreatedAt(req.getCreatedAt());
        dto.setUpdatedAt(req.getUpdatedAt());
        return dto;
    }

    public static ReviewDto toReviewDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setReviewerId(review.getReviewer().getId());
        dto.setReviewerName(review.getReviewer().getFirstName() + " " + review.getReviewer().getLastName());
        dto.setReviewedUserId(review.getReviewedUser().getId());
        dto.setExchangeRequestId(review.getExchangeRequest().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public static NotificationDto toNotificationDto(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.setId(n.getId());
        dto.setTitle(n.getTitle());
        dto.setMessage(n.getMessage());
        dto.setNotificationType(n.getNotificationType());
        dto.setRead(n.isRead());
        dto.setLink(n.getLink());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }

    public static ActivityDto toActivityDto(ActivityLog log) {
        ActivityDto dto = new ActivityDto();
        dto.setId(log.getId());
        dto.setActivityType(log.getActivityType());
        dto.setDescription(log.getDescription());
        dto.setCreatedAt(log.getCreatedAt());
        return dto;
    }

    public static ChatMessageDto toChatDto(ChatMessage m) {
        ChatMessageDto dto = new ChatMessageDto();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getFirstName() + " " + m.getSender().getLastName());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverName(m.getReceiver().getFirstName() + " " + m.getReceiver().getLastName());
        if (m.getExchangeRequest() != null) {
            dto.setExchangeRequestId(m.getExchangeRequest().getId());
        }
        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setSentAt(m.getSentAt());
        return dto;
    }

    public static ReportDto toReportDto(Report r) {
        ReportDto dto = new ReportDto();
        dto.setId(r.getId());
        dto.setReporterId(r.getReporter().getId());
        dto.setReporterName(r.getReporter().getFirstName() + " " + r.getReporter().getLastName());
        dto.setReportedUserId(r.getReportedUser().getId());
        dto.setReportedUserName(r.getReportedUser().getFirstName() + " " + r.getReportedUser().getLastName());
        dto.setReason(r.getReason());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
