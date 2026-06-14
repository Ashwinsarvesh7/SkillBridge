package com.skillbridge.dto;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardDto {
    private AdminAnalyticsDto analytics;
    private List<ReportDto> openReports = new ArrayList<>();
    private List<ActivityDto> auditLogs = new ArrayList<>();

    public AdminAnalyticsDto getAnalytics() { return analytics; }
    public void setAnalytics(AdminAnalyticsDto analytics) { this.analytics = analytics; }
    public List<ReportDto> getOpenReports() { return openReports; }
    public void setOpenReports(List<ReportDto> openReports) { this.openReports = openReports; }
    public List<ActivityDto> getAuditLogs() { return auditLogs; }
    public void setAuditLogs(List<ActivityDto> auditLogs) { this.auditLogs = auditLogs; }
}
