package com.skillbridge.repository;

import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRoleAndEnabled(UserRole role, boolean enabled);
    long countByEnabled(boolean enabled);

    @Query("SELECT DISTINCT u FROM User u JOIN u.userSkills us JOIN us.skill s " +
           "WHERE u.id <> :userId AND u.enabled = true " +
           "AND (:skillName IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :skillName, '%'))) " +
           "AND (:category IS NULL OR LOWER(s.category) = LOWER(:category)) " +
           "AND (:experienceLevel IS NULL OR u.experienceLevel = :experienceLevel)")
    List<User> searchUsers(@Param("userId") Long userId,
                           @Param("skillName") String skillName,
                           @Param("category") String category,
                           @Param("experienceLevel") ExperienceLevel experienceLevel);
}
