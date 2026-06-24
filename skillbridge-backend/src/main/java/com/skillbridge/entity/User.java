package com.skillbridge.entity;

import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.entity.enums.UserRole;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level")
    private ExperienceLevel experienceLevel = ExperienceLevel.BEGINNER;

    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;

    private boolean enabled = true;

    @Column(name = "disabled_by")
    private String disabledBy;

    @Column(name = "disabled_date")
    private LocalDateTime disabledDate;

    @Column(name = "disabled_reason", columnDefinition = "TEXT")
    private String disabledReason;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @Column(name = "profile_completion_percent")
    private int profileCompletionPercent = 0;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Column(name = "total_reviews")
    private int totalReviews = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

   @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        orphanRemoval = true,
        fetch = FetchType.EAGER
)
private List<UserSkill> userSkills = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
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
    public int getProfileCompletionPercent() { return profileCompletionPercent; }
    public void setProfileCompletionPercent(int profileCompletionPercent) { this.profileCompletionPercent = profileCompletionPercent; }
    public BigDecimal getAverageRating() { return averageRating; }
    public void setAverageRating(BigDecimal averageRating) { this.averageRating = averageRating; }
    public int getTotalReviews() { return totalReviews; }
    public void setTotalReviews(int totalReviews) { this.totalReviews = totalReviews; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public List<UserSkill> getUserSkills() { return userSkills; }
    public void setUserSkills(List<UserSkill> userSkills) { this.userSkills = userSkills; }
}
