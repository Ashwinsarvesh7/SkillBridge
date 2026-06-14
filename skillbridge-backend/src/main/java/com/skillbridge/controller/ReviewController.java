package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.security.SecurityUtils;
import com.skillbridge.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewDto>> create(@Valid @RequestBody CreateReviewRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.create(SecurityUtils.getCurrentUserId(), request)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(reviewService.getForUser(userId)));
    }
}
