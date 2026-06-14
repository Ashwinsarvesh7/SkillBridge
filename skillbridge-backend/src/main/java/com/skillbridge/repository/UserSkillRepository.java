package com.skillbridge.repository;

import com.skillbridge.entity.UserSkill;
import com.skillbridge.entity.enums.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);
    Optional<UserSkill> findByUserIdAndSkillIdAndSkillType(Long userId, Long skillId, SkillType skillType);

    @Query("SELECT us FROM UserSkill us WHERE us.user.id = :userId AND us.skillType = :type")
    List<UserSkill> findByUserIdAndType(@Param("userId") Long userId, @Param("type") SkillType type);

    @Query("SELECT DISTINCT u.id FROM User u " +
           "JOIN UserSkill teach ON teach.user.id = u.id AND teach.skillType = 'TEACH' " +
           "JOIN UserSkill learn ON learn.user.id = u.id AND learn.skillType = 'LEARN' " +
           "WHERE u.id <> :userId AND u.enabled = true " +
           "AND teach.skill.id IN :learnSkillIds AND learn.skill.id IN :teachSkillIds")
    List<Long> findMatchingUserIds(@Param("userId") Long userId,
                                   @Param("teachSkillIds") List<Long> teachSkillIds,
                                   @Param("learnSkillIds") List<Long> learnSkillIds);
}
