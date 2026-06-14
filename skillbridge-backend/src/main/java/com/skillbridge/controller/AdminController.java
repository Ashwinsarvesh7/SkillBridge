package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.entity.enums.ReportStatus;
import com.skillbridge.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getUserById(id)));
    }

    @PatchMapping("/users/{id}/disable")
    public ResponseEntity<ApiResponse<Void>> disableUser(@PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.disableUser(id, body.getOrDefault("reason", "Disabled by admin"));
        return ResponseEntity.ok(ApiResponse.ok("User disabled", null));
    }

    @PatchMapping("/users/{id}/enable")
    public ResponseEntity<ApiResponse<Void>> enableUser(@PathVariable Long id) {
        adminService.enableUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User enabled", null));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted", null));
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.updateUser(id, body)));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<List<ReportDto>>> getReports() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllReports()));
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<ReportDto>> resolveReport(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.resolveReport(id, ReportStatus.RESOLVED)));
    }

    @PutMapping("/reports/{id}/dismiss")
    public ResponseEntity<ApiResponse<ReportDto>> dismissReport(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.dismissReport(id)));
    }

    @PutMapping("/reports/{id}/disable-user")
    public ResponseEntity<ApiResponse<ReportDto>> disableReportedUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(adminService.disableReportedUser(id)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getDashboard()));
    }

    @GetMapping("/logs")
    public ResponseEntity<ApiResponse<List<ActivityDto>>> getLogs() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAuditLogs()));
    }

    @GetMapping("/exchanges")
    public ResponseEntity<ApiResponse<List<ExchangeRequestDto>>> getAllExchanges() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAllExchanges()));
    }

    @GetMapping("/analytics")
    public ResponseEntity<ApiResponse<AdminAnalyticsDto>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.ok(adminService.getAnalytics()));
    }
}
