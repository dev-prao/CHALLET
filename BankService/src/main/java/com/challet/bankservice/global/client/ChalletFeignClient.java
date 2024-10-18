package com.challet.bankservice.global.client;

import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import com.challet.bankservice.domain.dto.response.PaymentHttpMessageResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "challet")
public interface ChalletFeignClient {

    @PostMapping("/api/challet/message/payments")
    void sendPaymentMessage(@RequestBody PaymentHttpMessageResponseDTO dto);

    @GetMapping("/api/challet/message/info")
    UserInfoMessageRequestDTO getUserInfo(
        @RequestHeader(value = "Authorization", required = false) String header);

    @PostMapping("/api/challet/message/simple-password")
    boolean sendSimplePassword(@RequestHeader("Authorization") String header,
        @RequestBody String password);
}