package com.skillbridge.service;

import com.skillbridge.dto.ProfileUpdateRequest;
import com.skillbridge.dto.UserDto;
import com.skillbridge.dto.UserSkillDto;
import com.skillbridge.dto.UserSkillRequest;
import com.skillbridge.entity.Skill;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.SkillType;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.SkillRepository;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final SkillRepository skillRepository;
    private final ActivityService activityService;

    @Value("${skillbridge.upload.dir:uploads}")
    private String uploadDir;

    public UserService(UserRepository userRepository, UserSkillRepository userSkillRepository,
                       SkillRepository skillRepository, ActivityService activityService) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.skillRepository = skillRepository;
        this.activityService = activityService;
    }

    @Transactional(readOnly = true)
public UserDto getProfile(Long userId) {
    User user = findUser(userId);
    user.getUserSkills().size();
    return DtoMapper.toUserDto(user);
}

    public UserDto getUserById(Long id) {
        User user = findUser(id);
        user.getUserSkills().size();
        return DtoMapper.toUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = findUser(userId);
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getExperienceLevel() != null) user.setExperienceLevel(request.getExperienceLevel());
        if (request.getFirstName() != null) user.setFirstName(request.getFirstName());
        if (request.getLastName() != null) user.setLastName(request.getLastName());
        user.setProfileCompletionPercent(calculateCompletion(user));
        user = userRepository.save(user);
        activityService.log(user, "PROFILE_UPDATE", "Profile updated");
        return DtoMapper.toUserDto(user);
    }

    @Transactional
    public UserDto uploadPhoto(Long userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        User user = findUser(userId);
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path path = dir.resolve(filename);
        Files.write(path, file.getBytes());
        user.setProfilePhotoUrl("/api/uploads/" + filename);
        user.setProfileCompletionPercent(calculateCompletion(user));
        userRepository.save(user);
        return DtoMapper.toUserDto(user);
    }

    @Transactional
    public UserSkillDto addSkill(Long userId, UserSkillRequest request) {
        User user = findUser(userId);
        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));
        if (userSkillRepository.findByUserIdAndSkillIdAndSkillType(userId, skill.getId(), request.getSkillType()).isPresent()) {
            throw new BadRequestException("Skill already added");
        }
        UserSkill us = new UserSkill();
        us.setUser(user);
        us.setSkill(skill);
        us.setSkillType(request.getSkillType());
        us.setExperienceLevel(request.getExperienceLevel() != null ? request.getExperienceLevel() : ExperienceLevel.BEGINNER);
        us = userSkillRepository.save(us);
        user.setProfileCompletionPercent(calculateCompletion(user));
        userRepository.save(user);
        activityService.log(user, "SKILL_ADDED", "Added skill: " + skill.getName());
        return DtoMapper.toUserSkillDto(us);
    }

    @Transactional
    public void removeSkill(Long userId, Long userSkillId) {
        UserSkill us = userSkillRepository.findById(userSkillId)
                .orElseThrow(() -> new ResourceNotFoundException("User skill not found"));
        if (!us.getUser().getId().equals(userId)) {
            throw new BadRequestException("Not authorized");
        }
        userSkillRepository.delete(us);
        User user = findUser(userId);
        user.setProfileCompletionPercent(calculateCompletion(user));
        userRepository.save(user);
    }

    public List<UserDto> searchUsers(Long currentUserId, String skill, String category, ExperienceLevel level) {
        return userRepository.searchUsers(currentUserId, skill, category, level)
                .stream().map(u -> {
                    u.getUserSkills().size();
                    return DtoMapper.toUserDto(u);
                }).toList();
    }

    private int calculateCompletion(User user) {
        int score = 20;
        if (user.getBio() != null && !user.getBio().isBlank()) score += 20;
        if (user.getProfilePhotoUrl() != null) score += 20;
        long teach = userSkillRepository.findByUserIdAndType(user.getId(), SkillType.TEACH).size();
        long learn = userSkillRepository.findByUserIdAndType(user.getId(), SkillType.LEARN).size();
        if (teach > 0) score += 20;
        if (learn > 0) score += 20;
        return Math.min(score, 100);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
