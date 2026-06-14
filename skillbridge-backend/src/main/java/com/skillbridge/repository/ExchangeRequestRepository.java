package com.skillbridge.repository;

import com.skillbridge.entity.ExchangeRequest;
import com.skillbridge.entity.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findBySenderIdOrderByCreatedAtDesc(Long senderId);
    List<ExchangeRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);
    List<ExchangeRequest> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(Long senderId, Long receiverId);
    List<ExchangeRequest> findBySenderIdOrReceiverIdAndStatusIn(Long senderId, Long receiverId, List<RequestStatus> statuses);
    long countByStatus(RequestStatus status);
}
