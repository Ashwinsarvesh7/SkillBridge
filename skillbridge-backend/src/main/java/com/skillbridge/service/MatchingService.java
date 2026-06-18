package com.skillbridge.service;

import com.skillbridge.dto.UserDto;
import com.skillbridge.entity.User;
import com.skillbridge.entity.UserSkill;
import com.skillbridge.entity.enums.SkillType;
import com.skillbridge.repository.UserRepository;
import com.skillbridge.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class MatchingService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;

    public MatchingService(UserRepository userRepository, UserSkillRepository userSkillRepository) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
    }

    public List<UserDto> getRecommendedMatches(Long userId) {
        List<UserSkill> mySkills = userSkillRepository.findByUserId(userId);
        List<Long> teachIds = mySkills.stream()
                .filter(s -> s.getSkillType() == SkillType.TEACH)
                .map(s -> s.getSkill().getId()).toList();
        List<Long> learnIds = mySkills.stream()
                .filter(s -> s.getSkillType() == SkillType.LEARN)
                .map(s -> s.getSkill().getId()).toList();

        if (teachIds.isEmpty() || learnIds.isEmpty()) {
            return List.of();
        }

        List<Long> matchIds = userSkillRepository.findMatchingUserIds(userId, teachIds, learnIds);
        if (matchIds.isEmpty()) return List.of();

        return userRepository.findByIdIn(matchIds).stream()
                .filter(User::isEnabled)
                .map(user -> {
                    UserDto dto = DtoMapper.toUserDto(user);
                    dto.setMatchScore(calculateMatchScore(user, teachIds, learnIds));
                    return dto;
                })
                .sorted(Comparator.comparing(UserDto::getMatchScore, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(10)
                .collect(Collectors.toList());
    }

    private double calculateMatchScore(User user, List<Long> myTeach, List<Long> myLearn) {
        Set<Long> theirTeach = user.getUserSkills().stream()
                .filter(s -> s.getSkillType() == SkillType.TEACH)
                .map(s -> s.getSkill().getId()).collect(Collectors.toSet());
        Set<Long> theirLearn = user.getUserSkills().stream()
                .filter(s -> s.getSkillType() == SkillType.LEARN)
                .map(s -> s.getSkill().getId()).collect(Collectors.toSet());

        long teachMatch = myTeach.stream().filter(theirLearn::contains).count();
        long learnMatch = myLearn.stream().filter(theirTeach::contains).count();
        return (teachMatch + learnMatch) * 50.0;
    }
}
