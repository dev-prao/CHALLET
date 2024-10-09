package com.challet.challetservice.domain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/challet-service")
public class ChalletController {

    // 개발 시 지우기
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Bank Service";
    }
}
