package com.skillbridge.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateReviewRequest {
    @NotNull
    private Long exchangeRequestId;
    @NotNull
    private Long reviewedUserId;
    @Min(1) @Max(5)
    private int rating;
    @Size(max = 2000)
    private String comment;

    public Long getExchangeRequestId() { return exchangeRequestId; }
    public void setExchangeRequestId(Long exchangeRequestId) { this.exchangeRequestId = exchangeRequestId; }
    public Long getReviewedUserId() { return reviewedUserId; }
    public void setReviewedUserId(Long reviewedUserId) { this.reviewedUserId = reviewedUserId; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
