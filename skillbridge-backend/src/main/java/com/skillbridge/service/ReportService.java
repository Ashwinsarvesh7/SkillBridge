package com.skillbridge.service;

import com.skillbridge.dto.CreateReportRequest;
import com.skillbridge.dto.ReportDto;
import com.skillbridge.entity.Report;
import com.skillbridge.entity.User;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ReportRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReportDto create(Long reporterId, CreateReportRequest request) {
        if (reporterId.equals(request.getReportedUserId())) {
            throw new BadRequestException("Cannot report yourself");
        }
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found"));
        User reported = userRepository.findById(request.getReportedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reported user not found"));

        Report report = new Report();
        report.setReporter(reporter);
        report.setReportedUser(reported);
        report.setReason(request.getReason());
        return DtoMapper.toReportDto(reportRepository.save(report));
    }
}
