package com.skillbridge.service;

import com.skillbridge.dto.CreateExchangeRequest;
import com.skillbridge.dto.ExchangeRequestDto;
import com.skillbridge.entity.ExchangeRequest;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.entity.enums.NotificationType;
import com.skillbridge.entity.enums.RequestStatus;
import com.skillbridge.entity.enums.SkillType;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ExchangeRequestRepository;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExchangeService {

    private final ExchangeRequestRepository exchangeRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final UserSkillRepository userSkillRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final SessionService sessionService;

    public ExchangeService(ExchangeRequestRepository exchangeRepository, UserRepository userRepository,
                           SkillRepository skillRepository, UserSkillRepository userSkillRepository,
                           NotificationService notificationService, ActivityService activityService,
                           SessionService sessionService) {
        this.exchangeRepository = exchangeRepository;
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.userSkillRepository = userSkillRepository;
        this.notificationService = notificationService;
        this.activityService = activityService;
        this.sessionService = sessionService;
    }

    @Transactional
    public ExchangeRequestDto create(Long senderId, CreateExchangeRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new BadRequestException("Cannot send request to yourself");
        }
        User sender = findUser(senderId);
        User receiver = findUser(request.getReceiverId());
        Skill offered = findSkill(request.getOfferedSkillId());
        Skill requested = findSkill(request.getRequestedSkillId());

        validateSkillOwnership(senderId, offered.getId(), SkillType.TEACH);
        validateSkillOwnership(receiver.getId(), requested.getId(), SkillType.TEACH);

        ExchangeRequest ex = new ExchangeRequest();
        ex.setSender(sender);
        ex.setReceiver(receiver);
        ex.setOfferedSkill(offered);
        ex.setRequestedSkill(requested);
        ex.setMessage(request.getMessage());
        ex.setStatus(RequestStatus.PENDING);
        ex = exchangeRepository.save(ex);

        notificationService.create(receiver, "New Exchange Request",
                sender.getFirstName() + " wants to exchange " + offered.getName() + " for " + requested.getName(),
                NotificationType.REQUEST, "/requests");
        activityService.log(sender, "REQUEST_SENT", "Sent exchange request to " + receiver.getFirstName());
        return DtoMapper.toExchangeDto(ex);
    }

    public List<ExchangeRequestDto> getAllForUser(Long userId) {
        return exchangeRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId)
                .stream().map(DtoMapper::toExchangeDto).toList();
    }

    public List<ExchangeRequestDto> getActive(Long userId) {
        List<RequestStatus> active = List.of(RequestStatus.ACCEPTED, RequestStatus.IN_PROGRESS);
        return exchangeRepository.findBySenderIdOrReceiverIdAndStatusIn(userId, userId, active)
                .stream().map(DtoMapper::toExchangeDto).toList();
    }

    @Transactional
    public ExchangeRequestDto respond(Long userId, Long requestId, RequestStatus status) {
        ExchangeRequest ex = exchangeRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!ex.getReceiver().getId().equals(userId)) {
            throw new BadRequestException("Only receiver can respond");
        }
        if (ex.getStatus() != RequestStatus.PENDING) {
            throw new BadRequestException("Request already processed");
        }
        if (status != RequestStatus.ACCEPTED && status != RequestStatus.REJECTED) {
            throw new BadRequestException("Invalid status");
        }
        ex.setStatus(status);
        if (status == RequestStatus.ACCEPTED) {
            ex.setStatus(RequestStatus.IN_PROGRESS);
            var session = sessionService.createSession(ex);
            ex.setSession(session);
        }
        ex = exchangeRepository.save(ex);

        NotificationType type = status == RequestStatus.ACCEPTED ? NotificationType.ACCEPTANCE : NotificationType.REJECTION;
        String msg = status == RequestStatus.ACCEPTED ? "accepted" : "rejected";
        String notificationLink = "/requests";
        if (status == RequestStatus.ACCEPTED && ex.getSession() != null) {
            notificationLink = "/session?contact=" + ex.getReceiver().getId() + "&room=" + ex.getSession().getRoomId();
        }
        notificationService.create(ex.getSender(), "Exchange " + msg,
                ex.getReceiver().getFirstName() + " " + msg + " your exchange request",
                type, notificationLink);
        activityService.log(ex.getReceiver(), "REQUEST_" + status.name(),
                "Responded to exchange request from " + ex.getSender().getFirstName());
        return DtoMapper.toExchangeDto(ex);
    }

    @Transactional
    public ExchangeRequestDto complete(Long userId, Long requestId) {
        ExchangeRequest ex = exchangeRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!ex.getSender().getId().equals(userId) && !ex.getReceiver().getId().equals(userId)) {
            throw new BadRequestException("Not authorized");
        }
        if (ex.getStatus() != RequestStatus.IN_PROGRESS && ex.getStatus() != RequestStatus.ACCEPTED) {
            throw new BadRequestException("Exchange is not active");
        }
        ex.setStatus(RequestStatus.COMPLETED);
        ex = exchangeRepository.save(ex);
        updateBadges(ex.getSender().getId(), ex.getOfferedSkill().getId());
        updateBadges(ex.getReceiver().getId(), ex.getRequestedSkill().getId());

        notificationService.create(ex.getSender(), "Exchange Completed",
                "Skill exchange completed. Leave a review!", NotificationType.COMPLETION, "/requests");
        notificationService.create(ex.getReceiver(), "Exchange Completed",
                "Skill exchange completed. Leave a review!", NotificationType.COMPLETION, "/requests");
        activityService.log(findUser(userId), "EXCHANGE_COMPLETE", "Completed skill exchange");
        return DtoMapper.toExchangeDto(ex);
    }

    @Transactional
    public ExchangeRequestDto cancel(Long userId, Long requestId) {
        ExchangeRequest ex = exchangeRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
        if (!ex.getSender().getId().equals(userId)) {
            throw new BadRequestException("Only sender can cancel");
        }
        ex.setStatus(RequestStatus.CANCELLED);
        return DtoMapper.toExchangeDto(exchangeRepository.save(ex));
    }

    private void updateBadges(Long userId, Long skillId) {
        userSkillRepository.findByUserIdAndSkillIdAndSkillType(userId, skillId, SkillType.TEACH)
                .ifPresent(us -> {
                    us.setCompletedExchanges(us.getCompletedExchanges() + 1);
                    us.setBadgeLevel(resolveBadge(us.getCompletedExchanges()));
                    userSkillRepository.save(us);
                });
    }

    private String resolveBadge(int count) {
        if (count >= 10) return "GOLD";
        if (count >= 5) return "SILVER";
        if (count >= 1) return "BRONZE";
        return "NONE";
    }

    private void validateSkillOwnership(Long userId, Long skillId, SkillType type) {
        if (userSkillRepository.findByUserIdAndSkillIdAndSkillType(userId, skillId, type).isEmpty()) {
            throw new BadRequestException("User does not have required skill: " + type);
        }
    }

    private User findUser(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Skill findSkill(Long id) {
        return skillRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
    }
}
