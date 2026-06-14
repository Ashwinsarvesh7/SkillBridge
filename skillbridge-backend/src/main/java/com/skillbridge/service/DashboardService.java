package com.skillbridge.service;

import com.skillbridge.dto.DashboardDto;
import com.skillbridge.dto.UserStatsDto;
import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.RequestStatus;
import com.skillbridge.entity.enums.SkillType;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ChatMessageRepository;
import com.skillbridge.repository.ExchangeRequestRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final MatchingService matchingService;
    private final ExchangeService exchangeService;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final UserRepository userRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final UserSkillRepository userSkillRepository;
    private final ChatMessageRepository chatMessageRepository;

    public DashboardService(MatchingService matchingService, ExchangeService exchangeService,
                            NotificationService notificationService, ActivityService activityService,
                            UserRepository userRepository, ExchangeRequestRepository exchangeRepository,
                            UserSkillRepository userSkillRepository, ChatMessageRepository chatMessageRepository) {
        this.matchingService = matchingService;
        this.exchangeService = exchangeService;
        this.notificationService = notificationService;
        this.activityService = activityService;
        this.userRepository = userRepository;
        this.exchangeRepository = exchangeRepository;
        this.userSkillRepository = userSkillRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public DashboardDto getDashboard(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DashboardDto dashboard = new DashboardDto();
        dashboard.setRecommendedUsers(matchingService.getRecommendedMatches(userId));
        dashboard.setActiveExchanges(exchangeService.getActive(userId));
        dashboard.setNotifications(notificationService.getForUser(userId).stream().limit(10).toList());
        dashboard.setRecentActivity(activityService.getRecent(userId));
        dashboard.setUnreadNotifications(notificationService.getUnreadCount(userId));
        dashboard.setUnreadMessages(chatMessageRepository.countByReceiverIdAndReadFalse(userId));
        dashboard.setStats(buildStats(userId, user));
        return dashboard;
    }

    private UserStatsDto buildStats(Long userId, User user) {
        UserStatsDto stats = new UserStatsDto();
        var all = exchangeRepository.findBySenderIdOrReceiverIdOrderByCreatedAtDesc(userId, userId);
        stats.setTotalExchanges(all.size());
        stats.setCompletedExchanges(all.stream().filter(e -> e.getStatus() == RequestStatus.COMPLETED).count());
        stats.setPendingRequests(all.stream().filter(e -> e.getStatus() == RequestStatus.PENDING).count());
        stats.setSkillsTeaching(userSkillRepository.findByUserIdAndType(userId, SkillType.TEACH).size());
        stats.setSkillsLearning(userSkillRepository.findByUserIdAndType(userId, SkillType.LEARN).size());
        stats.setProfileCompletionPercent(user.getProfileCompletionPercent());
        return stats;
    }
}
