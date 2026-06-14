package com.skillbridge.controller;

import com.skillbridge.dto.ApiResponse;
import com.skillbridge.dto.CreateReportRequest;
import com.skillbridge.dto.ReportDto;
import com.skillbridge.security.SecurityUtils;
import com.skillbridge.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReportDto>> create(@Valid @RequestBody CreateReportRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(reportService.create(SecurityUtils.getCurrentUserId(), request)));
    }
}
