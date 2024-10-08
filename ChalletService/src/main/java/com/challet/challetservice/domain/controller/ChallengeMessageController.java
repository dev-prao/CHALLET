package com.challet.challetservice.domain.controller;

import com.challet.challetservice.domain.dto.response.UserInfoMessageResponseDTO;
import com.challet.challetservice.domain.request.PaymentHttpMessageRequestDTO;
import com.challet.challetservice.domain.service.AuthService;
import com.challet.challetservice.domain.service.ChallengeService;
import com.challet.challetservice.domain.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/challet/message")
@Tag(name = "ChallengeMessageController", description = "ch-bank에서 결제 시 메시지 받는 controller")
public class ChallengeMessageController {

    private final UserService userService;
    private final ChallengeService challengeService;
    private final AuthService authService;

    @PostMapping("/payments")
    public ResponseEntity<?> getPaymentMessage(
        @RequestBody PaymentHttpMessageRequestDTO paymentNotification) {
        challengeService.handlePayment(paymentNotification);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/info")
    public ResponseEntity<UserInfoMessageResponseDTO> getUserInfo(
        @RequestHeader(value = "Authorization", required = false) String header) {
        UserInfoMessageResponseDTO userInfoMessage = userService.getUserInfoMessage(header);
        return ResponseEntity.status(HttpStatus.OK).body(userInfoMessage);
    }

    @PostMapping("/simple-password")
    public boolean sendSimplePassword(@RequestHeader("Authorization") String token,
        @RequestBody String password) {
        return authService.checkPassword(token, password);
    }
}