package com.skillbridge.service;

import com.skillbridge.dto.ActivityDto;
import com.skillbridge.entity.ActivityLog;
import com.skillbridge.entity.User;
import com.skillbridge.repository.ActivityLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ActivityService {

    private final ActivityLogRepository activityLogRepository;

    public ActivityService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional
    public void log(User user, String type, String description) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setActivityType(type);
        log.setDescription(description);
        activityLogRepository.save(log);
    }

    public List<ActivityDto> getRecent(Long userId) {
        return activityLogRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(DtoMapper::toActivityDto).toList();
    }

    public List<ActivityDto> getAll() {
        return activityLogRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(DtoMapper::toActivityDto).toList();
    }
}
