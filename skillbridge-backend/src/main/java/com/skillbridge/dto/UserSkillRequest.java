package com.skillbridge.dto;

import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.SkillType;
import jakarta.validation.constraints.NotNull;

public class UserSkillRequest {
    @NotNull
    private Long skillId;
    @NotNull
    private SkillType skillType;
    private ExperienceLevel experienceLevel = ExperienceLevel.BEGINNER;

    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public SkillType getSkillType() { return skillType; }
    public void setSkillType(SkillType skillType) { this.skillType = skillType; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
}
