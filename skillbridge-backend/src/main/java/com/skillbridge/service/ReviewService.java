package com.skillbridge.service;

import com.skillbridge.dto.CreateReviewRequest;
import com.skillbridge.dto.ReviewDto;
import com.skillbridge.entity.ExchangeRequest;
import com.skillbridge.entity.Review;
import com.skillbridge.entity.User;
import com.skillbridge.entity.enums.NotificationType;
import com.skillbridge.entity.enums.RequestStatus;
import com.skillbridge.exception.BadRequestException;
import com.skillbridge.exception.ResourceNotFoundException;
import com.skillbridge.repository.ExchangeRequestRepository;
import com.skillbridge.repository.ReviewRepository;
import com.skillbridge.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ExchangeRequestRepository exchangeRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository,
                         ExchangeRequestRepository exchangeRepository,
                         NotificationService notificationService, ActivityService activityService) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.exchangeRepository = exchangeRepository;
        this.notificationService = notificationService;
        this.activityService = activityService;
    }

    @Transactional
    public ReviewDto create(Long reviewerId, CreateReviewRequest request) {
        if (reviewRepository.existsByReviewerIdAndExchangeRequestId(reviewerId, request.getExchangeRequestId())) {
            throw new BadRequestException("Review already submitted");
        }
        ExchangeRequest exchange = exchangeRepository.findById(request.getExchangeRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Exchange not found"));
        if (exchange.getStatus() != RequestStatus.COMPLETED) {
            throw new BadRequestException("Exchange must be completed before review");
        }
        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));
        User reviewed = userRepository.findById(request.getReviewedUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewed user not found"));

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewedUser(reviewed);
        review.setExchangeRequest(exchange);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review = reviewRepository.save(review);

        updateUserRating(reviewed);
        notificationService.create(reviewed, "New Review",
                reviewer.getFirstName() + " rated you " + request.getRating() + " stars",
                NotificationType.REVIEW, "/profile");
        activityService.log(reviewer, "REVIEW", "Left a review for " + reviewed.getFirstName());
        return DtoMapper.toReviewDto(review);
    }

    public List<ReviewDto> getForUser(Long userId) {
        return reviewRepository.findByReviewedUserIdOrderByCreatedAtDesc(userId)
                .stream().map(DtoMapper::toReviewDto).toList();
    }

    private void updateUserRating(User user) {
        List<Review> reviews = reviewRepository.findByReviewedUserIdOrderByCreatedAtDesc(user.getId());
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        user.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
        user.setTotalReviews(reviews.size());
        userRepository.save(user);
    }
}
