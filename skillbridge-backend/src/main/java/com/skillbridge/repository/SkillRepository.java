package com.skillbridge.repository;

import com.skillbridge.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Optional<Skill> findByNameIgnoreCase(String name);
    List<Skill> findByCategoryIgnoreCase(String category);
    List<Skill> findByNameContainingIgnoreCase(String name);
}
