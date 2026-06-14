package com.skillbridge.dto;

import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.SkillType;

public class UserSkillDto {
    private Long id;
    private Long skillId;
    private String skillName;
    private String category;
    private SkillType skillType;
    private ExperienceLevel experienceLevel;
    private String badgeLevel;
    private int completedExchanges;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getSkillId() { return skillId; }
    public void setSkillId(Long skillId) { this.skillId = skillId; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public SkillType getSkillType() { return skillType; }
    public void setSkillType(SkillType skillType) { this.skillType = skillType; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getBadgeLevel() { return badgeLevel; }
    public void setBadgeLevel(String badgeLevel) { this.badgeLevel = badgeLevel; }
    public int getCompletedExchanges() { return completedExchanges; }
    public void setCompletedExchanges(int completedExchanges) { this.completedExchanges = completedExchanges; }
}
