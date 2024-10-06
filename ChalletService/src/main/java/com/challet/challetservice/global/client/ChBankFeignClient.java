package com.challet.challetservice.global.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "ch-bank")
public interface ChBankFeignClient {

    @PostMapping("/api/ch-bank")
    ResponseEntity<String> requestCreateChBankAccount(@RequestParam("name") String name,
        @RequestHeader("phoneNumber") String phoneNumber);
}
