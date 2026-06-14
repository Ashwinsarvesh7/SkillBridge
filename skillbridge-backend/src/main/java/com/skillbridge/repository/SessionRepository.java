package com.skillbridge.repository;

import com.skillbridge.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    Optional<Session> findByExchangeRequestId(Long exchangeRequestId);
}
