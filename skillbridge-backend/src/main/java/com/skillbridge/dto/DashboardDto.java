package com.skillbridge.dto;

import java.util.ArrayList;
import java.util.List;

public class DashboardDto {
    private List<UserDto> recommendedUsers = new ArrayList<>();
    private List<ExchangeRequestDto> activeExchanges = new ArrayList<>();
    private List<NotificationDto> notifications = new ArrayList<>();
    private List<ActivityDto> recentActivity = new ArrayList<>();
    private UserStatsDto stats = new UserStatsDto();
    private long unreadNotifications;
    private long unreadMessages;

    public List<UserDto> getRecommendedUsers() { return recommendedUsers; }
    public void setRecommendedUsers(List<UserDto> recommendedUsers) { this.recommendedUsers = recommendedUsers; }
    public List<ExchangeRequestDto> getActiveExchanges() { return activeExchanges; }
    public void setActiveExchanges(List<ExchangeRequestDto> activeExchanges) { this.activeExchanges = activeExchanges; }
    public List<NotificationDto> getNotifications() { return notifications; }
    public void setNotifications(List<NotificationDto> notifications) { this.notifications = notifications; }
    public List<ActivityDto> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityDto> recentActivity) { this.recentActivity = recentActivity; }
    public UserStatsDto getStats() { return stats; }
    public void setStats(UserStatsDto stats) { this.stats = stats; }
    public long getUnreadNotifications() { return unreadNotifications; }
    public void setUnreadNotifications(long unreadNotifications) { this.unreadNotifications = unreadNotifications; }
    public long getUnreadMessages() { return unreadMessages; }
    public void setUnreadMessages(long unreadMessages) { this.unreadMessages = unreadMessages; }
}
