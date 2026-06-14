package com.skillbridge.service;

import com.skillbridge.entity.ExchangeRequest;
import com.skillbridge.entity.Session;
import com.skillbridge.repository.SessionRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;

    public SessionService(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public Session createSession(ExchangeRequest exchangeRequest) {
        if (exchangeRequest.getSession() != null) {
            return exchangeRequest.getSession();
        }
        Session session = new Session();
        session.setExchangeRequest(exchangeRequest);
        session.setRoomId(generateRoomId());
        return sessionRepository.save(session);
    }

    private String generateRoomId() {
        return UUID.randomUUID().toString().split("-")[0];
    }
}
