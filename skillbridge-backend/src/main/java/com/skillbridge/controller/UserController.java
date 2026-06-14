package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.entity.enums.ExperienceLevel;
import com.skillbridge.security.SecurityUtils;
import com.skillbridge.service.MatchingService;
import com.skillbridge.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final MatchingService matchingService;

    public UserController(UserService userService, MatchingService matchingService) {
        this.userService = userService;
        this.matchingService = matchingService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getProfile(SecurityUtils.getCurrentUserId())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.updateProfile(SecurityUtils.getCurrentUserId(), request)));
    }

    @PostMapping("/me/photo")
    public ResponseEntity<ApiResponse<UserDto>> uploadPhoto(@RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(ApiResponse.ok(userService.uploadPhoto(SecurityUtils.getCurrentUserId(), file)));
    }

    @PostMapping("/me/skills")
    public ResponseEntity<ApiResponse<UserSkillDto>> addSkill(@Valid @RequestBody UserSkillRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(userService.addSkill(SecurityUtils.getCurrentUserId(), request)));
    }

    @DeleteMapping("/me/skills/{id}")
    public ResponseEntity<ApiResponse<Void>> removeSkill(@PathVariable Long id) {
        userService.removeSkill(SecurityUtils.getCurrentUserId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Skill removed", null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getUserById(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserDto>>> search(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) ExperienceLevel experienceLevel) {
        return ResponseEntity.ok(ApiResponse.ok(
                userService.searchUsers(SecurityUtils.getCurrentUserId(), skill, category, experienceLevel)));
    }

    @GetMapping("/matches")
    public ResponseEntity<ApiResponse<List<UserDto>>> getMatches() {
        return ResponseEntity.ok(ApiResponse.ok(matchingService.getRecommendedMatches(SecurityUtils.getCurrentUserId())));
    }
}
