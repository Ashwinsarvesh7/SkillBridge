package com.skillbridge.dto;

public class UserStatsDto {
    private long totalExchanges;
    private long completedExchanges;
    private long pendingRequests;
    private long skillsTeaching;
    private long skillsLearning;
    private int profileCompletionPercent;

    public long getTotalExchanges() { return totalExchanges; }
    public void setTotalExchanges(long totalExchanges) { this.totalExchanges = totalExchanges; }
    public long getCompletedExchanges() { return completedExchanges; }
    public void setCompletedExchanges(long completedExchanges) { this.completedExchanges = completedExchanges; }
    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }
    public long getSkillsTeaching() { return skillsTeaching; }
    public void setSkillsTeaching(long skillsTeaching) { this.skillsTeaching = skillsTeaching; }
    public long getSkillsLearning() { return skillsLearning; }
    public void setSkillsLearning(long skillsLearning) { this.skillsLearning = skillsLearning; }
    public int getProfileCompletionPercent() { return profileCompletionPercent; }
    public void setProfileCompletionPercent(int profileCompletionPercent) { this.profileCompletionPercent = profileCompletionPercent; }
}
