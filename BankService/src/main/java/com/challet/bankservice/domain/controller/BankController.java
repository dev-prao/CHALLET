package com.challet.bankservice.domain.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bank-service")
public class BankController {
    
    //개발 시 지우기
    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to Bank Service";
    }
}
