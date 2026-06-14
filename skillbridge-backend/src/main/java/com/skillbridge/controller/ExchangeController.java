package com.skillbridge.controller;

import com.skillbridge.dto.*;
import com.skillbridge.entity.enums.RequestStatus;
import com.skillbridge.security.SecurityUtils;
import com.skillbridge.service.ExchangeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/exchanges")
public class ExchangeController {

    private final ExchangeService exchangeService;

    public ExchangeController(ExchangeService exchangeService) {
        this.exchangeService = exchangeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> create(@Valid @RequestBody CreateExchangeRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(exchangeService.create(SecurityUtils.getCurrentUserId(), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExchangeRequestDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.ok(exchangeService.getAllForUser(SecurityUtils.getCurrentUserId())));
    }

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<ExchangeRequestDto>>> getActive() {
        return ResponseEntity.ok(ApiResponse.ok(exchangeService.getActive(SecurityUtils.getCurrentUserId())));
    }

    @PatchMapping("/{id}/respond")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> respond(
            @PathVariable Long id, @RequestBody Map<String, String> body) {
        RequestStatus status = RequestStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok(
                exchangeService.respond(SecurityUtils.getCurrentUserId(), id, status)));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> complete(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                exchangeService.complete(SecurityUtils.getCurrentUserId(), id)));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<ExchangeRequestDto>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(
                exchangeService.cancel(SecurityUtils.getCurrentUserId(), id)));
    }
}
