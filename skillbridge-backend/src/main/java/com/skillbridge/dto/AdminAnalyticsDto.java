package com.skillbridge.dto;

public class AdminAnalyticsDto {
    private long totalUsers;
    private long activeUsers;
    private long totalExchanges;
    private long completedExchanges;
    private long pendingExchanges;
    private long openReports;
    private long totalSkills;

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }
    public long getTotalExchanges() { return totalExchanges; }
    public void setTotalExchanges(long totalExchanges) { this.totalExchanges = totalExchanges; }
    public long getCompletedExchanges() { return completedExchanges; }
    public void setCompletedExchanges(long completedExchanges) { this.completedExchanges = completedExchanges; }
    public long getPendingExchanges() { return pendingExchanges; }
    public void setPendingExchanges(long pendingExchanges) { this.pendingExchanges = pendingExchanges; }
    public long getOpenReports() { return openReports; }
    public void setOpenReports(long openReports) { this.openReports = openReports; }
    public long getTotalSkills() { return totalSkills; }
    public void setTotalSkills(long totalSkills) { this.totalSkills = totalSkills; }
}
