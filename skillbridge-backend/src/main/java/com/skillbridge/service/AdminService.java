package com.skillbridge.service;

import com.skillbridge.dto.ActivityDto;
import com.skillbridge.dto.AdminAnalyticsDto;
import com.skillbridge.dto.AdminDashboardDto;
import com.skillbridge.dto.ExchangeRequestDto;
import com.skillbridge.dto.ReportDto;
import com.skillbridge.dto.UserDto;
import com.skillbridge.entity.Report;
import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.ReportStatus;
import com.skillbridge.entity.enums.RequestStatus;
import com.skillbridge.entity.enums.UserRole;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.*;
import com.skillbridge.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final SkillRepository skillRepository;
    private final ActivityService activityService;

    public AdminService(UserRepository userRepository,
                    ReportRepository reportRepository,
                    ExchangeRequestRepository exchangeRepository,
                    SkillRepository skillRepository,
                    ActivityService activityService,
                    ActivityLogRepository activityLogRepository) {

    this.userRepository = userRepository;
    this.reportRepository = reportRepository;
    this.exchangeRepository = exchangeRepository;
    this.skillRepository = skillRepository;
    this.activityService = activityService;
    this.activityLogRepository = activityLogRepository;
}

 @Transactional(readOnly = true)
public List<UserDto> getAllUsers() {
    return userRepository.findAll().stream()
            .map(DtoMapper::toUserDto)
            .toList();
}

    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        return userRepository.findById(userId)
                .map(DtoMapper::toUserDto)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public void disableUser(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getRole() == UserRole.ADMIN) {
            throw new IllegalArgumentException("Admin users cannot be disabled");
        }
        user.setEnabled(false);
        user.setDisabledBy(currentAdminName());
        user.setDisabledDate(LocalDateTime.now());
        user.setDisabledReason(reason);
        userRepository.save(user);
        activityService.log(findCurrentAdmin(), "USER_DISABLED", "Disabled user " + user.getEmail());
    }

    @Transactional
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setEnabled(true);
        user.setDisabledBy(null);
        user.setDisabledDate(null);
        user.setDisabledReason(null);
        userRepository.save(user);
        activityService.log(findCurrentAdmin(), "USER_ENABLED", "Enabled user " + user.getEmail());
    }

    @Transactional
public void deleteUser(Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (user.getRole() == UserRole.ADMIN) {
        throw new IllegalArgumentException("Admin users cannot be deleted");
    }

    activityLogRepository.deleteByUserId(userId);

    userRepository.delete(user);

    activityService.log(findCurrentAdmin(),
            "USER_DELETED",
            "Deleted user " + user.getEmail());
}

    @Transactional
    public UserDto updateUser(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updates.containsKey("role")) {
            user.setRole(UserRole.valueOf(String.valueOf(updates.get("role"))));
        }
        if (updates.containsKey("enabled")) {
            user.setEnabled(Boolean.parseBoolean(String.valueOf(updates.get("enabled"))));
        }
        if (updates.containsKey("email")) {
            user.setEmail(String.valueOf(updates.get("email")));
        }
        if (updates.containsKey("firstName")) {
            user.setFirstName(String.valueOf(updates.get("firstName")));
        }
        if (updates.containsKey("lastName")) {
            user.setLastName(String.valueOf(updates.get("lastName")));
        }
        if (updates.containsKey("bio")) {
            user.setBio(String.valueOf(updates.get("bio")));
        }
        if (updates.containsKey("experienceLevel")) {
            user.setExperienceLevel(ExperienceLevel.valueOf(String.valueOf(updates.get("experienceLevel"))));
        }

        return DtoMapper.toUserDto(userRepository.save(user));
    }

    public List<ReportDto> getOpenReports() {
        return reportRepository.findByStatusOrderByCreatedAtDesc(ReportStatus.OPEN)
                .stream().map(DtoMapper::toReportDto).toList();
    }

    private String currentAdminName() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return "System Admin";
        }
        if (auth.getPrincipal() instanceof CustomUserDetails details) {
            return details.getUser().getFirstName() + " " + details.getUser().getLastName();
        }
        return String.valueOf(auth.getName());
    }

    private User findCurrentAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails details) {
            return details.getUser();
        }
        throw new ResourceNotFoundException("Admin user not found");
    }

    public List<ReportDto> getAllReports() {
        return reportRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(DtoMapper::toReportDto).toList();
    }

    @Transactional
    public ReportDto resolveReport(Long reportId, ReportStatus status) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        report.setStatus(status);
        ReportDto dto = DtoMapper.toReportDto(reportRepository.save(report));
        activityService.log(findCurrentAdmin(), "REPORT_RESOLVED", "Resolved report #" + reportId);
        return dto;
    }

    @Transactional
    public ReportDto dismissReport(Long reportId) {
        return resolveReport(reportId, ReportStatus.DISMISSED);
    }

    @Transactional
    public ReportDto disableReportedUser(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        User targetUser = report.getReportedUser();
        disableUser(targetUser.getId(), "Disabled due to report #" + reportId);
        return DtoMapper.toReportDto(report);
    }

    public AdminAnalyticsDto getAnalytics() {
        AdminAnalyticsDto dto = new AdminAnalyticsDto();
        dto.setTotalUsers(userRepository.count());
        dto.setActiveUsers(userRepository.countByEnabled(true));
        dto.setTotalExchanges(exchangeRepository.count());
        dto.setCompletedExchanges(exchangeRepository.countByStatus(RequestStatus.COMPLETED));
        dto.setPendingExchanges(exchangeRepository.countByStatus(RequestStatus.PENDING));
        dto.setOpenReports(reportRepository.countByStatus(ReportStatus.OPEN));
        dto.setTotalSkills(skillRepository.count());
        return dto;
    }

    public AdminDashboardDto getDashboard() {
        AdminDashboardDto dashboard = new AdminDashboardDto();
        dashboard.setAnalytics(getAnalytics());
        dashboard.setOpenReports(getOpenReports());
        dashboard.setAuditLogs(activityService.getAll());
        return dashboard;
    }

    public List<ActivityDto> getAuditLogs() {
        return activityService.getAll();
    }

    public List<UserDto> getUsers() {
        return getAllUsers();
    }

    public List<ExchangeRequestDto> getAllExchanges() {
        return exchangeRepository.findAll().stream().map(DtoMapper::toExchangeDto).toList();
    }
}
