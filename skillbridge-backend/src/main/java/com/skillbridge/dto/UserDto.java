package com.skillbridge.dto;

import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.UserRole;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class UserDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String profilePhotoUrl;
    private ExperienceLevel experienceLevel;
    private UserRole role;
    private int profileCompletionPercent;
    private boolean enabled = true;
    private String disabledBy;
    private LocalDateTime disabledDate;
    private String disabledReason;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private BigDecimal averageRating;
    private int totalReviews;
    private List<UserSkillDto> skills = new ArrayList<>();
    private Double matchScore;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getProfilePhotoUrl() { return profilePhotoUrl; }
    public void setProfilePhotoUrl(String profilePhotoUrl) { this.profilePhotoUrl = profilePhotoUrl; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public int getProfileCompletionPercent() { return profileCompletionPercent; }
    public void setProfileCompletionPercent(int profileCompletionPercent) { this.profileCompletionPercent = profileCompletionPercent; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
    public String getDisabledBy() { return disabledBy; }
    public void setDisabledBy(String disabledBy) { this.disabledBy = disabledBy; }
    public LocalDateTime getDisabledDate() { return disabledDate; }
    public void setDisabledDate(LocalDateTime disabledDate) { this.disabledDate = disabledDate; }
    public String getDisabledReason() { return disabledReason; }
    public void setDisabledReason(String disabledReason) { this.disabledReason = disabledReason; }
    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
    public List<UserSkillDto> getSkills() { return skills; }
    public void setSkills(List<UserSkillDto> skills) { this.skills = skills; }
    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
    public String getFullName() { return firstName + " " + lastName; }
}
