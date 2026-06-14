package com.skillbridge.dto;

import com.skillbridge.entity.enums.ExperienceLevel;
import jakarta.validation.constraints.Size;

public class ProfileUpdateRequest {
    @Size(max = 2000)
    private String bio;
    private ExperienceLevel experienceLevel;
    @Size(max = 100)
    private String firstName;
    @Size(max = 100)
    private String lastName;

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public ExperienceLevel getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(ExperienceLevel experienceLevel) { this.experienceLevel = experienceLevel; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
