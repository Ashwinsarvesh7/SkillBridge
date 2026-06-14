package com.skillbridge.repository;

import com.skillbridge.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewedUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Review> findByReviewerIdAndExchangeRequestId(Long reviewerId, Long exchangeRequestId);
    boolean existsByReviewerIdAndExchangeRequestId(Long reviewerId, Long exchangeRequestId);
}
